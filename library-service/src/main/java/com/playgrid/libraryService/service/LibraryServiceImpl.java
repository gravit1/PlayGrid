package com.playgrid.libraryService.service;


import com.playgrid.libraryService.client.GameServiceClient;
import com.playgrid.libraryService.client.dto.GameResponse;
import com.playgrid.libraryService.dto.LibraryResponse;
import com.playgrid.libraryService.dto.PurchaseRequest;
import com.playgrid.libraryService.entity.Library;
import com.playgrid.libraryService.exception.DuplicatePurchaseException;
import com.playgrid.libraryService.exception.ResourceNotFoundException;
import com.playgrid.libraryService.repository.LibraryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class LibraryServiceImpl implements LibraryService {

    private final LibraryRepository libraryRepository;
    private final GameServiceClient gameServiceClient;

    @Override
    public LibraryResponse purchaseGame(PurchaseRequest request) {

        libraryRepository.findByUserIdAndGameId(request.getUserId(), request.getGameId())
                .ifPresent(game -> {
                    throw new DuplicatePurchaseException("Game already purchased");
                });

        GameResponse game = gameServiceClient.getGameById(request.getGameId());

        if (!game.getActive()) {
            throw new ResourceNotFoundException("Game is not available");
        }

        Library library = Library.builder()
                .userId(request.getUserId())
                .gameId(request.getGameId())
                .purchasePrice(game.getPrice())
                .build();

        Library savedLibrary = libraryRepository.save(library);

        return mapToResponse(savedLibrary);
    }

    @Override
    public List<LibraryResponse> getUserLibrary(Long userId) {

        return libraryRepository.findByUserId(userId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public LibraryResponse getPurchasedGame(Long userId, Long gameId) {

        Library library = libraryRepository.findByUserIdAndGameId(userId, gameId)
                .orElseThrow(() -> new ResourceNotFoundException("Game not found in library"));

        return mapToResponse(library);
    }

    @Override
    public List<LibraryResponse> getPurchaseHistory(Long userId) {

        return libraryRepository.findByUserId(userId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private LibraryResponse mapToResponse(Library library) {

        return LibraryResponse.builder()
                .id(library.getId())
                .userId(library.getUserId())
                .gameId(library.getGameId())
                .purchasePrice(library.getPurchasePrice())
                .purchaseDate(library.getPurchaseDate())
                .build();
    }
}
