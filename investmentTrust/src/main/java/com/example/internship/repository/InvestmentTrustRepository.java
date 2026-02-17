//データベース（DB）と直接やり取りして、データを出し入れする場所です。
//たとえ： 「倉庫の出し入れ担当者」
//SQL文（INSERT INTO...）を使って、データをガチャンとDBに書き込む。
//「これまでの注文を全部見せて」と言われたらDBから取ってくる。
//コードの特徴： @Repository がついていて、JdbcTemplate などを使う。
package com.example.internship.repository;

import com.example.internship.entity.InvestmentTrustForm;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

@Repository
public class InvestmentTrustRepository {
    @Autowired
    JdbcTemplate jdbcTemplate;

    public void create(InvestmentTrustForm investmentTrustForm) {
        String sql = "INSERT INTO investmentTrust_table(bankName, bankAccountNum, bankAccountType, name, branchName, money, fundName) VALUES(?, ?, ?, ?, ?, ?, ?)";
        jdbcTemplate.update(sql, investmentTrustForm.getBankName(), investmentTrustForm.getBankAccountNum(), investmentTrustForm.getBankAccountType(),
                 investmentTrustForm.getName(), investmentTrustForm.getBranchName(), investmentTrustForm.getMoney(), investmentTrustForm.getFundName());
    }

}
