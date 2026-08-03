package com.playgrid.orderService.service;

import com.playgrid.orderService.client.LibraryClient;
import com.playgrid.orderService.dto.*;
import com.playgrid.orderService.entity.Order;
import com.playgrid.orderService.entity.OrderItem;
import com.playgrid.orderService.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class OrderService {

    private final OrderRepository orderRepository;
    private final LibraryClient libraryClient;

    @Transactional
    public OrderResponse createOrder(Long userId, CreateOrderRequest request) {
        String orderNumber = "ORD-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();

        List<OrderItem> items = new ArrayList<>();
        BigDecimal totalAmount = BigDecimal.ZERO;

        for (OrderItemRequest itemReq : request.getItems()) {
            double discountPct = itemReq.getDiscount() != null ? itemReq.getDiscount() : 0.0;
            BigDecimal originalPrice = itemReq.getPrice();
            BigDecimal discountFactor = BigDecimal.valueOf(1 - (discountPct / 100.0));
            BigDecimal finalPrice = originalPrice.multiply(discountFactor).setScale(2, RoundingMode.HALF_UP);

            totalAmount = totalAmount.add(finalPrice);

            OrderItem orderItem = OrderItem.builder()
                    .gameId(itemReq.getGameId())
                    .gameTitle(itemReq.getTitle())
                    .originalPrice(originalPrice)
                    .discountPercentage(discountPct)
                    .finalPrice(finalPrice)
                    .build();

            items.add(orderItem);

            try {
                libraryClient.purchaseGame(userId, new PurchaseRequest(itemReq.getGameId(), finalPrice));
            } catch (Exception e) {
                log.warn("Failed to call library-service for gameId: {} - {}", itemReq.getGameId(), e.getMessage());
            }
        }

        Order order = Order.builder()
                .orderNumber(orderNumber)
                .userId(userId)
                .totalAmount(totalAmount)
                .status("COMPLETED")
                .paymentMethod(request.getPaymentMethod() != null ? request.getPaymentMethod() : "CREDIT_CARD")
                .items(items)
                .build();

        for (OrderItem item : items) {
            item.setOrder(order);
        }

        Order savedOrder = orderRepository.save(order);
        return mapToOrderResponse(savedOrder);
    }

    public List<OrderResponse> getUserOrders(Long userId) {
        return orderRepository.findByUserIdOrderByCreatedAtDesc(userId)
                .stream()
                .map(this::mapToOrderResponse)
                .collect(Collectors.toList());
    }

    public OrderResponse getOrderById(Long orderId, Long userId) {
        Order order = orderRepository.findByIdAndUserId(orderId, userId)
                .orElseThrow(() -> new RuntimeException("Order not found with ID: " + orderId));
        return mapToOrderResponse(order);
    }

    private OrderResponse mapToOrderResponse(Order order) {
        List<OrderItemResponse> itemResponses = order.getItems().stream()
                .map(item -> OrderItemResponse.builder()
                        .id(item.getId())
                        .gameId(item.getGameId())
                        .gameTitle(item.getGameTitle())
                        .originalPrice(item.getOriginalPrice())
                        .discountPercentage(item.getDiscountPercentage())
                        .finalPrice(item.getFinalPrice())
                        .build())
                .collect(Collectors.toList());

        return OrderResponse.builder()
                .id(order.getId())
                .orderNumber(order.getOrderNumber())
                .userId(order.getUserId())
                .totalAmount(order.getTotalAmount())
                .status(order.getStatus())
                .paymentMethod(order.getPaymentMethod())
                .items(itemResponses)
                .createdAt(order.getCreatedAt())
                .build();
    }
}
