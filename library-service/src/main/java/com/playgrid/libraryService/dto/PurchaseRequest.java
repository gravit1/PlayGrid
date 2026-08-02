package com.playgrid.libraryService.dto;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
@Data
public class PurchaseRequest {

    @NotNull(message = "User Id is required")
    private Long userId;

    @NotNull(message = "Game Id is required")
    private Long gameId;

}
