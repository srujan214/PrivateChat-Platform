package com.srujan.privatespace.user.dto;

import lombok.Data;

@Data
public class UpdateProfileRequest {
    private String displayName;
    private String avatarUrl;
    private String bio;
}