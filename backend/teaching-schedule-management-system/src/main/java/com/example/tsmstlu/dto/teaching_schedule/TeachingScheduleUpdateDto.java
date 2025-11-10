package com.example.tsmstlu.dto.teaching_schedule;

import com.example.tsmstlu.dto.teaching_schedule_detail.TeachingScheduleDetailUpdateDto;
import lombok.Data;

import java.util.List;

@Data
public class TeachingScheduleUpdateDto {
    private Long teacherId;
    private Long classSectionId;
    private Long semesterId;
    private Long roomId;
    private String note;
    private List<TeachingScheduleDetailUpdateDto> details;
}
