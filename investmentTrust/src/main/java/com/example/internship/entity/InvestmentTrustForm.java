package com.example.internship.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.NonNull;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class InvestmentTrustForm {
    @NonNull
    private String bankName;
    @NonNull
    private String subjectName;
    @NonNull
    private Integer bankAccountNum;
    @NonNull
    private Integer accountName;
    @NonNull
    private String  brandName;
    @NonNull
    private Integer amount;
    @NonNull
    private Integer branchName;

    public String getBankName() {
        return bankName;
    }
    public void setBankName(String bankName) {
        this.bankName = bankName;
    }

    public String getSubjectName() {
        return subjectName;
    }
    public void setSubjectName(String subjectName) {
        this.subjectName = subjectName;
    }

    public Integer getBankAccountNum() {
        return bankAccountNum;
    }
    public void setBankAccountNum(Integer bankAccountNum) {this.bankAccountNum = bankAccountNum;}

    public Integer getAccountName() {
        return accountName;
    }
    public void setAccountName(Integer accountName) {
        this.accountName = accountName;
    }

    public String getBrandName() {
        return brandName;
    }
    public void setBrandName(String brandName) {
        this.brandName = brandName;
    }

    public Integer getAmount() {
        return amount;
    }
    public void setAmount(Integer amount) {
        this.amount = amount;
    }

    public Integer getBranchName() {
        return branchName;
    }
    public void setBranchName(Integer branchName) {
        this.branchName = branchName;
    }
}
