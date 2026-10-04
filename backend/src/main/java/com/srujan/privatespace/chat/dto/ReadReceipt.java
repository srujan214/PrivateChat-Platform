package com.srujan.privatespace.chat.dto;

import lombok.Data;

@Data
public class ReadReceipt {
    private String reader;
    private String sender;
    private Long lastReadMessageId;
}