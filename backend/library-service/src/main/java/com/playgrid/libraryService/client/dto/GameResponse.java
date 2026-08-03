package com.playgrid.libraryService.client.dto;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class GameResponse {

    private Long id;

    private String title;

    private BigDecimal price;

    private Boolean active;
}
