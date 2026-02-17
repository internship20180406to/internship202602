package com.example.internship.service;

import com.example.internship.entity.InvestmentTrustForm;
import com.example.internship.repository.InvestmentTrustRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

@Service
@Transactional
public class OrderInvestmentTrustService {
    @Autowired
    private InvestmentTrustRepository investmentTrustRepository;

    public void orderInvestmentTrust(InvestmentTrustForm investmentTrustForm) {
        investmentTrustRepository.create(investmentTrustForm);
    }

    public List<Map<String, Object>> getAccountHistory() {
        return investmentTrustRepository.findDistinctAccounts();
    }
}
