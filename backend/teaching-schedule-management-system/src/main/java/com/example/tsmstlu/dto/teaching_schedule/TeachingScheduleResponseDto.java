package com.example.tsmstlu.dto.teaching_schedule;

import com.example.tsmstlu.dto.class_section.ClassSectionResponseDto;
import com.example.tsmstlu.dto.teaching_schedule_detail.TeachingScheduleDetailResponseDto;
import lombok.Data;

import java.util.List;

@Data
public class TeachingScheduleResponseDto {
    private ClassSectionResponseDto classSection;
    private List<TeachingScheduleDetailResponseDto> details;
}
