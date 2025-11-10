package com.example.tsmstlu.dto.schedule_change;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ClassCancelCreateDto {
    private Long teachingScheduleDetailId;
    private String reason;
    private String fileUrl;
}
