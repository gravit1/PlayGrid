package com.playgrid.wishlist_service.controller;
import com.playgrid.wishlist_service.dto.WishlistRequest;
import com.playgrid.wishlist_service.dto.WishlistResponse;
import com.playgrid.wishlist_service.service.WishlistService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/wishlist")
@RequiredArgsConstructor
public class WishlistController {

    private final WishlistService wishlistService;

    @PostMapping
    public ResponseEntity<WishlistResponse> addToWishlist(
            @Valid @RequestBody WishlistRequest request) {

        return ResponseEntity.ok(wishlistService.addToWishlist(request));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<WishlistResponse>> getUserWishlist(
            @PathVariable Long userId) {

        return ResponseEntity.ok(wishlistService.getUserWishlist(userId));
    }

    @GetMapping("/user/{userId}/game/{gameId}")
    public ResponseEntity<Boolean> isWishlisted(
            @PathVariable Long userId,
            @PathVariable Long gameId) {

        return ResponseEntity.ok(
                wishlistService.isWishlisted(userId, gameId));
    }

    @DeleteMapping("/user/{userId}/game/{gameId}")
    public ResponseEntity<String> removeFromWishlist(
            @PathVariable Long userId,
            @PathVariable Long gameId) {

        wishlistService.removeFromWishlist(userId, gameId);

        return ResponseEntity.ok("Game removed from wishlist");
    }
}
