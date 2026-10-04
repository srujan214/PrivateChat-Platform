package com.srujan.privatespace.chat.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PresenceEvent {
    private String username;
    private boolean online;
}