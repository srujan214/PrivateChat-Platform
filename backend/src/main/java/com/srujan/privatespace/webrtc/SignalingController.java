package com.srujan.privatespace.webrtc;

import com.srujan.privatespace.webrtc.dto.SignalMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.security.Principal;

@Controller
@RequiredArgsConstructor
public class SignalingController {

    private final SimpMessagingTemplate template;

    @MessageMapping("/webrtc.signal")
    public void signal(@Payload SignalMessage msg, Principal principal) {
        if (principal == null) return;
        msg.setFrom(principal.getName());
        template.convertAndSendToUser(msg.getTo(), "/queue/webrtc", msg);
    }
}