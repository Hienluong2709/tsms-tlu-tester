package com.example.tsmstlu.service;

import com.example.tsmstlu.dto.notification.*;
import java.util.List;

public interface NotificationService {
    NotificationDto createNotification(NotificationCreateRequestDto request);
    List<NotificationDto> getAll();
    List<NotificationDto> getByUser(Long userId);
    void markAsReadByNotificationId(Long notificationId, String username);
    List<UserNotificationDto> getByUsername(String username);
}
