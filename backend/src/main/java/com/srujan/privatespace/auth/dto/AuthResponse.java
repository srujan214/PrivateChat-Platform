package com.srujan.privatespace.auth.dto;

import com.srujan.privatespace.user.dto.ProfileResponse;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AuthResponse {
    private String token;
    private ProfileResponse user;
}