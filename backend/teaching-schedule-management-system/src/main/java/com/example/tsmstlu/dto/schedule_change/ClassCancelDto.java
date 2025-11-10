package com.example.tsmstlu.dto.schedule_change;

import com.example.tsmstlu.dto.class_section.ClassSectionResponseDto;
import com.example.tsmstlu.dto.teaching_schedule.TeachingScheduleResponseDto;
import com.example.tsmstlu.dto.teaching_schedule_detail.TeachingScheduleDetailResponseDto;
import lombok.Data;

@Data
public class ClassCancelDto {
    private Long id;
    private ClassSectionResponseDto classSection;
    private TeachingScheduleDetailResponseDto details;
    private String reason;
    private String fileUrl;
    private String status;
}
