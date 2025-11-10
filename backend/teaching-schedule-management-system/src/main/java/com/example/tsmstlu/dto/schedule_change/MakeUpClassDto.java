package com.example.tsmstlu.dto.schedule_change;

import com.example.tsmstlu.dto.class_section.ClassSectionResponseDto;
import com.example.tsmstlu.dto.room.RoomResponseDto;
import com.example.tsmstlu.dto.teaching_schedule.TeachingScheduleResponseDto;
import com.example.tsmstlu.dto.teaching_schedule_detail.TeachingScheduleDetailResponseDto;
import lombok.Data;

@Data
public class MakeUpClassDto {
    private Long id;
    private ClassSectionResponseDto classSection;
    private TeachingScheduleDetailResponseDto details;
    private String newPeriodStart;
    private String newPeriodEnd;
    private String newDate;
    private RoomResponseDto newRoom;
    private String lectureContent;
    private String fileUrl;
    private String status;
}
