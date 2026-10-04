package com.srujan.privatespace.chat.dto;

import lombok.Data;

@Data
public class TypingEvent {
    private String from;
    private String to;
    private boolean typing;
}