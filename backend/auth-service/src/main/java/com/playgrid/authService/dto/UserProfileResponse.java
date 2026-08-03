package com.playgrid.authService.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class UserProfileResponse {

    private Long userId;
    private String username;
    private String email;
    private String role;
}
