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
    private String bankAccountType;
    @NonNull
    private Integer bankAccountNum;
    @NonNull
    private String name;
    @NonNull
    private String  fundName;
    @NonNull
    private Integer money;
    @NonNull
    private String branchName;

    public String getBankName() {
        return bankName;
    }
    public void setBankName(String bankName) {
        this.bankName = bankName;
    }

    public String getBankAccountType() {
        return bankAccountType;
    }
    public void setBankAccountType(String bankAccountType) {
        this.bankAccountType = bankAccountType;
    }

    public Integer getBankAccountNum() {
        return bankAccountNum;
    }
    public void setBankAccountNum(Integer bankAccountNum) {this.bankAccountNum = bankAccountNum;}

    public String getName() {
        return name;
    }
    public void setName(String name) {
        this.name = name;
    }

    public String getFundName() {
        return fundName;
    }
    public void setFundName(String fundName) {
        this.fundName = fundName;
    }

    public Integer getMoney() {
        return money;
    }
    public void setMoney(Integer money) {
        this.money = money;
    }

    public String getBranchName() {
        return branchName;
    }
    public void setBranchName(String branchName) {
        this.branchName = branchName;
    }
}
