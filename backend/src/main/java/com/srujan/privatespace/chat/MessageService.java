package com.srujan.privatespace.chat;

import com.srujan.privatespace.chat.dto.ChatMessageDto;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;

@Service
@RequiredArgsConstructor
public class MessageService {

    private final MessageRepository messageRepository;

    public Message save(Message m) {
        if (m.getCreatedAt() == null) m.setCreatedAt(Instant.now());
        return messageRepository.save(m);
    }

    public List<ChatMessageDto> getConversation(String me, String other, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Message> result = messageRepository.findConversation(me, other, pageable);
        return result.getContent().stream().map(this::toDto).toList();
    }

    @Transactional
    public void markRead(String reader, String sender) {
        List<Message> unread = messageRepository.findAll().stream()
                .filter(m -> m.getSenderUsername().equals(sender)
                        && m.getReceiverUsername().equals(reader)
                        && m.getReadAt() == null
                        && !m.isDeleted())
                .toList();

        if (unread.isEmpty()) return;

        Instant now = Instant.now();
        unread.forEach(m -> m.setReadAt(now));
        messageRepository.saveAll(unread);
    }

    public long unreadCount(String reader, String sender) {
        return messageRepository.countUnread(sender, reader);
    }

    public ChatMessageDto toDto(Message m) {
        ChatMessageDto dto = new ChatMessageDto();
        dto.setId(m.getId());
        dto.setSenderUsername(m.getSenderUsername());
        dto.setReceiverUsername(m.getReceiverUsername());
        dto.setContent(m.getContent());
        dto.setType(m.getType());
        dto.setMediaUrl(m.getMediaUrl());
        dto.setFileName(m.getFileName());
        dto.setCreatedAt(m.getCreatedAt());
        dto.setReadAt(m.getReadAt());
        return dto;
    }
}