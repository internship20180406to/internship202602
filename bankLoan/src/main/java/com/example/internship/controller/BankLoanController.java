package com.example.internship.controller;

import com.example.internship.entity.BankLoanForm;
import com.example.internship.service.ApplyBankLoanService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;


@Controller
public class BankLoanController {

    @Autowired
    private ApplyBankLoanService applyBankLoanService;

    private static final String FIXED_BANK_NAME = "かわらそば銀行";

    private static final Map<String, List<String>> BRANCH_NAMES = new HashMap<String, List<String>>() {{
        put("福岡県", Arrays.asList(
                "福岡支店",
                "博多支店",
                "北九州支店"
        ));
        put("佐賀県", Arrays.asList(
                "佐賀支店",
                "唐津支店",
                "鳥栖支店"
        ));
        put("長崎県", Arrays.asList(
                "長崎支店",
                "佐世保支店",
                "諫早支店"
        ));
        put("熊本県", Arrays.asList(
                "熊本支店",
                "八代支店",
                "天草支店"
        ));
        put("大分県", Arrays.asList(
                "大分支店",
                "別府支店",
                "中津支店"
        ));
        put("宮崎県", Arrays.asList(
                "宮崎支店",
                "都城支店",
                "延岡支店"
        ));
        put("鹿児島県", Arrays.asList(
                "鹿児島支店",
                "霧島支店",
                "薩摩川内支店"
        ));
    }};

    @GetMapping("/bankLoan")
    public String bankTransfer(Model model) {
        BankLoanForm bankLoanForm = new BankLoanForm();
        bankLoanForm.setBankName(FIXED_BANK_NAME);
        model.addAttribute("bankLoanApplication", bankLoanForm);
        model.addAttribute("branchOptions", BRANCH_NAMES);
        return "bankLoanMain";
    }

    @PostMapping("/bankLoanConfirmation")
    public String confirmation(@ModelAttribute BankLoanForm bankLoanForm, Model model) {
        BigDecimal interestRate = calculateInterestRate(
                bankLoanForm.getBankName(),
                bankLoanForm.getLoanAmount(),
                bankLoanForm.getAnnualIncome(),
                bankLoanForm.getLoanPeriod()
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

    @GetMapping("/calculateInterestRate")
    @ResponseBody
    public Map<String, Object> calculateInterestRateApi(
            @RequestParam String bankName,
            @RequestParam Integer loanAmount,
            @RequestParam Integer annualIncome,
            @RequestParam Integer loanPeriod) {

        BigDecimal interestRate = calculateInterestRate(bankName, loanAmount, annualIncome, loanPeriod);

        Map<String, Object> response = new HashMap<>();
        response.put("interestRate", interestRate.setScale(2, BigDecimal.ROUND_HALF_UP).toPlainString());

        return response;
    }

    @GetMapping("/validateBranch")
    @ResponseBody
    public Map<String, Object> validateBranch(@RequestParam String branchName) {
        boolean isValid = false;

        // すべての支店リストから検索
        for (List<String> branches : BRANCH_NAMES.values()) {
            if (branches.contains(branchName)) {
                isValid = true;
                break;
            }
        }

        Map<String, Object> response = new HashMap<>();
        response.put("valid", isValid);
        return response;
    }

    @GetMapping("/getAllBranches")
    @ResponseBody
    public Map<String, Object> getAllBranches() {
        Map<String, Object> response = new HashMap<>();
        response.put("branches", BRANCH_NAMES);
        return response;
    }

    private BigDecimal calculateInterestRate(String bankName, Integer loanAmount, Integer annualIncome, Integer loanPeriod) {
        BigDecimal baseRate;
        if (FIXED_BANK_NAME.equals(bankName)) {
            baseRate = new BigDecimal("1.4");
        } else {
            baseRate = new BigDecimal("2.0");
        }

        if (loanAmount == null || annualIncome == null || annualIncome == 0) {
            return applyLoanPeriodDiscount(baseRate, loanPeriod);
        }

        BigDecimal ratio = new BigDecimal(loanAmount).divide(new BigDecimal(annualIncome), 2, BigDecimal.ROUND_HALF_UP);
        BigDecimal adjustedRate;
        if (ratio.compareTo(new BigDecimal("1.0")) >= 0) {
            adjustedRate = baseRate.add(new BigDecimal("0.5"));
        } else if (ratio.compareTo(new BigDecimal("0.5")) >= 0) {
            adjustedRate = baseRate.add(new BigDecimal("0.2"));
        } else {
            adjustedRate = baseRate;
        }

        // 借入期間による割引を適用
        return applyLoanPeriodDiscount(adjustedRate, loanPeriod);
    }

    // 借入期間に基づいて金利を割引するメソッド
    private BigDecimal applyLoanPeriodDiscount(BigDecimal rate, Integer loanPeriod) {
        if (loanPeriod == null || loanPeriod < 1) {
            return rate;
        }

        BigDecimal discount;
        if (loanPeriod >= 30) {
            discount = new BigDecimal("0.4"); // 30年以上で0.4%割引
        } else if (loanPeriod >= 20) {
            discount = new BigDecimal("0.3"); // 20年以上で0.3%割引
        } else if (loanPeriod >= 10) {
            discount = new BigDecimal("0.1"); // 10年以上で0.1%割引
        } else {
            discount = new BigDecimal("0.0"); // 10年未満で割引なし
        }

        return rate.subtract(discount);
    }

}
