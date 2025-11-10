package com.example.tsmstlu.controller.teacher;

import com.example.tsmstlu.dto.teaching_schedule.TeachingScheduleDto;
import com.example.tsmstlu.service.TeachingScheduleService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/teacher/schedules")
@PreAuthorize("hasRole('TEACHER')")
@RequiredArgsConstructor
public class TeacherScheduleController {
    private final TeachingScheduleService teachingScheduleService;

    @GetMapping("/{teacherId}")
    public List<TeachingScheduleDto> getByTeacherId(@PathVariable Long teacherId) {
        return teachingScheduleService.getTeachingScheduleByTeacherId(teacherId);
    }
}
