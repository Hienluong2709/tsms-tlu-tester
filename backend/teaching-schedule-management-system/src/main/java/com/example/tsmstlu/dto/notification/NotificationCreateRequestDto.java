package com.example.tsmstlu.dto.notification;

import lombok.*;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NotificationCreateRequestDto {
    private String title;
    private String content;
    private String type;
    private Long relatedScheduleChangeId;
    private List<Long> recipientUserIds;
}
