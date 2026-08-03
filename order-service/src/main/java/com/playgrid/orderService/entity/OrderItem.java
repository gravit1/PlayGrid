package com.playgrid.orderService.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Entity
@Table(name = "order_items")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;

    @Column(nullable = false)
    private Long gameId;

    @Column(nullable = false)
    private String gameTitle;

    @Column(nullable = false)
    private BigDecimal originalPrice;

    @Column(nullable = false)
    private Double discountPercentage;

    @Column(nullable = false)
    private BigDecimal finalPrice;
}
