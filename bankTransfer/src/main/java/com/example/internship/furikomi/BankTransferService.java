package com.example.internship.furikomi;

import com.example.internship.repository.BankTransferRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.example.internship.entity.BankTransferForm;
import java.util.List;

@Service
public class BankTransferService {
    @Autowired
    JdbcTemplate jdbcTemplate;

    private final BankTransferRepository repository;
    public BankTransferService(BankTransferRepository repository) {
        this.repository = repository;
    }

    @Transactional
    public boolean transfer(BankTransferForm form) {//振込処理メソッド
        //引き落とし
        int totalAmount = form.getMoney() + form.getTransFee();
        String withdrawSql = "UPDATE bank_table " +
                "SET money = money - ? " +
                "WHERE bankAccountNum = 1234567 " +
                "AND money >= ?";

        int updated = jdbcTemplate.update(withdrawSql,
                totalAmount,
                totalAmount
        );

        if (updated == 0) {//残高不足かどうか
            System.out.println("残高不足または口座番号不一致: "+ form.getBankAccountNum());
            return false;
        }
        //入金
        String depositSql = "UPDATE bank_table " +
                "SET money = money + ? " +
                "WHERE bankAccountNum = ?";

        jdbcTemplate.update(depositSql,
                totalAmount,
                form.getBankAccountNum()
        );
        //振込履歴登録
        String insertSql = "INSERT INTO bankTransfer_table " +
                "(bankName, branchName, bankAccountType, bankAccountNum, name, money, transFee, transferDateTime) " +
                "VALUES (?, ?, ?, ?, ?, ?, ?, ?)";

        jdbcTemplate.update(insertSql,
                form.getBankName(),
                form.getBranchName(),
                form.getBankAccountType(),
                form.getBankAccountNum(),
                form.getName(),
                form.getMoney(),
                form.getTransFee(),
                form.getTransferDateTime()
        );

        return true;
    }
    //自動振込対象かどうか
    public List<BankTransferForm> findPendingTransfers() {
        return repository.findPendingTransfers();
    }
    //実行済みフラグ更新
    public void markAsExecuted(Long id) {
        String sql = "UPDATE bankTransfer_table SET executed = TRUE WHERE id = ?";
        repository.markAsExecuted(id);
    }
    public int getBalance(String bankAccountNum) {
        return repository.findBalanceByAccountNum(bankAccountNum);
    }

}
