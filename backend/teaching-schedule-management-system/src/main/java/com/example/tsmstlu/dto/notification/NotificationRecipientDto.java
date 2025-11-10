package com.example.tsmstlu.dto.notification;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NotificationRecipientDto {
    private Long id;
    private Long userId;
    private Boolean isRead;
}
