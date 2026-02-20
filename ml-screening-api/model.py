from __future__ import annotations

import math
import os
from dataclasses import dataclass
from pathlib import Path

import joblib
import numpy as np
import lightgbm as lgb


@dataclass
class Reason:
    label: str
    direction: str
    detail: str


@dataclass
class ScreeningResult:
    result: str
    score: float
    threshold: float
    model_version: str
    reasons: list[Reason]


@dataclass
class ModelBundle:
    model: lgb.LGBMClassifier
    feature_names: list[str]
    threshold: float
    model_version: str


MODEL_PATH = Path(__file__).resolve().parent / "model.joblib"
FEATURE_NAMES = [
    "debt_ratio",
    "loan_period",
    "loan_type_housing",
    "loan_type_education",
    "loan_type_car",
    "loan_type_free",
]

_MODEL_BUNDLE: ModelBundle | None = None


def _clamp(value: float, low: float, high: float) -> float:
    return max(low, min(high, value))


def _temperature_scale(probability: float, temperature: float = 1.6) -> float:
    # Avoid infinities while softening extreme probabilities.
    prob = _clamp(probability, 1e-6, 1.0 - 1e-6)
    logit = math.log(prob / (1.0 - prob))
    scaled = 1.0 / (1.0 + math.exp(-logit / temperature))
    return _clamp(scaled, 0.0, 1.0)


def _loan_type_flags(loan_type: str | None) -> dict[str, int]:
    loan_type = loan_type or ""
    return {
        "loan_type_housing": 1 if "住宅" in loan_type else 0,
        "loan_type_education": 1 if "教育" in loan_type else 0,
        "loan_type_car": 1 if "マイカー" in loan_type else 0,
        "loan_type_free": 1 if "フリー" in loan_type else 0,
    }


def _build_feature_vector(
    loan_amount: int,
    annual_income: int,
    loan_period: int,
    loan_type: str | None,
) -> np.ndarray:
    income = max(annual_income, 1)
    debt_ratio = loan_amount / income
    flags = _loan_type_flags(loan_type)
    values = [
        debt_ratio,
        float(loan_period),
        float(flags["loan_type_housing"]),
        float(flags["loan_type_education"]),
        float(flags["loan_type_car"]),
        float(flags["loan_type_free"]),
    ]
    return np.array([values], dtype=float)


def _generate_training_data(
    sample_size: int = 6000,
    seed: int = 42,
) -> tuple[np.ndarray, np.ndarray]:
    rng = np.random.default_rng(seed)
    loan_amount = rng.integers(500_000, 20_000_000, size=sample_size)
    annual_income = rng.integers(2_000_000, 12_000_000, size=sample_size)
    loan_period = rng.integers(5, 35, size=sample_size)
    loan_types = rng.choice(["住宅", "教育", "マイカー", "フリー", "その他"], size=sample_size)

    debt_ratio = loan_amount / np.maximum(annual_income, 1)

    base_score = 1.0
    base_score -= np.clip(debt_ratio / 4.0, 0.0, 0.7)
    base_score -= np.clip((loan_period - 10) / 40.0, 0.0, 0.2)

    type_adjustment = np.zeros(sample_size, dtype=float)
    type_adjustment += np.where(loan_types == "住宅", 0.05, 0.0)
    type_adjustment += np.where(loan_types == "教育", 0.02, 0.0)
    type_adjustment += np.where(loan_types == "フリー", -0.05, 0.0)
    type_adjustment += np.where(loan_types == "マイカー", -0.02, 0.0)

    noise = rng.normal(0.0, 0.03, size=sample_size)
    score = np.clip(base_score + type_adjustment + noise, 0.0, 1.0)
    threshold = 0.6
    labels = (score >= threshold).astype(int)

    features = []
    for idx in range(sample_size):
        flags = _loan_type_flags(loan_types[idx])
        features.append(
            [
                debt_ratio[idx],
                float(loan_period[idx]),
                float(flags["loan_type_housing"]),
                float(flags["loan_type_education"]),
                float(flags["loan_type_car"]),
                float(flags["loan_type_free"]),
            ]
        )

    return np.array(features, dtype=float), labels


def train_and_save_model(
    model_path: Path = MODEL_PATH,
    sample_size: int = 6000,
    seed: int = 42,
) -> ModelBundle:
    x_train, y_train = _generate_training_data(sample_size, seed)

    model = lgb.LGBMClassifier(
        n_estimators=200,
        learning_rate=0.08,
        num_leaves=31,
        max_depth=-1,
        subsample=0.9,
        colsample_bytree=0.9,
        random_state=seed,
        class_weight="balanced",
    )
    model.fit(x_train, y_train)

    bundle = ModelBundle(
        model=model,
        feature_names=list(FEATURE_NAMES),
        threshold=0.6,
        model_version="ml-lightgbm-v1",
    )
    joblib.dump(bundle, model_path)
    return bundle


