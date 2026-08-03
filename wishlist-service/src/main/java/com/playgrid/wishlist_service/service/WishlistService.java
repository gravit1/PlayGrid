package com.playgrid.wishlist_service.service;

import com.playgrid.wishlist_service.dto.WishlistRequest;
import com.playgrid.wishlist_service.dto.WishlistResponse;

import java.util.List;

public interface WishlistService {

    WishlistResponse addToWishlist(Long userId, WishlistRequest request);

    List<WishlistResponse> getUserWishlist(Long userId);

    boolean isWishlisted(Long userId, Long gameId);

    void removeFromWishlist(Long userId, Long gameId);

}
