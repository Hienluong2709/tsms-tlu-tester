package com.example.tsmstlu.controller.teacher;

import com.example.tsmstlu.dto.schedule_change.MakeUpClassCreateDto;
import com.example.tsmstlu.dto.schedule_change.MakeUpClassDto;
import com.example.tsmstlu.service.ScheduleChangeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/teacher/make-up-class")
@PreAuthorize("hasRole('TEACHER')")
public class MakeUpClassController {

    private final ScheduleChangeService scheduleChangeService;

    @PostMapping
    public ResponseEntity<MakeUpClassDto> createMakeUpClass(@RequestBody MakeUpClassCreateDto dto) {
        MakeUpClassDto makeUpClass = scheduleChangeService.createMakeUpClass(dto);
        return ResponseEntity.ok(makeUpClass);
    }
}
