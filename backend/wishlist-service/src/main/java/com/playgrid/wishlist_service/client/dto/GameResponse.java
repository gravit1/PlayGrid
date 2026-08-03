package com.playgrid.wishlist_service.client.dto;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class GameResponse {

    private Long id;

    private String title;

    private BigDecimal price;

    private String thumbnailUrl;

    private String category;

    private String developer;

    private Boolean active;

}
