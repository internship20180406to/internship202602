package com.example.internship.repository;

import com.example.internship.entity.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface MessageRepository extends JpaRepository<Message, Long> {

    List<Message> findBySessionIdOrderByCreatedAtAsc(String sessionId);

    @Query("SELECT DISTINCT m.sessionId FROM Message m ORDER BY m.sessionId")
    List<String> findAllSessionIds();

    Message findTopBySessionIdOrderByCreatedAtDesc(String sessionId);
}