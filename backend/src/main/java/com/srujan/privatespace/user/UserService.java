package com.srujan.privatespace.user;

import com.srujan.privatespace.user.dto.ProfileResponse;
import com.srujan.privatespace.user.dto.UpdateProfileRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Instant;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    public User findByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found: " + username));
    }

    public ProfileResponse getProfile(String username) {
        return toProfile(findByUsername(username));
    }

    public ProfileResponse updateProfile(String username, UpdateProfileRequest req) {
        User u = findByUsername(username);
        if (req.getDisplayName() != null) u.setDisplayName(req.getDisplayName());
        if (req.getAvatarUrl() != null) u.setAvatarUrl(req.getAvatarUrl());
        if (req.getBio() != null) u.setBio(req.getBio());
        userRepository.save(u);
        return toProfile(u);
    }

    public void setOnline(String username, boolean online) {
        User u = findByUsername(username);
        u.setOnline(online);
        u.setLastSeen(Instant.now());
        userRepository.save(u);
    }

    public ProfileResponse toProfile(User u) {
        ProfileResponse p = new ProfileResponse();
        p.setId(u.getId());
        p.setUsername(u.getUsername());
        p.setDisplayName(u.getDisplayName());
        p.setAvatarUrl(u.getAvatarUrl());
        p.setBio(u.getBio());
        p.setOnline(u.isOnline());
        p.setLastSeen(u.getLastSeen());
        p.setCreatedAt(u.getCreatedAt());
        return p;
    }
}