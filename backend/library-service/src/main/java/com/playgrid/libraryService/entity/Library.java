package com.playgrid.libraryService.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "library")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Library {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long userId;

    @Column(nullable = false)
    private Long gameId;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal purchasePrice;

    private LocalDateTime purchaseDate;

    @PrePersist
    public void prePersist() {
        purchaseDate = LocalDateTime.now();
    }
}
