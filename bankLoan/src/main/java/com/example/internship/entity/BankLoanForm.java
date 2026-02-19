package com.example.internship.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.NonNull;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class BankLoanForm {
    @NonNull
    private String bankName;
    @NonNull
    private String branchName;
    @NonNull
    private String bankAccountType;
    @NonNull
    private Integer bankAccountNum;
    @NonNull
    private String name;
    @NonNull
    private Integer loanAmount;
    @NonNull
    private Integer annualIncome;
    @NonNull
    private Integer years;
    @NonNull
    private BigDecimal interestRate;
    @NonNull
    private String rateType;

    public String getBankName() {return bankName;}
    public String getBranchName() {return branchName;}
    public String getBankAccountType() {
        return bankAccountType;
    }
    public Integer getBankAccountNum() {return bankAccountNum;}
    public String getName() {
        return name;
    }
    public Integer getLoanAmount() {return loanAmount;}
    public Integer getAnnualIncome() {return annualIncome;}
    public String getRateType() {return rateType;}
    public Integer getyears(){return years;}
    public BigDecimal getInterestRate() {return interestRate;}

    /*
    public void setBankAccountNum(Integer bankAccountNum) {
        this.bankAccountNum = bankAccountNum;
    }
    public void setBranchName(String branchName) {
        this.branchName = branchName;
    }
    public void setBankName(String bankName) {
        this.bankName = bankName;
    }

     */
}


