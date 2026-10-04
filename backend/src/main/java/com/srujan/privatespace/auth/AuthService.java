package com.srujan.privatespace.auth;

import com.srujan.privatespace.auth.dto.AuthResponse;
import com.srujan.privatespace.auth.dto.LoginRequest;
import com.srujan.privatespace.auth.dto.RegisterRequest;
import com.srujan.privatespace.user.User;
import com.srujan.privatespace.user.UserRepository;
import com.srujan.privatespace.user.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.Instant;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final UserService userService;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthResponse register(RegisterRequest req) {
        if (userRepository.existsByUsername(req.getUsername())) {
            throw new RuntimeException("Username already taken");
        }
        User user = User.builder()
                .username(req.getUsername())
                .password(passwordEncoder.encode(req.getPassword()))
                .displayName(req.getDisplayName() != null ? req.getDisplayName() : req.getUsername())
                .createdAt(Instant.now())
                .build();
        userRepository.save(user);

        String token = jwtService.generateToken(user.getUsername());
        return new AuthResponse(token, userService.toProfile(user));
    }

    public AuthResponse login(LoginRequest req) {
        User user = userRepository.findByUsername(req.getUsername())
                .orElseThrow(() -> new RuntimeException("Invalid credentials"));
        if (!passwordEncoder.matches(req.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid credentials");
        }
        String token = jwtService.generateToken(user.getUsername());
        return new AuthResponse(token, userService.toProfile(user));
    }
}