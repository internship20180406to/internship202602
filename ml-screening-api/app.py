from __future__ import annotations

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from model import evaluate_screening, ScreeningResult

app = FastAPI(title="Screening API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


class ScreeningRequest(BaseModel):
    loanAmount: int = Field(..., ge=0, description="Loan amount (JPY)")
    annualIncome: int = Field(..., ge=0, description="Annual income (JPY)")
    loanPeriod: int = Field(..., ge=0, description="Loan period (years)")
    loanType: str | None = Field(default=None, description="Loan type")


class ScreeningReason(BaseModel):
    label: str
    direction: str
    detail: str


class ScreeningResponse(BaseModel):
    result: str
    score: float
    threshold: float
    modelVersion: str
    reasons: list[ScreeningReason]


@app.post("/screening", response_model=ScreeningResponse)
def screening(request: ScreeningRequest) -> ScreeningResponse:
    result: ScreeningResult = evaluate_screening(
        loan_amount=request.loanAmount,
        annual_income=request.annualIncome,
        loan_period=request.loanPeriod,
        loan_type=request.loanType,
    )
    return ScreeningResponse(
        result=result.result,
        score=result.score,
        threshold=result.threshold,
        modelVersion=result.model_version,
        reasons=[
            ScreeningReason(
                label=reason.label,
                direction=reason.direction,
                detail=reason.detail,
            )
            for reason in result.reasons
        ],
    )
