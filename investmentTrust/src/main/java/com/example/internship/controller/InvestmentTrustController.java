//1. Controller（コントローラー）：指令塔・司令官
//「どの画面を表示するか」「どの処理を呼び出すか」を決める場所です。
//たとえ： レストランの「店員（オーダー取り）」
//ユーザーがボタンを押したときに「はい、次は確認画面ですね！」と案内する。
//画面から届いたデータを「これ、保存しておいて」とService（キッチン）に渡す。
//「受付番号」などの新しい情報を生成して、画面に届ける準備をする。
//コードの特徴： @Controller や @PostMapping がついている。
package com.example.internship.controller;

import com.example.internship.entity.InvestmentTrustForm;
import com.example.internship.service.OrderInvestmentTrustService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;


import java.util.LinkedHashMap; // 順番を保持するMap
import java.util.Map;

@Controller
public class InvestmentTrustController {

    @Autowired
    private OrderInvestmentTrustService orderInvestmentTrustService;

    @GetMapping("/investmentTrust")
    public String bankTransfer(Model model) {
        // --- 既存のリスト ---
        List<String> bankList = List.of("こめ銀行", "ぱん銀行", "麺銀行");
        List<String> bankAccountTypeList = List.of("普通預金", "当座預金", "貯蓄預金");

        // --- 修正ポイント：銘柄と単価をMapで管理する ---
        Map<String, Integer> fundPrices = new LinkedHashMap<>();
        fundPrices.put("ツナマヨ", 100); // 1口100円
        fundPrices.put("梅干し", 200);  // 1口200円
        fundPrices.put("鮭", 500);     // 1口500円

        model.addAttribute("investmentTrustApplication", new InvestmentTrustForm());
        model.addAttribute("nameOptions", bankList);
        model.addAttribute("bankAccountTypeOptions", bankAccountTypeList);

        // 銘柄名のリスト（選択肢用）と、単価データ（計算用）を両方渡す
        model.addAttribute("fundNameOptions", fundPrices.keySet());
        model.addAttribute("fundPrices", fundPrices);

        return "investmentTrustMain";
    }

    @PostMapping("/investmentTrustConfirmation")
    public String confirmation(@ModelAttribute InvestmentTrustForm investmentTrustForm, Model model) {
        int unitPrice = 0;
        String fundName = investmentTrustForm.getFundName();
        if ("ツナマヨ".equals(fundName)) unitPrice = 100;
        else if ("梅干し".equals(fundName)) unitPrice = 200;
        else if ("鮭".equals(fundName)) unitPrice = 500;

        // 口数を計算（金額 / 単価）
        double computedQuantity = 0;
        if (unitPrice > 0 && investmentTrustForm.getMoney() != null) {
            computedQuantity = (double) investmentTrustForm.getMoney() / unitPrice;
        }

        model.addAttribute("investmentTrustApplication", investmentTrustForm);
        model.addAttribute("unitPrice", unitPrice); // 1口あたりの円
        model.addAttribute("computedQuantity", String.format("%.2f", computedQuantity)); // 小数点第2位まで

        System.out.println(investmentTrustForm);
        model.addAttribute("bankName", investmentTrustForm.getBankName());
        model.addAttribute("branchName", investmentTrustForm.getBranchName());
        model.addAttribute("bankAccountType", investmentTrustForm.getBankAccountType());
        model.addAttribute("bankAccountNum", investmentTrustForm.getBankAccountNum());
        model.addAttribute("name", investmentTrustForm.getName());
        model.addAttribute("money", investmentTrustForm.getMoney());
        model.addAttribute("fundName", investmentTrustForm.getFundName());
        model.addAttribute("investmentTrustApplication", investmentTrustForm);
        return "investmentTrustConfirmation";
    }

    @PostMapping("/investmentTrustCompletion")
    public String completion(@ModelAttribute InvestmentTrustForm investmentTrustForm, Model model) {
        String receiptNo = UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        model.addAttribute("receiptNo", receiptNo);
        orderInvestmentTrustService.orderInvestmentTrust(investmentTrustForm);
        return "investmentTrustCompletion";
    }
    // アプリ紹介ページを表示する
    @GetMapping("/bankAppIntro")
    public String showAppIntro() {
        return "bankAppIntro"; // HTMLファイル名を指定
    }





}
