package com.playgrid.orderService.controller;

import com.playgrid.orderService.dto.CreateOrderRequest;
import com.playgrid.orderService.dto.OrderResponse;
import com.playgrid.orderService.service.OrderService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @PostMapping
    public ResponseEntity<OrderResponse> createOrder(
            @Valid @RequestBody CreateOrderRequest request,
            HttpServletRequest httpServletRequest) {
        Long userId = getUserId(httpServletRequest);
        String userEmail = getUserEmail(httpServletRequest);
        return ResponseEntity.ok(orderService.createOrder(userId, userEmail, request));
    }

    @GetMapping
    public ResponseEntity<List<OrderResponse>> getUserOrders(HttpServletRequest httpServletRequest) {
        Long userId = getUserId(httpServletRequest);
        return ResponseEntity.ok(orderService.getUserOrders(userId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<OrderResponse> getOrderById(
            @PathVariable Long id,
            HttpServletRequest httpServletRequest) {
        Long userId = getUserId(httpServletRequest);
        return ResponseEntity.ok(orderService.getOrderById(id, userId));
    }

    private Long getUserId(HttpServletRequest request) {
        String userIdHeader = request.getHeader("X-User-Id");
        if (userIdHeader == null || userIdHeader.isEmpty()) {
            throw new RuntimeException("Missing X-User-Id header");
        }
        return Long.valueOf(userIdHeader);
    }

    private String getUserEmail(HttpServletRequest request) {
        return request.getHeader("X-User-Email");
    }
}
