package com.example.tsmstlu.dto.teaching_schedule;

import com.example.tsmstlu.dto.class_section.ClassSectionResponseDto;
import com.example.tsmstlu.dto.room.RoomResponseDto;
import com.example.tsmstlu.dto.semester.SemesterResponseDto;
import com.example.tsmstlu.dto.teacher.TeacherResponseDto;
import lombok.Data;

@Data
public class TeachingScheduleListDto {
    private Long id;
    private TeacherResponseDto teacher;
    private ClassSectionResponseDto classSection;
    private SemesterResponseDto semester;
    private RoomResponseDto room;
    private String note;
}
