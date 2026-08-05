package com.playgrid.orderService.service;

import com.playgrid.orderService.entity.Order;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicLong;

@Service
@Slf4j
public class BlockchainLedgerService {

    private String lastBlockHash = "0000000000000000000000000000000000000000000000000000000000000000";
    private final AtomicLong currentBlockNumber = new AtomicLong(1042);

    /**
     * Mines a new block for the given order transaction.
     * 
     * @param order the order to be recorded on the blockchain
     */
    public synchronized void recordTransaction(Order order) {
        try {
            Long blockNumber = currentBlockNumber.incrementAndGet();
            String timestamp = LocalDateTime.now().toInstant(ZoneOffset.UTC).toString();

            String dataPayload = order.getOrderNumber() +
                    order.getUserId() +
                    order.getTotalAmount().toString() +
                    timestamp;

            String blockHashData = blockNumber + lastBlockHash + dataPayload;
            String newBlockHash = calculateSHA256(blockHashData);

            String txHash = "0x" + calculateSHA256(UUID.randomUUID().toString() + dataPayload);

            order.setBlockNumber(blockNumber);
            order.setBlockHash(newBlockHash);
            order.setTxHash(txHash);

            this.lastBlockHash = newBlockHash;

            log.info("Mined new block #{} for Order {}. TxHash: {}", blockNumber, order.getOrderNumber(), txHash);

        } catch (NoSuchAlgorithmException e) {
            log.error("Failed to generate blockchain hash", e);
            throw new RuntimeException("Blockchain hashing algorithm not found", e);
        }
    }

    private String calculateSHA256(String input) throws NoSuchAlgorithmException {
        MessageDigest digest = MessageDigest.getInstance("SHA-256");
        byte[] hash = digest.digest(input.getBytes(StandardCharsets.UTF_8));
        StringBuilder hexString = new StringBuilder(2 * hash.length);
        for (byte b : hash) {
            String hex = Integer.toHexString(0xff & b);
            if (hex.length() == 1) {
                hexString.append('0');
            }
            hexString.append(hex);
        }
        return hexString.toString();
    }
}
