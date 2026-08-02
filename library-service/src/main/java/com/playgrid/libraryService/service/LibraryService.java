package com.playgrid.libraryService.service;


import com.playgrid.libraryService.dto.LibraryResponse;
import com.playgrid.libraryService.dto.PurchaseRequest;

import java.util.List;

public interface LibraryService {

    LibraryResponse purchaseGame(PurchaseRequest request);

    List<LibraryResponse> getUserLibrary(Long userId);

    LibraryResponse getPurchasedGame(Long userId, Long gameId);

    List<LibraryResponse> getPurchaseHistory(Long userId);
}
