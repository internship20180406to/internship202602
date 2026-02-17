// Form（フォーム）：運び屋・注文票
//画面とJavaの間でデータをやり取りするための「箱」です。
//たとえ： お客さまが記入する「オーダーシート（注文票）」
//「銀行名」「口座番号」「金額」などの項目をひとまとめにして持つ。
//画面で入力された内容を一時的にキープして、Controllerへ運ぶ。
//コードの特徴： private String bankName; などの変数と、Getter/Setterが並んでいる。
//Entity（エンティティ）：倉庫の記録・台帳
//データベース（DB）のテーブルと1対1で対応する、保存用のデータ形式です。
//たとえ： お店の「売上台帳（記録）」
//やること：
//データベースに保存する項目を定義する。
//（今回の小規模な練習ではFormとEntityを兼ねることもありますが、本来は「入力用」と「保存用」で分けます）
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
