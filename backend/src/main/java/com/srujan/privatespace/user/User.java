package com.srujan.privatespace.user;

import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String username;

    @Column(nullable = false)
    private String password;

    private String displayName;
    private String avatarUrl;
    private String bio;

    @Builder.Default
    @Column(nullable = false)
    private Instant createdAt = Instant.now();

    private Instant lastSeen;

    @Builder.Default
    @Column(nullable = false)
    private boolean online = false;
}