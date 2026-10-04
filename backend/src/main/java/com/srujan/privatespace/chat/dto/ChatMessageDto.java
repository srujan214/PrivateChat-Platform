package com.srujan.privatespace.chat.dto;

import com.srujan.privatespace.chat.MessageType;
import lombok.Data;

import java.time.Instant;

@Data
public class ChatMessageDto {
    private Long id;
    private String senderUsername;
    private String receiverUsername;
    private String content;
    private MessageType type;
    private String mediaUrl;
    private String fileName;
    private Instant createdAt;
    private Instant readAt;
}