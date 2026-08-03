package com.playgrid.gameService.dto;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Builder
public class GameSummaryResponse {

    private Long id;

    private String title;

    private BigDecimal price;

    private Integer discount;

    private String thumbnailUrl;

    private String category;

    private Boolean active;
}
