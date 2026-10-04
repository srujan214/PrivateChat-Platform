package com.srujan.privatespace.chat;

import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;

@Entity
@Table(name = "messages", indexes = {
        @Index(name = "idx_created", columnList = "createdAt"),
        @Index(name = "idx_conversation", columnList = "senderUsername, receiverUsername")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Message {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String senderUsername;

    @Column(nullable = false)
    private String receiverUsername;

    @Column(columnDefinition = "TEXT")
    private String content;

    @Builder.Default
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private MessageType type = MessageType.TEXT;

    private String mediaUrl;
    private String fileName;

    @Builder.Default
    @Column(nullable = false)
    private Instant createdAt = Instant.now();

    private Instant deliveredAt;
    private Instant readAt;

    @Builder.Default
    @Column(nullable = false)
    private boolean deleted = false;
}