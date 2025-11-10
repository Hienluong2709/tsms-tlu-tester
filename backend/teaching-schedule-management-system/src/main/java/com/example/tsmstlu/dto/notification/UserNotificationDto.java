package com.example.tsmstlu.dto.notification;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserNotificationDto {
    private Long id;
    private String title;
    private String content;
    private String type;
    private Long relatedScheduleChangeId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Boolean isRead;
}

