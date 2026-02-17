package com.example.internship.repository;

import com.example.internship.entity.InvestmentTrustForm;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

@Repository
public class InvestmentTrustRepository {
    @Autowired
    JdbcTemplate jdbcTemplate;

    public List<Map<String, Object>> findDistinctAccounts() {
        String sql = "SELECT bankName, branchName, bankAccountType, bankAccountNum, name, " +
                "MAX(orderDateTime) AS orderDateTime " +
                "FROM investmentTrust_table " +
                "WHERE bankName IS NOT NULL " +
                "AND branchName IS NOT NULL " +
                "AND bankAccountType IS NOT NULL " +
                "AND bankAccountNum IS NOT NULL " +
                "AND name IS NOT NULL " +
                "AND orderDateTime IS NOT NULL " +
                "GROUP BY bankName, branchName, bankAccountType, bankAccountNum, name " +
                "ORDER BY orderDateTime DESC";
        return jdbcTemplate.queryForList(sql);
    }

    public void create(InvestmentTrustForm investmentTrustForm) {
        String sql = "INSERT INTO investmentTrust_table(" +
                "bankName, branchName, bankAccountType, bankAccountNum, " +
                "name, fundName, money, orderDateTime) " +
                "VALUES(?, ?, ?, ?, ?, ?, ?, ?)";

        jdbcTemplate.update(sql,
                investmentTrustForm.getBankName(),
                investmentTrustForm.getBranchName(),
                investmentTrustForm.getBankAccountType(),
                investmentTrustForm.getBankAccountNum(),
                investmentTrustForm.getName(),
                investmentTrustForm.getFundName(),
                investmentTrustForm.getMoney(),
                investmentTrustForm.getOrderDateTime()
        );
    }
}