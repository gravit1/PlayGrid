package com.playgrid.gameService.service;

import com.playgrid.gameService.dto.GameRequest;
import com.playgrid.gameService.dto.GameResponse;
import com.playgrid.gameService.dto.GameUpdateRequest;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface GameService {

    GameResponse createGame(GameRequest request, MultipartFile thumbnail);

    GameResponse updateGame(Long id, GameUpdateRequest request, MultipartFile thumbnail);

    void deleteGame(Long id);

    List<GameResponse> getAllGames();

    GameResponse getGameById(Long id);

    List<GameResponse> searchGames(String keyword);

    List<GameResponse> getGamesByCategory(String category);
}
