package com.example.tsmstlu.service;

import com.example.tsmstlu.dto.teaching_schedule.StudentScheduleDto;
import java.util.List;

public interface StudentScheduleService {
    List<StudentScheduleDto> getScheduleByStudentId(Long studentId);
    List<StudentScheduleDto> getScheduleByUsername(String username);

}
