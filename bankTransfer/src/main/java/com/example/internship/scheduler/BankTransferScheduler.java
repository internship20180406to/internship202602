package com.example.internship.scheduler;

import com.example.internship.entity.BankTransferForm;
import com.example.internship.furikomi.BankTransferService;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Component
public class BankTransferScheduler {

    private final BankTransferService transferService;

    public BankTransferScheduler(BankTransferService transferService) {
        this.transferService = transferService;
    }

    // 毎分チェック
    @Scheduled(cron = "0 * * * * *")  // 毎分0秒に実行
    @Transactional
    public void executeScheduledTransfers(){
        List<BankTransferForm> pendingTransfers = transferService.findPendingTransfers();

        for (BankTransferForm form : pendingTransfers) {
            boolean success = transferService.transfer(form);

            if (success) {
                transferService.markAsExecuted(form.getId());
            } else {
                System.out.println("残高不足: " + form.getBankAccountNum());
            }
        }
    }
}
