package com.playgrid.review_service.client;


import com.playgrid.review_service.client.dto.LibraryResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "LIBRARY-SERVICE")
public interface LibraryServiceClient {

    @GetMapping("/library/user/{userId}/game/{gameId}")
    LibraryResponse getPurchasedGame(
            @PathVariable Long userId,
            @PathVariable Long gameId);

}
