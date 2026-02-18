package com.example.internship.controller;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@RestController
public class ChatController {

    @Value("${openrouter.api.key}")
    private String apiKey;

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    private static final String SYSTEM_PROMPT =
            "あなたは日本の投資信託に詳しいアシスタントです。" +
            "投資信託の購入・運用・手数料・銘柄選びなどについて、わかりやすく日本語で回答してください。" +
            "回答は簡潔にまとめてください。";

    @PostMapping("/api/chat")
    public ResponseEntity<Map<String, String>> chat(@RequestBody Map<String, String> req) {
        String userMessage = req.get("message");
        if (userMessage == null || userMessage.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("error", "メッセージが空です"));
        }

        Map<String, Object> body = new LinkedHashMap<>();
        body.put("model", "meta-llama/llama-3.3-70b-instruct:free");

        List<Map<String, String>> messages = new ArrayList<>();
        messages.add(Map.of("role", "system", "content", SYSTEM_PROMPT));
        messages.add(Map.of("role", "user", "content", userMessage));
        body.put("messages", messages);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(apiKey);
        headers.set("HTTP-Referer", "http://localhost:8083");
        headers.set("X-Title", "InvestmentTrustApp");

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);
        try {
            ResponseEntity<String> response = restTemplate.postForEntity(
                    "https://openrouter.ai/api/v1/chat/completions",
                    entity,
                    String.class
            );
            JsonNode root = objectMapper.readTree(response.getBody());
            String reply = root.path("choices").get(0).path("message").path("content").asText();
            return ResponseEntity.ok(Map.of("reply", reply));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "APIエラー: " + e.getMessage()));
        }
    }
}