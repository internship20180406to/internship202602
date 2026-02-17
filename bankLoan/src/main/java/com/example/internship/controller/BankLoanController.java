package com.example.internship.controller;

import com.example.internship.entity.BankLoanForm;
import com.example.internship.service.ApplyBankLoanService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import java.util.List;

@Controller
public class BankLoanController {

    @Autowired
    private ApplyBankLoanService applyBankLoanService;

    @GetMapping("/bankLoan")
    public String bankTransfer(Model model) {
        model.addAttribute("bankLoanApplication", new BankLoanForm());
        model.addAttribute("nameOptions", List.of("A銀行", "B銀行", "C銀行"));
        model.addAttribute("nameOptions1", List.of("a支店", "b支店", "c支店"));
        model.addAttribute("nameOptions2", List.of("普通預金", "当座預金","定期預金","貯蓄預金","納税準備預金","積立定期預金","通知預金","財形預金", "別段預金"));
        return "bankLoanMain";
    }


    @PostMapping("/bankLoanConfirmation")
    public String confirmation(@ModelAttribute BankLoanForm bankLoanForm, Model model) {
        //bankLoanForm.setBankName("ながれぼし銀行");
        model.addAttribute("bankName", bankLoanForm.getBankName());
        model.addAttribute("branchName", bankLoanForm.getBranchName());
        model.addAttribute("bankAccountNum", bankLoanForm.getBankAccountNum());
        model.addAttribute("bankAccountType", bankLoanForm.getBankAccountType());
        model.addAttribute("name", bankLoanForm.getName());
        model.addAttribute("loanAmount", bankLoanForm.getLoanAmount());
        model.addAttribute("annualIncome", bankLoanForm.getAnnualIncome());
        model.addAttribute("interestRate", bankLoanForm.getInterestRate());
        model.addAttribute("bankLoanApplication", bankLoanForm);
        return "bankLoanConfirmation";
    }

    @PostMapping("/bankLoanCompletion")
    public String completion(@ModelAttribute BankLoanForm bankLoanForm, Model model) {
        applyBankLoanService.applyBankLoan(bankLoanForm);
        return "bankLoanCompletion";
    }

}
