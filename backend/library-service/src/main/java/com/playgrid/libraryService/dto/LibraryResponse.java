package com.playgrid.libraryService.dto;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
public class LibraryResponse {

    private Long id;

    private Long userId;

    private Long gameId;

    private BigDecimal purchasePrice;

    private LocalDateTime purchaseDate;
}
