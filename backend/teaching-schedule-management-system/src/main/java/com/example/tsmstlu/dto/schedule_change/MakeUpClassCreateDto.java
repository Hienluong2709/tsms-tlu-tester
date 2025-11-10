package com.example.tsmstlu.dto.schedule_change;

import lombok.Data;

import java.util.Date;

@Data
public class MakeUpClassCreateDto {
    private Long teachingScheduleDetailId;
    private String newPeriodStart;
    private String newPeriodEnd;
    private Date newDate;
    private Long newRoomId;
    private String lectureContent;
    private String fileUrl;
}
