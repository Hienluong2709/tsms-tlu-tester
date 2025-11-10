package com.example.tsmstlu.dto.teaching_log;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class TeacherStatsDto {
    private Long teacherId;
    private String teacherName;
    private Long semesterId;
    private String semesterName;
    private Long taughtHours;
    private Long notTaughtHours;
    private Long makeUpHours;
    private Long totalHours;
}
