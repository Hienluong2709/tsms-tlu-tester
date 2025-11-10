package com.example.tsmstlu.controller.teacher;

import com.example.tsmstlu.dto.teaching_schedule_detail.TeachingScheduleDetailDto;
import com.example.tsmstlu.service.TeachingScheduleDetailService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/teacher/teaching-schedule-details")
@RequiredArgsConstructor
public class TeachingScheduleDetailController {

    private final TeachingScheduleDetailService detailService;

    @PutMapping("/{id}/attendance")
    public ResponseEntity<TeachingScheduleDetailDto> markAttendance(@PathVariable Long id) {
        TeachingScheduleDetailDto result = detailService.markAttendance(id);
        return ResponseEntity.ok(result);
    }
}

