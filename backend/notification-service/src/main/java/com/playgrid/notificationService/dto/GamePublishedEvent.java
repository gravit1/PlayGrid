package com.playgrid.notificationService.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class GamePublishedEvent {
    private Long gameId;
    private String title;
    private String description;
    private BigDecimal price;
    private String category;
}
