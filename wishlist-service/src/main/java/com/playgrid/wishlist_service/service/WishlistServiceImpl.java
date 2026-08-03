package com.playgrid.wishlist_service.service;

import com.playgrid.wishlist_service.client.GameServiceClient;
import com.playgrid.wishlist_service.client.dto.GameResponse;
import com.playgrid.wishlist_service.dto.WishlistRequest;
import com.playgrid.wishlist_service.dto.WishlistResponse;
import com.playgrid.wishlist_service.entity.Wishlist;
import com.playgrid.wishlist_service.exception.DuplicateWishlistException;
import com.playgrid.wishlist_service.exception.ResourceNotFoundException;
import com.playgrid.wishlist_service.repository.WishlistRepository;
import feign.FeignException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class WishlistServiceImpl implements WishlistService {

    private final WishlistRepository wishlistRepository;
    private final GameServiceClient gameServiceClient;

    @Override
    public WishlistResponse addToWishlist(Long userId, WishlistRequest request) {

        wishlistRepository.findByUserIdAndGameId(userId, request.getGameId())
                .ifPresent(game -> {
                    throw new DuplicateWishlistException("Game already exists in wishlist");
                });

        GameResponse game;

        try {
            game = gameServiceClient.getGameById(request.getGameId());
        } catch (FeignException.NotFound ex) {
            throw new ResourceNotFoundException("Game not found");
        }

        if (!game.getActive()) {
            throw new ResourceNotFoundException("Game is not available");
        }

        Wishlist wishlist = Wishlist.builder()
                .userId(userId)
                .gameId(request.getGameId())
                .build();

        Wishlist savedWishlist = wishlistRepository.save(wishlist);

        return mapToResponse(savedWishlist, game);
    }

    @Override
    public List<WishlistResponse> getUserWishlist(Long userId) {

        List<Wishlist> wishlist = wishlistRepository.findByUserId(userId);

        return wishlist.stream()
                .map(item -> {

                    GameResponse game = gameServiceClient.getGameById(item.getGameId());

                    return mapToResponse(item, game);

                })
                .collect(Collectors.toList());
    }

    @Override
    public boolean isWishlisted(Long userId, Long gameId) {

        return wishlistRepository.findByUserIdAndGameId(userId, gameId).isPresent();
    }

    @Override
    public void removeFromWishlist(Long userId, Long gameId) {

        Wishlist wishlist = wishlistRepository.findByUserIdAndGameId(userId, gameId)
                .orElseThrow(() -> new ResourceNotFoundException("Game not found in wishlist"));

        wishlistRepository.delete(wishlist);
    }

    private WishlistResponse mapToResponse(Wishlist wishlist, GameResponse game) {

        return WishlistResponse.builder()
                .id(wishlist.getId())
                .gameId(game.getId())
                .title(game.getTitle())
                .price(game.getPrice())
                .thumbnailUrl(game.getThumbnailUrl())
                .category(game.getCategory())
                .developer(game.getDeveloper())
                .addedAt(wishlist.getAddedAt())
                .build();
    }
}
