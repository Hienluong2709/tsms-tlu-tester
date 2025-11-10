package com.example.tsmstlu.controller.teacher;

import com.example.tsmstlu.dto.schedule_change.ClassCancelCreateDto;
import com.example.tsmstlu.dto.schedule_change.ClassCancelDto;
import com.example.tsmstlu.service.ScheduleChangeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/teacher/class-cancel")
@PreAuthorize("hasRole('TEACHER')")
@RequiredArgsConstructor
public class ClassCancelController {

    private final ScheduleChangeService scheduleChangeService;  

//    @GetMapping("/{id}")
//    public ResponseEntity<ClassCancelDto> getClassCancelById(@PathVariable Long id) {
//        ClassCancelDto result = scheduleChangeService.getClassCancelById(id);
//        return ResponseEntity.ok(result);
//    }

    @PostMapping
    public ResponseEntity<ClassCancelDto> createClassCancel(@RequestBody ClassCancelCreateDto dto) {
        ClassCancelDto classCancelDto = scheduleChangeService.createClassCancel(dto);
        return ResponseEntity.ok(classCancelDto);
    }
}
