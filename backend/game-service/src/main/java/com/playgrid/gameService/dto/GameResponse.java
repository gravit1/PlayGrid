package com.playgrid.gameService.dto;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
public class GameResponse {

    private Long id;

    private String title;

    private String description;

    private BigDecimal price;

    private Integer discount;

    private LocalDate releaseDate;

    private String thumbnailUrl;

    private String category;

    private String developer;

    private String publisher;

    private Boolean active;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}