def _load_model_bundle() -> ModelBundle:
    global _MODEL_BUNDLE
    if _MODEL_BUNDLE is not None:
        return _MODEL_BUNDLE

    if MODEL_PATH.exists():
        _MODEL_BUNDLE = joblib.load(MODEL_PATH)
    else:
        _MODEL_BUNDLE = train_and_save_model()
    return _MODEL_BUNDLE


def _build_reasons(
    loan_amount: int,
    annual_income: int,
    loan_period: int,
    loan_type: str | None,
    features: np.ndarray,
    importances: np.ndarray,
) -> list[Reason]:
    income = max(annual_income, 1)
    debt_ratio = loan_amount / income
    flags = _loan_type_flags(loan_type)

    label_map = {
        "debt_ratio": "借入比率",
        "loan_period": "借入期間",
        "loan_type_housing": "ローン種別",
        "loan_type_education": "ローン種別",
        "loan_type_car": "ローン種別",
        "loan_type_free": "ローン種別",
    }

    detail_map = {
        "debt_ratio": f"借入金額が年収の約{math.ceil(debt_ratio * 10) / 10:.1f}倍です。",
        "loan_period": f"借入期間は{loan_period}年です。",
        "loan_type_housing": f"ローン種別は{loan_type or '未入力'}です。",
        "loan_type_education": f"ローン種別は{loan_type or '未入力'}です。",
        "loan_type_car": f"ローン種別は{loan_type or '未入力'}です。",
        "loan_type_free": f"ローン種別は{loan_type or '未入力'}です。",
    }

    active_features = {
        "debt_ratio": True,
        "loan_period": True,
        "loan_type_housing": flags["loan_type_housing"] == 1,
        "loan_type_education": flags["loan_type_education"] == 1,
        "loan_type_car": flags["loan_type_car"] == 1,
        "loan_type_free": flags["loan_type_free"] == 1,
    }

    direction_rules = {
        "debt_ratio": "negative" if debt_ratio >= 2.5 else "positive",
        "loan_period": "negative" if loan_period >= 25 else "positive",
        "loan_type_housing": "positive",
        "loan_type_education": "positive",
        "loan_type_car": "negative",
        "loan_type_free": "negative",
    }

    contributions: list[tuple[str, float]] = []
    feature_values = features[0]
    max_importance = float(np.max(importances)) if importances.size else 1.0
    for idx, name in enumerate(FEATURE_NAMES):
        if not active_features.get(name, False):
            continue
        importance_weight = float(importances[idx]) / max_importance if max_importance else 0.0
        contribution = importance_weight * abs(float(feature_values[idx]))
        contributions.append((name, contribution))

    contributions.sort(key=lambda item: abs(item[1]), reverse=True)

    reasons: list[Reason] = []
    for feature_name, _ in contributions[:3]:
        direction = direction_rules.get(feature_name, "neutral")
        reasons.append(
            Reason(
                label=label_map.get(feature_name, feature_name),
                direction=direction,
                detail=detail_map.get(feature_name, ""),
            )
        )

    if not reasons:
        reasons.append(Reason("審査結果", "neutral", "詳細な根拠はありません。"))
    return reasons


def evaluate_screening(
    loan_amount: int,
    annual_income: int,
    loan_period: int,
    loan_type: str | None,
) -> ScreeningResult:
    bundle = _load_model_bundle()

    features = _build_feature_vector(loan_amount, annual_income, loan_period, loan_type)
    probability = float(bundle.model.predict_proba(features)[0][1])

    threshold = float(os.getenv("SCREENING_THRESHOLD", str(bundle.threshold)))
    model_version = os.getenv("MODEL_VERSION", bundle.model_version)
    score = _temperature_scale(probability)
    result = "通過" if score >= threshold else "要確認"

    reasons = _build_reasons(
        loan_amount=loan_amount,
        annual_income=annual_income,
        loan_period=loan_period,
        loan_type=loan_type,
        features=features,
        importances=np.asarray(bundle.model.feature_importances_, dtype=float),
    )

    return ScreeningResult(
        result=result,
        score=round(score, 3),
        threshold=threshold,
        model_version=model_version,
        reasons=reasons,
    )
