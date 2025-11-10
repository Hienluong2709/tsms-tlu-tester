package com.example.tsmstlu.dto.teaching_schedule;

import com.example.tsmstlu.dto.teaching_schedule_detail.TeachingScheduleDetailCreateDto;
import lombok.Data;

import java.util.List;


@Data
public class TeachingScheduleCreateDto {
    private Long classSectionId;
    private String note;
    private List<TeachingScheduleDetailCreateDto> details;
}
