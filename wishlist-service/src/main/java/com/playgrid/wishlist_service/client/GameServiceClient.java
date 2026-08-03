package com.playgrid.wishlist_service.client;

import com.playgrid.wishlist_service.client.dto.GameResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "GAME-SERVICE")
public interface GameServiceClient {

    @GetMapping("/games/{id}")
    GameResponse getGameById(@PathVariable Long id);

}
