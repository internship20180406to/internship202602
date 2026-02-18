package com.example.internship.repository;

import com.example.internship.entity.BankLoanForm;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

@Repository
public class BankLoanRepository {
    @Autowired
    JdbcTemplate jdbcTemplate;

    public void create(BankLoanForm bankLoanForm) {
        //bankLoanForm.setBankName("aaa");
        String sql = "INSERT INTO bankLoan_table(bankName,branchName, bankAccountNum,bankAccountType,name,loanAmount,annualIncome,interestRate) VALUES(?,?, ?,?,?,?,?,?)";

        jdbcTemplate.update(sql, bankLoanForm.getBankName(),bankLoanForm.getBranchName(), bankLoanForm.getBankAccountNum(),bankLoanForm.getBankAccountType(), bankLoanForm.getName(),bankLoanForm.getLoanAmount(),bankLoanForm.getAnnualIncome(),bankLoanForm.getInterestRate());
    }
    //public static void main(String[] args) {
        //String greeting = "こんにちは、Java!";
        //System.out.println(greeting);
    //}
}
