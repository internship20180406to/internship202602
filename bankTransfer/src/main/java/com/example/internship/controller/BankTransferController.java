package com.example.internship.controller;

import com.example.internship.entity.BankTransferForm;
import com.example.internship.service.ApplyBankTransferService;
import com.example.internship.repository.BankTransferRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import java.util.List;
import java.util.Map;

@Controller
public class BankTransferController {

    @Autowired
    private BankTransferRepository repository;

    @GetMapping("/bankTransfer")
    public String bankTransfer(Model model) {
        model.addAttribute("bankTransferApplication", new BankTransferForm());
        model.addAttribute("nameOptions", List.of("山陰共同銀行", "ながれぼし銀行", "こども銀行"));
        List<String> accountTypeOptions = List.of(
                "普通",
                "定期",
                "当座",
                "貯蓄",
                "総合"
        );
        model.addAttribute("accountTypeOptions", accountTypeOptions);

        return "bankTransferMain";
    }

    @PostMapping("/bankTransferConfirmation")
    public String confirmation(@ModelAttribute BankTransferForm bankTransferForm, Model model) {
        model.addAttribute("bankName", bankTransferForm.getBankName());
        model.addAttribute("bankAccountNum", bankTransferForm.getBankAccountNum());
        model.addAttribute("bankTransferApplication", bankTransferForm);
        return "bankTransferConfirmation";
    }

    @PostMapping("/bankTransferCompletion")
    public String completion(@ModelAttribute BankTransferForm bankTransferForm, Model model) {
        repository.create(bankTransferForm);
        return "bankTransferCompletion";
    }

}
