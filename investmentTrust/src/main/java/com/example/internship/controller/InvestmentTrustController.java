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
        orderInvestmentTrustService.orderInvestmentTrust(investmentTrustForm);
        return "investmentTrustCompletion";
    }

}
