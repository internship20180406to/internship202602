package com.example.internship.repository;

import com.example.internship.entity.BankTransferForm;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;
import org.springframework.util.StringUtils;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;

@Repository
public class BankTransferRepository {
    @Autowired
    JdbcTemplate jdbcTemplate;

    public List<BankTransferForm> findAll() {
        String sql = "SELECT * FROM bankTransfer_table ORDER BY transferDateTime DESC";
        return jdbcTemplate.query(
                sql,
                new BeanPropertyRowMapper<>(BankTransferForm.class)
        );
    }

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

}
