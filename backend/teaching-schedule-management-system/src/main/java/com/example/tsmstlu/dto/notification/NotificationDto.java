package com.example.tsmstlu.dto.notification;

import lombok.*;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NotificationDto {
    private Long id;
    private String title;
    private String content;
    private String type;
    private Long relatedScheduleChangeId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    private List<NotificationRecipientDto> recipients;
}
