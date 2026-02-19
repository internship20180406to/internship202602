package com.example.internship.controller;

import com.example.internship.entity.InvestmentTrustForm;
import com.example.internship.service.JQuantsService;
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

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;


@Controller
public class InvestmentTrustController {

    @Autowired
    private OrderInvestmentTrustService orderInvestmentTrustService;

    @Autowired
    private JQuantsService jQuantsService;

    private static final Map<String, List<String>> BANK_BRANCH_MAP = new LinkedHashMap<>();
    static {
        BANK_BRANCH_MAP.put("山陰共同銀行", Arrays.asList("松江支店", "出雲支店", "米子支店"));
        BANK_BRANCH_MAP.put("大迫銀行", Arrays.asList("東京支店", "大阪支店", "福岡支店"));
        BANK_BRANCH_MAP.put("しゅら銀行", Arrays.asList("鹿児島支店", "南さつま支店", "名古屋支店"));
    }
    private static final List<String> BANK_ACCOUNT_TYPE_OPTIONS = Arrays.asList(
            "普通預金", "当座預金", "貯蓄預金", "総合口座");

    private void addSelectOptions(Model model) {
        model.addAttribute("bankNameOptions", BANK_BRANCH_MAP.keySet());
        model.addAttribute("bankBranchMap", BANK_BRANCH_MAP);
        model.addAttribute("bankAccountTypeOptions", BANK_ACCOUNT_TYPE_OPTIONS);
        model.addAttribute("fundNameOptions", jQuantsService.getFundNameOptions());
        model.addAttribute("fundInfoMap", jQuantsService.getFundInfoMap());
        model.addAttribute("fundChartDataMap", jQuantsService.getFundChartDataMap());
        model.addAttribute("accountHistory", orderInvestmentTrustService.getAccountHistory());
        model.addAttribute("balanceMap", orderInvestmentTrustService.getAccountBalanceMap());
        model.addAttribute("orderHistory", orderInvestmentTrustService.getOrderHistory());
    }

    @GetMapping("/")
    public String root() {
        return "redirect:/investmentTrust";
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

        Map<String, String> fundInfo = jQuantsService.getFundInfoMap().get(investmentTrustForm.getFundName());
        if (fundInfo != null) {
            double feeRate = Double.parseDouble(fundInfo.get("fee"));
            long basePrice = Long.parseLong(fundInfo.get("basePrice").replace(",", ""));
            long feeAmount = (long) Math.floor(investmentTrustForm.getMoney() * feeRate / 100);
            investmentTrustForm.setTotalMoney(investmentTrustForm.getMoney() + feeAmount);
            investmentTrustForm.setUnits((long) Math.floor((double) investmentTrustForm.getMoney() / basePrice * 10000));
        } else {
            investmentTrustForm.setTotalMoney(investmentTrustForm.getMoney());
            investmentTrustForm.setUnits(0L);
        }

        model.addAttribute("investmentTrustApplication", investmentTrustForm);
        return "investmentTrustConfirmation";
    }

    @PostMapping("/investmentTrustCompletion")
    public String completion(@ModelAttribute InvestmentTrustForm investmentTrustForm,
                             RedirectAttributes redirectAttributes) {
        investmentTrustForm.setMoney(investmentTrustForm.getTotalMoney());
        investmentTrustForm.setOrderDateTime(LocalDateTime.now());
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

    @GetMapping("/investmentTrustHistory")
    public String historyView(Model model) {
        model.addAttribute("orderHistory", orderInvestmentTrustService.getOrderHistory());
        return "investmentTrustHistory";
    }

}