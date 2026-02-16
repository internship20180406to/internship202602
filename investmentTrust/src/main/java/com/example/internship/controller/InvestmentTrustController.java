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


@Controller
public class InvestmentTrustController {

    @Autowired
    private OrderInvestmentTrustService orderInvestmentTrustService;
    @GetMapping("/investmentTrust")
    public String bankTransfer(Model model) {
        List<String> bankList = new ArrayList<>();
        List<String> brandNameList = new ArrayList<>();
        bankList.add("こめ銀行");
        bankList.add("ぱん銀行");
        bankList.add("麺銀行");
        brandNameList.add("ツナマヨ");
        brandNameList.add("梅干し");
        brandNameList.add("鮭");
        model.addAttribute("investmentTrustApplication", new InvestmentTrustForm());
        model.addAttribute("nameOptions", bankList);
        model.addAttribute("brandNameOptions", brandNameList);
        return "investmentTrustMain";
    }

    @PostMapping("/investmentTrustConfirmation")
    public String confirmation(@ModelAttribute InvestmentTrustForm investmentTrustForm, Model model) {
        investmentTrustForm.setBankName("ながれぼし銀行");
        model.addAttribute("bankName", investmentTrustForm.getBankName());
        model.addAttribute("bankAccountNum", investmentTrustForm.getBankAccountNum());
        model.addAttribute("amount", investmentTrustForm.getBankAccountNum());
        model.addAttribute("investmentTrustApplication", investmentTrustForm);
        return "investmentTrustConfirmation";
    }

    @PostMapping("/investmentTrustCompletion")
    public String completion(@ModelAttribute InvestmentTrustForm investmentTrustForm, Model model) {
        orderInvestmentTrustService.orderInvestmentTrust(investmentTrustForm);
        return "investmentTrustCompletion";
    }

}
