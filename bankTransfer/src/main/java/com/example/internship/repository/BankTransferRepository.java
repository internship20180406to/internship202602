package com.example.internship.repository;

import com.example.internship.entity.BankTransferForm;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public class BankTransferRepository {
    @Autowired
    JdbcTemplate jdbcTemplate;
    //履歴
    public List<BankTransferForm> findAll() {
        String sql = "SELECT * FROM bankTransfer_table ORDER BY transferDateTime DESC";
        return jdbcTemplate.query(
                sql,
                new BeanPropertyRowMapper<>(BankTransferForm.class)
        );
    }
    //履歴保存
    public void create(BankTransferForm bankTransferForm) {
        String sql = "INSERT INTO bankTransfer_table(bankName, branchName ,bankAccountType,bankAccountNum, name, money, transFee,transferDateTime) VALUES(?, ?, ? ,? ,?, ?, ?, ?)";
        jdbcTemplate.update(sql,
                bankTransferForm.getBankName(),
                bankTransferForm.getBranchName(),
                bankTransferForm.getBankAccountType(),
                bankTransferForm.getBankAccountNum(),
                bankTransferForm.getName(),
                bankTransferForm.getMoney(),
                bankTransferForm.getTransFee(),
                bankTransferForm.getTransferDateTime()
        );

    }

    public List<BankTransferForm> findPendingTransfers(){
        String sql ="SELECT * FROM bankTransfer_table " +
                "WHERE transferDateTime <= ?" +
                " AND executed = false";

        return jdbcTemplate.query(sql,
                new Object[]{LocalDateTime.now()},
                new BeanPropertyRowMapper<>((BankTransferForm.class)));
    }

    public void markAsExecuted(Long id){
        String sql = "UPDATE bankTransfer_table SET executed = TRUE WHERE id = ?";
        jdbcTemplate.update(sql,id);
    }

    public int findBalanceByAccountNum(String bankAccountNum) {
        String sql = "SELECT money FROM bank_table WHERE bankAccountNum = ?";
        return jdbcTemplate.queryForObject(sql, Integer.class, bankAccountNum);
    }


}
