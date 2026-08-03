package com.playgrid.gameService.controller;
import com.playgrid.gameService.dto.GameRequest;
import com.playgrid.gameService.dto.GameResponse;
import com.playgrid.gameService.dto.GameSummaryResponse;
import com.playgrid.gameService.dto.GameUpdateRequest;
import com.playgrid.gameService.service.GameService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/games")
@RequiredArgsConstructor
public class GameController {

    private final GameService gameService;

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<GameResponse> createGame(
            @Valid @ModelAttribute GameRequest request,
            @RequestParam("thumbnail") MultipartFile thumbnail) {

        return ResponseEntity.ok(gameService.createGame(request, thumbnail));
    }

    @GetMapping
    public ResponseEntity<List<GameResponse>> getAllGames() {
        return ResponseEntity.ok(gameService.getAllGames());
    }

    @GetMapping("/{id}")
    public ResponseEntity<GameResponse> getGameById(@PathVariable Long id) {
        return ResponseEntity.ok(gameService.getGameById(id));
    }

    @PostMapping("/details")
    public ResponseEntity<List<GameSummaryResponse>> getGamesByIds(
            @RequestBody List<Long> ids) {

        return ResponseEntity.ok(gameService.getGamesByIds(ids));
    }

    @GetMapping("/search")
    public ResponseEntity<List<GameResponse>> searchGames(
            @RequestParam String keyword) {

        return ResponseEntity.ok(gameService.searchGames(keyword));
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<List<GameResponse>> getGamesByCategory(
            @PathVariable String category) {

        return ResponseEntity.ok(gameService.getGamesByCategory(category));
    }

    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<GameResponse> updateGame(
            @PathVariable Long id,
            @Valid @ModelAttribute GameUpdateRequest request,
            @RequestParam(value = "thumbnail", required = false) MultipartFile thumbnail) {

        return ResponseEntity.ok(gameService.updateGame(id, request, thumbnail));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteGame(@PathVariable Long id) {

        gameService.deleteGame(id);

        return ResponseEntity.ok("Game deleted successfully");
    }
}
