package com.vehiclerental.notification.dto;

import com.vehiclerental.notification.entity.Notification;
import com.vehiclerental.notification.entity.NotificationChannel;
import com.vehiclerental.notification.entity.NotificationStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NotificationResponse {
    private Long id;
    private String recipientEmail;
    private String subject;
    private String message;
    private NotificationChannel channel;
    private String eventType;
    private NotificationStatus status;
    private LocalDateTime sentAt;

    public static NotificationResponse fromEntity(Notification n) {
        return NotificationResponse.builder()
                .id(n.getId())
                .recipientEmail(n.getRecipientEmail())
                .subject(n.getSubject())
                .message(n.getMessage())
                .channel(n.getChannel())
                .eventType(n.getEventType())
                .status(n.getStatus())
                .sentAt(n.getSentAt())
                .build();
    }
}
