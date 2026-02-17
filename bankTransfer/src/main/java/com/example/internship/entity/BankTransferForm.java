package com.example.internship.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.NonNull;
import java.time.LocalDateTime;
import org.springframework.format.annotation.DateTimeFormat;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class BankTransferForm{
    @NonNull
    private String bankName;
    @NonNull
    private Integer bankAccountNum;
    @NonNull
    private String branchName;//支店名
    @NonNull
    private String bankAccountType;
    @NonNull
    private String name;
    @NonNull
    private Integer money;
    @NonNull
    private int transFee;
    @NonNull
    @DateTimeFormat(pattern = "yyyy'年'MM'月'dd'日'HH'時'mm'分'")
    private LocalDateTime transferDateTime;

    public String getBankName() {
        return bankName;
    }

    public void setBankName(String bankName) {
        this.bankName = bankName;
    }

    public Integer getBankAccountNum() {
        return bankAccountNum;
    }

    public void setBankAccountNum(Integer bankAccountNum) {
        this.bankAccountNum = bankAccountNum;
    }

    public String getBranchName() {
        return branchName;
    }

    public void setBranchName(String branchName) {
        this.branchName = branchName;
    }

    public String getBankAccountType() {
        return bankAccountType;
    }

    public void setBankAccountType(String bankAccountType) {
        this.bankAccountType = bankAccountType;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Integer getMoney() {
        return money;
    }

    public void setMoney(Integer money) {
        this.money = money;
    }

    public Integer getTransFee() {
        int fee = 0;
        if(!bankName.equals("こども銀行")&&!bankName.equals("おにぎり銀行")&&!bankName.equals("ながれぼし銀行")){
            if(money < 30000){
                fee = 220;
            }else{
                fee = 440;
            }
        }
        return fee;
    }

    public void setTransFee(Integer transFee) {
        this.transFee = transFee;
    }

    public LocalDateTime getTransferDateTime() {
        return transferDateTime;
    }

    public void setTransferDateTime(LocalDateTime transferDateTime) {
        this.transferDateTime = transferDateTime;
    }
}
