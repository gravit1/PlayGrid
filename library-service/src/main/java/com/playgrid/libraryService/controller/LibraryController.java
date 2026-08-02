package com.playgrid.libraryService.controller;
import com.playgrid.libraryService.dto.LibraryResponse;
import com.playgrid.libraryService.dto.PurchaseRequest;
import com.playgrid.libraryService.service.LibraryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/library")
@RequiredArgsConstructor
public class LibraryController {

    private final LibraryService libraryService;

    @PostMapping("/purchase")
    public ResponseEntity<LibraryResponse> purchaseGame(
            @Valid @RequestBody PurchaseRequest request) {

        return ResponseEntity.ok(libraryService.purchaseGame(request));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<LibraryResponse>> getUserLibrary(
            @PathVariable Long userId) {

        return ResponseEntity.ok(libraryService.getUserLibrary(userId));
    }

    @GetMapping("/user/{userId}/game/{gameId}")
    public ResponseEntity<LibraryResponse> getPurchasedGame(
            @PathVariable Long userId,
            @PathVariable Long gameId) {

        return ResponseEntity.ok(
                libraryService.getPurchasedGame(userId, gameId));
    }

    @GetMapping("/history/{userId}")
    public ResponseEntity<List<LibraryResponse>> getPurchaseHistory(
            @PathVariable Long userId) {

        return ResponseEntity.ok(
                libraryService.getPurchaseHistory(userId));
    }
}
