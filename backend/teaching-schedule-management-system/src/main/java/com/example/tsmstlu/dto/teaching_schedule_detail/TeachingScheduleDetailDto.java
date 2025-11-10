package com.example.tsmstlu.dto.teaching_schedule_detail;

import lombok.Data;
import java.util.Date;

@Data
public class TeachingScheduleDetailDto {
    private Long id;
    private Date teachingDate;
    private Integer periodStart;
    private Integer periodEnd;
    private String type;
    private String status;
}
