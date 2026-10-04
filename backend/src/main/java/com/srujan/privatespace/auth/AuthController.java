package com.srujan.privatespace.auth;

import com.srujan.privatespace.auth.dto.AuthResponse;
import com.srujan.privatespace.auth.dto.LoginRequest;
import com.srujan.privatespace.auth.dto.RegisterRequest;
import com.srujan.privatespace.common.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ApiResponse<AuthResponse> register(@RequestBody RegisterRequest req) {
        return ApiResponse.ok("Registered", authService.register(req));
    }

    @PostMapping("/login")
    public ApiResponse<AuthResponse> login(@RequestBody LoginRequest req) {
        return ApiResponse.ok("Logged in", authService.login(req));
    }
}