package org.squadron.service;

import jakarta.enterprise.context.ApplicationScoped;

import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@ApplicationScoped
public class SessionService {
    private final Map<String, Long> sessions = new ConcurrentHashMap<>();

    public String createSession(long userId) {
        String sid = UUID.randomUUID().toString();
        sessions.put(sid, userId);
        return sid;
    }

    public Optional<Long> getUserId(String sid) {
        if (sid == null) return Optional.empty();
        return Optional.ofNullable(sessions.get(sid));
    }

    public void destroySession(String sid) {
        if (sid == null) return;
        sessions.remove(sid);
    }
}
