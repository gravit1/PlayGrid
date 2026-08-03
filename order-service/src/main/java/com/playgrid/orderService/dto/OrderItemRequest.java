package com.playgrid.orderService.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderItemRequest {

    @NotNull
    private Long gameId;

    @NotNull
    private String title;

    @NotNull
    private BigDecimal price;

    private Double discount;
}
