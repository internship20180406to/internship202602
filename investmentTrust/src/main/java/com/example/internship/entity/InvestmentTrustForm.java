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
    private String bankName;        // 金融機関名
    @NonNull
    private String branchName;      // 支店名
    @NonNull
    private String accountType;     // 科目名
    @NonNull
    private String bankAccountNum;  // 口座番号
    @NonNull
    private String purchaserName;   // 購入者名
    @NonNull
    private String fundName;        // 銘柄選択
    @NonNull
    private Integer purchaseAmount; // 購入金額
}