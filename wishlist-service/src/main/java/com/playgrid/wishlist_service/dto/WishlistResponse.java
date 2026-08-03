package com.playgrid.wishlist_service.dto;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
public class WishlistResponse {

    private Long id;

    private Long gameId;

    private String title;

    private BigDecimal price;

    private String thumbnailUrl;

    private String category;

    private String developer;

    private LocalDateTime addedAt;

}
