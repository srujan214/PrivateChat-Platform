package com.srujan.privatespace.chat;

import com.srujan.privatespace.chat.dto.ChatMessageDto;
import com.srujan.privatespace.chat.dto.PresenceEvent;
import com.srujan.privatespace.chat.dto.ReadReceipt;
import com.srujan.privatespace.chat.dto.TypingEvent;
import com.srujan.privatespace.user.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.security.Principal;
import java.time.Instant;

@Controller
@RequiredArgsConstructor
public class ChatController {

    private final MessageService messageService;
    private final UserService userService;
    private final SimpMessagingTemplate template;

    @MessageMapping("/chat.send")
    public void send(@Payload ChatMessageDto incoming, Principal principal) {
        if (principal == null) return;

        Message m = Message.builder()
                .senderUsername(principal.getName())
                .receiverUsername(incoming.getReceiverUsername())
                .content(incoming.getContent())
                .type(incoming.getType() != null ? incoming.getType() : MessageType.TEXT)
                .mediaUrl(incoming.getMediaUrl())
                .fileName(incoming.getFileName())
                .createdAt(Instant.now())
                .build();

        Message saved = messageService.save(m);
        ChatMessageDto out = messageService.toDto(saved);

        template.convertAndSendToUser(incoming.getReceiverUsername(), "/queue/messages", out);
        template.convertAndSendToUser(principal.getName(), "/queue/messages", out);
    }

    @MessageMapping("/chat.typing")
    public void typing(@Payload TypingEvent event, Principal principal) {
        if (principal == null) return;
        event.setFrom(principal.getName());
        template.convertAndSendToUser(event.getTo(), "/queue/typing", event);
    }

    @MessageMapping("/chat.read")
    public void read(@Payload ReadReceipt receipt, Principal principal) {
        if (principal == null) return;
        receipt.setReader(principal.getName());
        messageService.markRead(principal.getName(), receipt.getSender());
        template.convertAndSendToUser(receipt.getSender(), "/queue/read", receipt);
    }

    @MessageMapping("/presence")
    public void presence(@Payload PresenceEvent event, Principal principal) {
        if (principal == null) return;
        userService.setOnline(principal.getName(), event.isOnline());
        PresenceEvent out = new PresenceEvent(principal.getName(), event.isOnline());
        template.convertAndSend("/topic/presence", out);
    }
}