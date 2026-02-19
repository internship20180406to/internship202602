from fastapi.testclient import TestClient

from app import app


def test_screening_returns_result_and_reasons():
    client = TestClient(app)
    payload = {
        "loanAmount": 3000000,
        "annualIncome": 5000000,
        "loanPeriod": 20,
        "loanType": "住宅ローン",
    }

    response = client.post("/screening", json=payload)
    assert response.status_code == 200
    body = response.json()

    assert body["result"] in ("通過", "要確認")
    assert 0.0 <= body["score"] <= 1.0
    assert "threshold" in body
    assert body["modelVersion"]
    assert len(body["reasons"]) >= 3

