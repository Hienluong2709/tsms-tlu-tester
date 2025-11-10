package com.example.tsmstlu.repository;

import com.example.tsmstlu.entity.NotificationRecipientEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface NotificationRecipientRepository extends JpaRepository<NotificationRecipientEntity, Long> {
    List<NotificationRecipientEntity> findByUserId(Long userId);
    List<NotificationRecipientEntity> findByUserUsername(String username);
    Optional<NotificationRecipientEntity> findByNotificationIdAndUserId(Long notificationId, Long userId);

}
