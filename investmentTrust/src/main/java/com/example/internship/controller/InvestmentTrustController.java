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


@Controller
public class InvestmentTrustController {


    @Autowired
    private OrderInvestmentTrustService orderInvestmentTrustService;
    @GetMapping("/investmentTrust")
    public String bankTransfer(Model model) {
        List<String> bankList = new ArrayList<>();
        List<String> bankAccountTypeList = new ArrayList<>();
        List<String> fundNameList = new ArrayList<>();
        bankList.add("こめ銀行");
        bankList.add("ぱん銀行");
        bankList.add("麺銀行");
        bankAccountTypeList.add("普通預金");
        bankAccountTypeList.add("当座預金");
        bankAccountTypeList.add("貯蓄預金");
        fundNameList.add("ツナマヨ");
        fundNameList.add("梅干し");
        fundNameList.add("鮭");
        model.addAttribute("investmentTrustApplication", new InvestmentTrustForm());
        model.addAttribute("nameOptions", bankList);
        model.addAttribute("fundNameOptions", fundNameList);
        model.addAttribute("bankAccountTypeOptions", bankAccountTypeList);
        return "investmentTrustMain";
    }

    @PostMapping("/investmentTrustConfirmation")
    public String confirmation(@ModelAttribute InvestmentTrustForm investmentTrustForm, Model model) {

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
