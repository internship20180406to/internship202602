# Screening API (FastAPI)

銀行ローンの簡易審査用に、外部推論 API を提供します。入力された申込情報をもとに、
機械学習モデルで「通過/要確認」「スコア」「根拠」を返却します。

## 概要

- エンドポイント: `POST /screening`
- 入力: 借入金額・年収・借入期間・ローン種別
- 出力: 判定結果、スコア、閾値、モデルバージョン、根拠
- モデル: LightGBM（`model.joblib`）
- `model.joblib` が無い場合は初回推論時に自動生成

## クイックスタート

```powershell
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
uvicorn app:app --host 0.0.0.0 --port 8000
```

## API 仕様

### リクエスト

`POST /screening`

```json
{
  "loanAmount": 3000000,
  "annualIncome": 5000000,
  "loanPeriod": 20,
  "loanType": "住宅ローン"
}
```

- `loanAmount`: 借入金額（整数, JPY）
- `annualIncome`: 年収（整数, JPY）
- `loanPeriod`: 借入期間（年, 整数）
- `loanType`: ローン種別（文字列、未入力可）

### レスポンス

```json
{
  "result": "通過",
  "score": 0.742,
  "threshold": 0.6,
  "modelVersion": "ml-lightgbm-v1",
  "reasons": [
    {"label": "借入比率", "direction": "negative", "detail": "借入金額が年収の約2.3倍です。"},
    {"label": "借入期間", "direction": "positive", "detail": "借入期間は20年です。"},
    {"label": "ローン種別", "direction": "positive", "detail": "ローン種別は住宅ローンです。"}
  ]
}
```

- `result`: `通過` / `要確認`
- `score`: 0〜1 のスコア（温度スケーリング済み）
- `threshold`: 判定閾値（環境変数で変更可）
- `modelVersion`: モデルバージョン（環境変数で上書き可）
- `reasons`: 根拠の配列
  - `label`: 観点名
  - `direction`: `positive` / `negative` / `neutral`
  - `detail`: 説明文

### サンプル（PowerShell）

```powershell
Invoke-RestMethod -Uri "http://localhost:8000/screening" -Method POST -ContentType "application/json" -Body "{`"loanAmount`":3000000,`"annualIncome`":5000000,`"loanPeriod`":20,`"loanType`":`"住宅ローン`"}"
```

## スコアと判定のロジック

- 入力から特徴量を生成
  - `debt_ratio` = `loanAmount / annualIncome`
  - `loan_period`
  - ローン種別のフラグ（住宅/教育/マイカー/フリー）
- LightGBM の確率出力を温度スケーリングしてスコア化
- `score >= threshold` で `通過`、それ以外は `要確認`

## 根拠の生成

- LightGBM の特徴量重要度と入力値から貢献度を算出
- 上位3つの観点を根拠として返却
- 方向性は簡易ルールで判定
  - 例: `debt_ratio >= 2.5` は `negative`

## 学習（train_model.py）

合成データを生成し、LightGBM を学習して `model.joblib` を保存します。

```powershell
python train_model.py
```

オプション:

```powershell
python train_model.py --sample-size 8000 --seed 123
python train_model.py --output model.joblib
```

### 合成データの作り方

- 借入金額・年収・借入期間・ローン種別を乱数で生成
- 借入比率/期間/ローン種別に基づきスコアを作成
- スコアにノイズを加え、`threshold=0.6` を境にラベル化

## 環境変数

- `SCREENING_THRESHOLD`（既定: `0.6`）
- `MODEL_VERSION`（既定: `ml-lightgbm-v1`）

## 構成

```
ml-screening-api/
  app.py              # FastAPI エンドポイント
  model.py            # 特徴量生成・推論・根拠生成
  train_model.py      # 合成データ学習
  model.joblib        # 学習済みモデル（初回推論で自動生成）
  requirements.txt
  tests/
```

## CORS

全許可（`allow_origins=["*"]`）で動作します。ブラウザからの直接呼び出しが可能です。

## トラブルシュート

- `model.joblib` がない: 初回推論で自動生成されます。
- `400 Bad Request`: 必須項目が不足しています。
- `取得失敗`: API の起動、URL、ポートを確認してください。

## テスト

```powershell
pytest
```
