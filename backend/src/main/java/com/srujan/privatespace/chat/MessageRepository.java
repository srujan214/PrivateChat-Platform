package com.srujan.privatespace.chat;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface MessageRepository extends JpaRepository<Message, Long> {

    @Query("""
        SELECT m FROM Message m
        WHERE m.deleted = false
          AND ((m.senderUsername = :a AND m.receiverUsername = :b)
            OR (m.senderUsername = :b AND m.receiverUsername = :a))
        ORDER BY m.createdAt DESC
    """)
    Page<Message> findConversation(@Param("a") String a,
                                   @Param("b") String b,
                                   Pageable pageable);

    @Query("""
        SELECT COUNT(m) FROM Message m
        WHERE m.senderUsername = :sender
          AND m.receiverUsername = :receiver
          AND m.readAt IS NULL
          AND m.deleted = false
    """)
    long countUnread(@Param("sender") String sender, @Param("receiver") String receiver);
}