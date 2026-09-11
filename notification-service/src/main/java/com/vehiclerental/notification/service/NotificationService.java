package com.vehiclerental.notification.service;

import com.vehiclerental.notification.dto.NotificationRequest;
import com.vehiclerental.notification.dto.NotificationResponse;
import com.vehiclerental.notification.entity.Notification;
import com.vehiclerental.notification.entity.NotificationChannel;
import com.vehiclerental.notification.entity.NotificationStatus;
import com.vehiclerental.notification.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationService {

    private final NotificationRepository notificationRepository;

    @Transactional
    public NotificationResponse sendNotification(NotificationRequest request) {
        log.info("[NOTIFICATION DISPATCH] Channel: {} | To: {} | Subject: {}",
                request.getChannel(), request.getRecipientEmail(), request.getSubject());

        Notification notification = Notification.builder()
                .recipientEmail(request.getRecipientEmail())
                .subject(request.getSubject())
                .message(request.getMessage())
                .channel(request.getChannel() != null ? request.getChannel() : NotificationChannel.EMAIL)
                .eventType("DIRECT_DISPATCH")
                .status(NotificationStatus.SENT)
                .build();

        Notification saved = notificationRepository.save(notification);
        return NotificationResponse.fromEntity(saved);
    }

    @Transactional
    public void recordEventNotification(String recipientEmail, String subject, String message, String eventType) {
        log.info("[EVENT NOTIFICATION] Event: {} | To: {} | Subject: {}",
                eventType, recipientEmail, subject);

        Notification notification = Notification.builder()
                .recipientEmail(recipientEmail)
                .subject(subject)
                .message(message)
                .channel(NotificationChannel.EMAIL)
                .eventType(eventType)
                .status(NotificationStatus.SENT)
                .build();

        notificationRepository.save(notification);
    }

    public List<NotificationResponse> getAllNotifications() {
        return notificationRepository.findAll().stream()
                .map(NotificationResponse::fromEntity)
                .collect(Collectors.toList());
    }

    public List<NotificationResponse> getNotificationsByRecipient(String email) {
        return notificationRepository.findByRecipientEmailOrderBySentAtDesc(email).stream()
                .map(NotificationResponse::fromEntity)
                .collect(Collectors.toList());
    }
}
