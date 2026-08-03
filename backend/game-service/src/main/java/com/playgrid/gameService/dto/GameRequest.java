package com.playgrid.gameService.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class GameRequest {

    @NotBlank(message = "Title is required")
    private String title;

    @NotBlank(message = "Description is required")
    private String description;

    @NotNull(message = "Price is required")
    @Positive(message = "Price must be greater than 0")
    private BigDecimal price;

    private Integer discount;

    private LocalDate releaseDate;

    @NotBlank(message = "Category is required")
    private String category;

    @NotBlank(message = "Developer is required")
    private String developer;

    @NotBlank(message = "Publisher is required")
    private String publisher;
}