package com.playgrid.review_service.client.dto;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class LibraryResponse {

    private Long id;

    private Long userId;

    private Long gameId;

    private BigDecimal purchasePrice;

    private LocalDateTime purchaseDate;

}
