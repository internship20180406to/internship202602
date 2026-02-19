# Screening API (FastAPI)

Simple external screening API for the bank loan flow. Returns result, score, and reasons.

## Setup

```bash
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
```

## Train model

```bash
python train_model.py
```

Optional arguments:

```bash
python train_model.py --sample-size 8000 --seed 123
python train_model.py --output model.joblib
```

The API will auto-generate `model.joblib` on first request if the file is missing.

## Run

```bash
uvicorn app:app --host 0.0.0.0 --port 8000
```

## Example request

```bash
curl -X POST http://localhost:8000/screening -H "Content-Type: application/json" -d "{\"loanAmount\": 3000000, \"annualIncome\": 5000000, \"loanPeriod\": 20, \"loanType\": \"住宅ローン\"}"
```

## Environment

- `SCREENING_THRESHOLD` (default `0.6`)
- `MODEL_VERSION` (default `demo-v1`)

## Tests

```bash
pytest
```
