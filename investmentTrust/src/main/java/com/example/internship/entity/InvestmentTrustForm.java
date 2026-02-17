package com.example.internship.entity;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class InvestmentTrustForm {
    @NotBlank(message = "金融機関名を選択してください")
    private String bankName;

    @NotBlank(message = "支店名を選択してください")
    private String branchName;

    @NotBlank(message = "科目名を選択してください")
    private String bankAccountType;

    @NotNull(message = "口座番号を入力してください")
    @Min(value = 1000000, message = "口座番号は7桁で入力してください")
    @Max(value = 9999999, message = "口座番号は7桁で入力してください")
    private Integer bankAccountNum;

    @NotBlank(message = "購入者名を入力してください")
    @Size(min = 1, max = 20, message = "購入者名は20文字以内で入力してください")
    private String name;

    @NotBlank(message = "銘柄を選択してください")
    private String fundName;

    @NotNull(message = "購入金額を入力してください")
    @Min(value = 1000, message = "購入金額は1,000円以上で入力してください")
    @Max(value = 100000000, message = "購入金額は1億円以下で入力してください")
    private Integer money;
}