package com.playgrid.libraryService.controller;
import com.playgrid.libraryService.dto.LibraryResponse;
import com.playgrid.libraryService.dto.PurchaseRequest;
import com.playgrid.libraryService.service.LibraryService;
import jakarta.servlet.http.HttpServletRequest;
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
            @Valid @RequestBody PurchaseRequest request,
            HttpServletRequest httpServletRequest) {

        return ResponseEntity.ok(libraryService.purchaseGame(getUserId(httpServletRequest), request));
    }

    @GetMapping
    public ResponseEntity<List<LibraryResponse>> getUserLibrary(HttpServletRequest request) {

        return ResponseEntity.ok(libraryService.getUserLibrary(getUserId(request)));
    }

    @GetMapping("/user/{userId}/game/{gameId}")
    public ResponseEntity<LibraryResponse> getPurchasedGame(
            @PathVariable Long userId,
            @PathVariable Long gameId) {

        return ResponseEntity.ok(
                libraryService.getPurchasedGame(userId, gameId));
    }

    @GetMapping("/game/{gameId}")
    public ResponseEntity<LibraryResponse> getPurchasedGame(
            @PathVariable Long gameId,
            HttpServletRequest request) {

        return ResponseEntity.ok(
                libraryService.getPurchasedGame(getUserId(request), gameId));
    }

    @GetMapping("/history")
    public ResponseEntity<List<LibraryResponse>> getPurchaseHistory(HttpServletRequest request) {

        return ResponseEntity.ok(
                libraryService.getPurchaseHistory(getUserId(request)));
    }

    private Long getUserId(HttpServletRequest request) {
        return Long.valueOf(request.getHeader("X-User-Id"));
    }
}
