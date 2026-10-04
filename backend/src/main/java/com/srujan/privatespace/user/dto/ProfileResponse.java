package com.srujan.privatespace.user.dto;

import lombok.Data;

import java.time.Instant;

@Data
public class ProfileResponse {
    private Long id;
    private String username;
    private String displayName;
    private String avatarUrl;
    private String bio;
    private boolean online;
    private Instant lastSeen;
    private Instant createdAt;
}