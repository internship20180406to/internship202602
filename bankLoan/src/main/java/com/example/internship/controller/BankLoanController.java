package com.example.internship.controller;

import com.example.internship.entity.BankLoanForm;
import com.example.internship.service.ApplyBankLoanService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;


@Controller
public class BankLoanController {

    @Autowired
    private ApplyBankLoanService applyBankLoanService;

    private static final List<String> BANK_NAME_OPTIONS = Arrays.asList(
            "山陰共同銀行",
            "ながれぼし銀行",
            "はまなす銀行"
    );

    private static final Map<String, List<String>> BRANCH_NAMES = new HashMap<String, List<String>>() {{
        put("山陰共同銀行", Arrays.asList(
                "松江支店",
                "出雲支店",
                "米子支店",
                "益田支店"
        ));
        put("ながれぼし銀行", Arrays.asList(
                "札幌支店",
                "旭川支店",
                "函館支店",
                "帯広支店"
        ));
        put("はまなす銀行", Arrays.asList(
                "青森支店",
                "弘前支店",
                "八戸支店",
                "五所川原支店"
        ));
    }};

    @GetMapping("/bankLoan")
    public String bankTransfer(Model model) {
        model.addAttribute("bankLoanApplication", new BankLoanForm());
        model.addAttribute("nameOptions", BANK_NAME_OPTIONS);
        model.addAttribute("branchOptions", BRANCH_NAMES);
        return "bankLoanMain";
    }

    @PostMapping("/bankLoanConfirmation")
    public String confirmation(@ModelAttribute BankLoanForm bankLoanForm, Model model) {
        BigDecimal interestRate = calculateInterestRate(
                bankLoanForm.getBankName(),
                bankLoanForm.getLoanAmount(),
                bankLoanForm.getAnnualIncome()
        );
        bankLoanForm.setInterestRate(interestRate);
        model.addAttribute("bankLoanApplication", bankLoanForm);
        return "bankLoanConfirmation";
    }

    @PostMapping("/bankLoanCompletion")
    public String completion(@ModelAttribute BankLoanForm bankLoanForm, Model model) {
        applyBankLoanService.applyBankLoan(bankLoanForm);
        return "bankLoanCompletion";
    }

    private BigDecimal calculateInterestRate(String bankName, Integer loanAmount, Integer annualIncome) {
        BigDecimal baseRate;
        if ("山陰共同銀行".equals(bankName)) {
            baseRate = new BigDecimal("1.2");
        } else if ("ながれぼし銀行".equals(bankName)) {
            baseRate = new BigDecimal("1.5");
        } else if ("はまなす銀行".equals(bankName)) {
            baseRate = new BigDecimal("1.8");
        } else {
            baseRate = new BigDecimal("2.0");
        }

        if (loanAmount == null || annualIncome == null || annualIncome == 0) {
            return baseRate;
        }

        BigDecimal ratio = new BigDecimal(loanAmount).divide(new BigDecimal(annualIncome), 2, BigDecimal.ROUND_HALF_UP);
        if (ratio.compareTo(new BigDecimal("1.0")) >= 0) {
            return baseRate.add(new BigDecimal("0.5"));
        }
        if (ratio.compareTo(new BigDecimal("0.5")) >= 0) {
            return baseRate.add(new BigDecimal("0.2"));
        }
        return baseRate;
    }

}
