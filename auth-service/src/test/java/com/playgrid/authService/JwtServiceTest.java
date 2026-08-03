package com.playgrid.authService;

import com.playgrid.authService.util.JwtService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.Collections;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

class JwtServiceTest {

    private JwtService jwtService;

    @BeforeEach
    void setUp() {
        jwtService = new JwtService();
        ReflectionTestUtils.setField(jwtService, "secret", "playgrid-auth-service-secret-key-2024-should-be-32-bytes-min");
        ReflectionTestUtils.setField(jwtService, "expirationMs", 86400000L);
    }

    @Test
    void generateToken_shouldReturnNonEmptyToken() {
        UserDetails userDetails = new User("john@example.com", "password", Collections.emptyList());

        String token = jwtService.generateToken(userDetails, 1L);

        assertNotNull(token);
        assertFalse(token.isBlank());
    }

    @Test
    void isTokenValid_shouldReturnTrue_forCorrectUser() {
        UserDetails userDetails = new User("john@example.com", "password", Collections.emptyList());
        String token = jwtService.generateToken(userDetails, 1L);

        assertTrue(jwtService.isTokenValid(token, userDetails));
        assertEquals("john@example.com", jwtService.extractUsername(token));
    }

    @Test
    void isTokenValid_shouldReturnFalse_forDifferentUser() {
        UserDetails userDetails = new User("john@example.com", "password", Collections.emptyList());
        UserDetails otherUser = new User("jane@example.com", "password", Collections.emptyList());
        String token = jwtService.generateToken(userDetails, 1L);

        assertFalse(jwtService.isTokenValid(token, otherUser));
    }
}
