package com.playgrid.orderService.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderItemResponse {
    private Long id;
    private Long gameId;
    private String gameTitle;
    private BigDecimal originalPrice;
    private Double discountPercentage;
    private BigDecimal finalPrice;
}
