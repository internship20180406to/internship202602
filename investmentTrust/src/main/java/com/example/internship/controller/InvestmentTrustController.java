package com.example.internship.controller;

import com.example.internship.entity.InvestmentTrustForm;
import com.example.internship.service.OrderInvestmentTrustService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import java.util.Arrays;


@Controller
public class InvestmentTrustController {

    @Autowired
    private OrderInvestmentTrustService orderInvestmentTrustService;

    @GetMapping("/investmentTrust")
    public String bankTransfer(Model model) {
        model.addAttribute("investmentTrustApplication", new InvestmentTrustForm());
        model.addAttribute("bankNameOptions", Arrays.asList(
                "山陰共同銀行",
                "大迫銀行",
                "しゅら銀行"
        ));

        model.addAttribute("branchNameOptions", Arrays.asList(
                "鹿児島支店",
                "南さつま支店",
                "名古屋支店"
        ));

        model.addAttribute("bankAccountTypeOptions", Arrays.asList(
                "普通預金",
                "当座預金",
                "貯蓄預金",
                "総合口座"
        ));

        model.addAttribute("fundNameOptions", Arrays.asList(
                "Google",
                "Amazon",
                "Meta",
                "Apple"
        ));

        return "investmentTrustMain";
    }

    @PostMapping("/investmentTrustConfirmation")
    public String confirmation(@ModelAttribute InvestmentTrustForm investmentTrustForm, Model model) {
        model.addAttribute("bankName", investmentTrustForm.getBankName());
        model.addAttribute("bankAccountNum", investmentTrustForm.getBankAccountNum());
        model.addAttribute("investmentTrustApplication", investmentTrustForm);
        return "investmentTrustConfirmation";
    }

    @PostMapping("/investmentTrustCompletion")
    public String completion(@ModelAttribute InvestmentTrustForm investmentTrustForm, Model model) {
        orderInvestmentTrustService.orderInvestmentTrust(investmentTrustForm);
        model.addAttribute("investmentTrustApplication", investmentTrustForm);
        return "investmentTrustCompletion";
    }

}
