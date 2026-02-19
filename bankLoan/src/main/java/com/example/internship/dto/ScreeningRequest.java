package com.example.internship.dto;

import com.example.internship.entity.BankLoanForm;

public class ScreeningRequest {
    private Integer loanAmount;
    private Integer annualIncome;
    private Integer loanPeriod;
    private String loanType;

    public ScreeningRequest() {
    }

    public static ScreeningRequest from(BankLoanForm form) {
        ScreeningRequest request = new ScreeningRequest();
        if (form == null) {
            return request;
        }
        request.setLoanAmount(form.getLoanAmount());
        request.setAnnualIncome(form.getAnnualIncome());
        request.setLoanPeriod(form.getLoanPeriod());
        request.setLoanType(form.getLoanType());
        return request;
    }

    public Integer getLoanAmount() {
        return loanAmount;
    }

    public void setLoanAmount(Integer loanAmount) {
        this.loanAmount = loanAmount;
    }

    public Integer getAnnualIncome() {
        return annualIncome;
    }

    public void setAnnualIncome(Integer annualIncome) {
        this.annualIncome = annualIncome;
    }

    public Integer getLoanPeriod() {
        return loanPeriod;
    }

    public void setLoanPeriod(Integer loanPeriod) {
        this.loanPeriod = loanPeriod;
    }

    public String getLoanType() {
        return loanType;
    }

    public void setLoanType(String loanType) {
        this.loanType = loanType;
    }
}

