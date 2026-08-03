package com.playgrid.gameService.service;

import com.playgrid.gameService.Util.FileUploadUtil;
import com.playgrid.gameService.dto.GameRequest;
import com.playgrid.gameService.dto.GameResponse;
import com.playgrid.gameService.dto.GameSummaryResponse;
import com.playgrid.gameService.dto.GameUpdateRequest;
import com.playgrid.gameService.entity.Game;
import com.playgrid.gameService.exception.ResourceNotFoundException;
import com.playgrid.gameService.repository.GameRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class GameServiceImpl implements GameService {

    private final GameRepository gameRepository;
    private final FileUploadUtil fileUploadUtil;

    @Override
    public GameResponse createGame(GameRequest request, MultipartFile thumbnail) {

        Game game = new Game();

        game.setTitle(request.getTitle());
        game.setDescription(request.getDescription());
        game.setPrice(request.getPrice());
        game.setDiscount(request.getDiscount());
        game.setReleaseDate(request.getReleaseDate());
        game.setCategory(request.getCategory());
        game.setDeveloper(request.getDeveloper());
        game.setPublisher(request.getPublisher());
        game.setActive(true);

        try {
            game.setThumbnailUrl(fileUploadUtil.uploadFile(thumbnail));
        } catch (IOException e) {
            throw new RuntimeException("Failed to upload image");
        }

        Game savedGame = gameRepository.save(game);

        return mapToResponse(savedGame);
    }

    @Override
    public GameResponse updateGame(Long id, GameUpdateRequest request, MultipartFile thumbnail) {

        Game game = gameRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Game not found"));

        game.setTitle(request.getTitle());
        game.setDescription(request.getDescription());
        game.setPrice(request.getPrice());
        game.setDiscount(request.getDiscount());
        game.setReleaseDate(request.getReleaseDate());
        game.setCategory(request.getCategory());
        game.setDeveloper(request.getDeveloper());
        game.setPublisher(request.getPublisher());
        if (request.getActive() != null) {
            game.setActive(request.getActive());
        }
        if (thumbnail != null && !thumbnail.isEmpty()) {
            try {
                game.setThumbnailUrl(fileUploadUtil.uploadFile(thumbnail));
            } catch (IOException e) {
                throw new RuntimeException("Failed to upload image");
            }
        }

        Game updatedGame = gameRepository.save(game);

        return mapToResponse(updatedGame);
    }


    @Override
    public List<GameSummaryResponse> getGamesByIds(List<Long> ids) {

        return gameRepository.findByIdIn(ids)
                .stream()
                .map(game -> GameSummaryResponse.builder()
                        .id(game.getId())
                        .title(game.getTitle())
                        .price(game.getPrice())
                        .discount(game.getDiscount())
                        .thumbnailUrl(game.getThumbnailUrl())
                        .category(game.getCategory())
                        .active(game.getActive())
                        .build())
                .toList();
    }

    @Override
    public void deleteGame(Long id) {
        Game game = gameRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Game not found"));

        gameRepository.delete(game);
    }

    @Override
    public List<GameResponse> getAllGames() {
        return gameRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public GameResponse getGameById(Long id) {
        Game game = gameRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Game not found"));

        return mapToResponse(game);
    }

    @Override
    public List<GameResponse> searchGames(String keyword) {
        return gameRepository.findByTitleContainingIgnoreCase(keyword)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<GameResponse> getGamesByCategory(String category) {
        return gameRepository.findByCategoryIgnoreCase(category)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private GameResponse mapToResponse(Game game) {
        return GameResponse.builder()
                .id(game.getId())
                .title(game.getTitle())
                .description(game.getDescription())
                .price(game.getPrice())
                .discount(game.getDiscount())
                .releaseDate(game.getReleaseDate())
                .thumbnailUrl(game.getThumbnailUrl())
                .category(game.getCategory())
                .developer(game.getDeveloper())
                .publisher(game.getPublisher())
                .active(game.getActive())
                .createdAt(game.getCreatedAt())
                .updatedAt(game.getUpdatedAt())
                .build();
    }
}
