package com.playgrid.notificationService.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final JavaMailSender mailSender;

    public void sendOrderReceipt(String toEmail, String orderNumber, String games, String totalAmount) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("noreply@playgrid.com");
        message.setTo(toEmail);
        message.setSubject("PlayGrid - Order Receipt #" + orderNumber);
        
        String body = String.format("Thank you for your purchase on PlayGrid!\n\nOrder Number: %s\nTotal Amount: $%s\nGames Purchased:\n%s\n\nEnjoy your new games!",
                orderNumber, totalAmount, games);
        message.setText(body);

        try {
            mailSender.send(message);
            log.info("Order receipt email sent successfully to {}", toEmail);
        } catch (Exception e) {
            log.error("Failed to send order receipt email to {}: {}", toEmail, e.getMessage());
        }
    }

    public void sendGameAnnouncement(List<String> emails, String title, String description, String price, String category) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("noreply@playgrid.com");
        message.setBcc(emails.toArray(new String[0]));
        message.setSubject("New Game on PlayGrid: " + title);
        
        String body = String.format("A new game has been published on PlayGrid!\n\nTitle: %s\nCategory: %s\nPrice: $%s\n\n%s\n\nCheck it out now on PlayGrid!",
                title, category, price, description);
        message.setText(body);

        try {
            mailSender.send(message);
            log.info("Game announcement email sent successfully to {} users", emails.size());
        } catch (Exception e) {
            log.error("Failed to send game announcement email: {}", e.getMessage());
        }
    }
}
