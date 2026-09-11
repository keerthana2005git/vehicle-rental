package com.vehiclerental.notification.repository;

import com.vehiclerental.notification.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByRecipientEmailOrderBySentAtDesc(String recipientEmail);
    List<Notification> findByEventTypeOrderBySentAtDesc(String eventType);
}
