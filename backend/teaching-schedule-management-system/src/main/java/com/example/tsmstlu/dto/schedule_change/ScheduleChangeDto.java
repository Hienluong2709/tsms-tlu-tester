package com.example.tsmstlu.dto.schedule_change;

import com.example.tsmstlu.dto.class_section.ClassSectionResponseDto;
import com.example.tsmstlu.dto.teaching_schedule.TeachingScheduleResponseDto;
import com.example.tsmstlu.dto.teaching_schedule_detail.TeachingScheduleDetailResponseDto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ScheduleChangeDto {
    private Long id;
    private String type;
    private ClassSectionResponseDto classSection;
    private TeachingScheduleDetailResponseDto details;
    private Date createdAt;
    private String status;
}