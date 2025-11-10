package com.example.tsmstlu.dto.teaching_schedule;

import com.example.tsmstlu.dto.class_section.ClassSectionResponseDto;
import com.example.tsmstlu.dto.room.RoomResponseDto;
import com.example.tsmstlu.dto.semester.SemesterResponseDto;
import com.example.tsmstlu.dto.teacher.TeacherResponseDto;
import com.example.tsmstlu.dto.teaching_schedule_detail.TeachingScheduleDetailResponseDto;
import lombok.Data;

import java.util.List;

@Data
public class TeachingScheduleDto {
    private Long id;
    private ClassSectionResponseDto classSection;
    private String note;
    private List<TeachingScheduleDetailResponseDto> details;
}
