package com.vehiclerental.notification.controller;

import com.vehiclerental.notification.dto.NotificationRequest;
import com.vehiclerental.notification.dto.NotificationResponse;
import com.vehiclerental.notification.service.NotificationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

    @PostMapping("/send")
    public ResponseEntity<NotificationResponse> sendNotification(@Valid @RequestBody NotificationRequest request) {
        NotificationResponse response = notificationService.sendNotification(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<NotificationResponse>> getAllNotifications() {
        return ResponseEntity.ok(notificationService.getAllNotifications());
    }

    @GetMapping("/recipient/{email}")
    public ResponseEntity<List<NotificationResponse>> getNotificationsByRecipient(@PathVariable String email) {
        return ResponseEntity.ok(notificationService.getNotificationsByRecipient(email));
    }
}
