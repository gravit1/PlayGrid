package com.playgrid.orderService.client;

import com.playgrid.orderService.dto.PurchaseRequest;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;

@FeignClient(name = "LIBRARY-SERVICE")
public interface LibraryClient {

    @PostMapping("/library/purchase")
    Object purchaseGame(
            @RequestHeader("X-User-Id") Long userId,
            @RequestBody PurchaseRequest request);
}
