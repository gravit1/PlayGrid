package com.playgrid.notificationService.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class PurchaseEvent {
    private Long userId;
    private String userEmail;
    private String orderNumber;
    private BigDecimal totalAmount;
    private List<String> gameTitles;
}
