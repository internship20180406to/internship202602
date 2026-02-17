package com.example.internship.controller;

import com.example.internship.entity.InvestmentTrustForm;
import com.example.internship.service.OrderInvestmentTrustService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;
import org.springframework.validation.BindingResult;
import jakarta.validation.Valid;

import java.util.Arrays;
import java.util.List;


@Controller
public class InvestmentTrustController {

    @Autowired
    private OrderInvestmentTrustService orderInvestmentTrustService;

    private static final List<String> BANK_NAME_OPTIONS = Arrays.asList(
            "山陰共同銀行", "大迫銀行", "しゅら銀行");
    private static final List<String> BRANCH_NAME_OPTIONS = Arrays.asList(
            "鹿児島支店", "南さつま支店", "名古屋支店");
    private static final List<String> BANK_ACCOUNT_TYPE_OPTIONS = Arrays.asList(
            "普通預金", "当座預金", "貯蓄預金", "総合口座");
    private static final List<String> FUND_NAME_OPTIONS = Arrays.asList(
            "Google", "Amazon", "Meta", "Apple");

    private void addSelectOptions(Model model) {
        model.addAttribute("bankNameOptions", BANK_NAME_OPTIONS);
        model.addAttribute("branchNameOptions", BRANCH_NAME_OPTIONS);
        model.addAttribute("bankAccountTypeOptions", BANK_ACCOUNT_TYPE_OPTIONS);
        model.addAttribute("fundNameOptions", FUND_NAME_OPTIONS);
    }

    @GetMapping("/investmentTrust")
    public String bankTransfer(Model model) {
        model.addAttribute("investmentTrustApplication", new InvestmentTrustForm());
        addSelectOptions(model);
        return "investmentTrustMain";
    }

    @PostMapping("/investmentTrustConfirmation")
    public String confirmation(@Valid @ModelAttribute("investmentTrustApplication") InvestmentTrustForm investmentTrustForm,
                               BindingResult result,
                               Model model) {
        if (result.hasErrors()) {
            addSelectOptions(model);
            return "investmentTrustMain";
        }

        model.addAttribute("investmentTrustApplication", investmentTrustForm);
        return "investmentTrustConfirmation";
    }

    @PostMapping("/investmentTrustCompletion")
    public String completion(@ModelAttribute InvestmentTrustForm investmentTrustForm,
                             RedirectAttributes redirectAttributes) {
        orderInvestmentTrustService.orderInvestmentTrust(investmentTrustForm);
        redirectAttributes.addFlashAttribute("investmentTrustApplication", investmentTrustForm);
        return "redirect:/investmentTrustCompletion";
    }

    @GetMapping("/investmentTrustCompletion")
    public String completionView(Model model) {
        if (!model.containsAttribute("investmentTrustApplication")) {
            return "redirect:/investmentTrust";
        }
        return "investmentTrustCompletion";
    }

}