package com.playgrid.wishlist_service.dto;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class WishlistRequest {

    @NotNull(message = "Game Id is required")
    private Long gameId;

}
