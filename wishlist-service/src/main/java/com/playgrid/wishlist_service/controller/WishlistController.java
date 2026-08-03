package com.playgrid.wishlist_service.controller;
import com.playgrid.wishlist_service.dto.WishlistRequest;
import com.playgrid.wishlist_service.dto.WishlistResponse;
import com.playgrid.wishlist_service.service.WishlistService;
import jakarta.servlet.http.HttpServletRequest;
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
            @Valid @RequestBody WishlistRequest request,
            HttpServletRequest httpServletRequest) {

        return ResponseEntity.ok(wishlistService.addToWishlist(getUserId(httpServletRequest), request));
    }

    @GetMapping
    public ResponseEntity<List<WishlistResponse>> getUserWishlist(HttpServletRequest request) {

        return ResponseEntity.ok(wishlistService.getUserWishlist(getUserId(request)));
    }

    @GetMapping("/game/{gameId}")
    public ResponseEntity<Boolean> isWishlisted(
            @PathVariable Long gameId,
            HttpServletRequest request) {

        return ResponseEntity.ok(
                wishlistService.isWishlisted(getUserId(request), gameId));
    }

    @DeleteMapping("/game/{gameId}")
    public ResponseEntity<String> removeFromWishlist(
            @PathVariable Long gameId,
            HttpServletRequest request) {

        wishlistService.removeFromWishlist(getUserId(request), gameId);

        return ResponseEntity.ok("Game removed from wishlist");
    }

    private Long getUserId(HttpServletRequest request) {
        return Long.valueOf(request.getHeader("X-User-Id"));
    }
}
