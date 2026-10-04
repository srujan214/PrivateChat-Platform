package com.srujan.privatespace.chat;

import com.srujan.privatespace.chat.dto.ChatMessageDto;
import com.srujan.privatespace.common.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
public class ChatRestController {

    private final MessageService messageService;

    @GetMapping("/history/{other}")
    public ApiResponse<List<ChatMessageDto>> history(Authentication auth,
                                                     @PathVariable String other,
                                                     @RequestParam(defaultValue = "0") int page,
                                                     @RequestParam(defaultValue = "50") int size) {
        return ApiResponse.ok(messageService.getConversation(auth.getName(), other, page, size));
    }

    @GetMapping("/unread/{sender}")
    public ApiResponse<Map<String, Long>> unread(Authentication auth,
                                                 @PathVariable String sender) {
        long count = messageService.unreadCount(auth.getName(), sender);
        return ApiResponse.ok(Map.of("count", count));
    }
}