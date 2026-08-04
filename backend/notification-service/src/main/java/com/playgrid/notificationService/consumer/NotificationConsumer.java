package com.playgrid.notificationService.consumer;

import com.playgrid.notificationService.client.AuthServiceClient;
import com.playgrid.notificationService.dto.GamePublishedEvent;
import com.playgrid.notificationService.dto.PurchaseEvent;
import com.playgrid.notificationService.service.EmailService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationConsumer {

    private final EmailService emailService;
    private final AuthServiceClient authServiceClient;

    @KafkaListener(topics = "purchase-events", groupId = "notification-group")
    public void handlePurchaseEvent(PurchaseEvent event) {
        log.info("Received purchase event for order {}", event.getOrderNumber());

        if (event.getUserEmail() != null && !event.getUserEmail().isEmpty()) {
            String gamesList = String.join("\n- ", event.getGameTitles());
            gamesList = "- " + gamesList;

            emailService.sendOrderReceipt(
                    event.getUserEmail(),
                    event.getOrderNumber(),
                    gamesList,
                    event.getTotalAmount().toString()
            );
        } else {
            log.warn("Cannot send receipt, user email is null for order {}", event.getOrderNumber());
        }
    }

    @KafkaListener(topics = "game-events", groupId = "notification-group")
    public void handleGamePublishedEvent(GamePublishedEvent event) {
        log.info("Received game published event for game: {}", event.getTitle());

        try {
            List<String> emails = authServiceClient.getAllEmails();
            if (emails != null && !emails.isEmpty()) {
                emailService.sendGameAnnouncement(
                        emails,
                        event.getTitle(),
                        event.getDescription(),
                        event.getPrice().toString(),
                        event.getCategory()
                );
            } else {
                log.warn("No user emails found to notify about new game");
            }
        } catch (Exception e) {
            log.error("Failed to fetch emails from auth-service: {}", e.getMessage());
        }
    }
}
