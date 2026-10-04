package com.srujan.privatespace.webrtc.dto;

import lombok.Data;

@Data
public class SignalMessage {
    private String from;
    private String to;
    private String type;
    private Object payload;
}