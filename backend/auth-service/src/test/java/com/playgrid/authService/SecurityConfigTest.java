package com.playgrid.authService;

import com.playgrid.authService.controller.AuthController;
import com.playgrid.authService.controller.UserController;
import com.playgrid.authService.dto.UserProfileResponse;
import com.playgrid.authService.security.CustomUserDetailsService;
import com.playgrid.authService.security.SecurityConfig;
import com.playgrid.authService.service.AuthService;
import com.playgrid.authService.util.JwtService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.security.core.userdetails.User;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Collections;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest({AuthController.class, UserController.class})
@Import(SecurityConfig.class)
class SecurityConfigTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private AuthService authService;

    @MockitoBean
    private JwtService jwtService;

    @MockitoBean
    private CustomUserDetailsService customUserDetailsService;

    @Test
    void registerEndpoint_shouldBeAccessible_withoutAuthentication() throws Exception {
        // Reaches the controller (fails validation with 400) instead of being blocked by security
        mockMvc.perform(post("/auth/register").contentType("application/json").content("{}"))
                .andExpect(status().isBadRequest());
    }

    @Test
    void profileEndpoint_shouldBeForbidden_withoutToken() throws Exception {
        mockMvc.perform(get("/users/profile"))
                .andExpect(status().isForbidden());
    }

    @Test
    void profileEndpoint_shouldBeAccessible_withValidToken() throws Exception {
        User userDetails = new User("john@example.com", "encoded-password", Collections.emptyList());

        when(jwtService.extractUsername("valid-token")).thenReturn("john@example.com");
        when(customUserDetailsService.loadUserByUsername("john@example.com")).thenReturn(userDetails);
        when(jwtService.isTokenValid("valid-token", userDetails)).thenReturn(true);
        when(authService.getProfile("john@example.com"))
                .thenReturn(new UserProfileResponse(1L, "johndoe", "john@example.com", "ROLE_USER"));

        mockMvc.perform(get("/users/profile").header("Authorization", "Bearer valid-token"))
                .andExpect(status().isOk());
    }
}
