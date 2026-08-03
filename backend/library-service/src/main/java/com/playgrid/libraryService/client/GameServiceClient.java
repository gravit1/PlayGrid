package com.playgrid.libraryService.client;

import com.playgrid.libraryService.client.dto.GameResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "GAME-SERVICE")
public interface GameServiceClient {

    @GetMapping("/games/{id}")
    GameResponse getGameById(@PathVariable Long id);

}