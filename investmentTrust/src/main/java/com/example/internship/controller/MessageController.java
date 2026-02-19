package com.example.internship.controller;

import com.example.internship.entity.Message;
import com.example.internship.repository.MessageRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/messages")
public class MessageController {

    private final MessageRepository messageRepository;

    public MessageController(MessageRepository messageRepository) {
        this.messageRepository = messageRepository;
    }

    @PostMapping
    public ResponseEntity<Message> saveMessage(@RequestBody Message message) {
        return ResponseEntity.ok(messageRepository.save(message));
    }

    @GetMapping("/{sessionId}")
    public ResponseEntity<List<Message>> getMessages(@PathVariable String sessionId) {
        return ResponseEntity.ok(messageRepository.findBySessionIdOrderByCreatedAtAsc(sessionId));
    }

    @GetMapping("/sessions")
    public ResponseEntity<List<Map<String, Object>>> getSessions() {
        List<String> sessionIds = messageRepository.findAllSessionIds();
        List<Map<String, Object>> sessions = new ArrayList<>();

        for (String sessionId : sessionIds) {
            Message last = messageRepository.findTopBySessionIdOrderByCreatedAtDesc(sessionId);
            Map<String, Object> session = new LinkedHashMap<>();
            session.put("sessionId", sessionId);
            session.put("lastMessage", last != null ? last.getContent() : "");
            session.put("lastSender", last != null ? last.getSender() : "");
            session.put("lastTime", last != null ? last.getCreatedAt().toString() : "");
            sessions.add(session);
        }

        sessions.sort((a, b) -> String.valueOf(b.get("lastTime")).compareTo(String.valueOf(a.get("lastTime"))));
        return ResponseEntity.ok(sessions);
    }
}