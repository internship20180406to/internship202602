//計算や複雑なルール（ビジネスロジック）を実行する場所です。
//たとえ： 厨房の「料理人」
//「手数料を計算する」「在庫があるかチェックする」などの知的な作業。
//Controllerから依頼を受けて、Repositoryに保存を頼む。
package com.example.internship.service;

import com.example.internship.entity.InvestmentTrustForm;
import com.example.internship.repository.InvestmentTrustRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class OrderInvestmentTrustService {
    @Autowired
    private InvestmentTrustRepository investmentTrustRepository;

    public void orderInvestmentTrust(InvestmentTrustForm investmentTrustForm) {
        investmentTrustRepository.create(investmentTrustForm);
    }
}
