package com.example.tsmstlu.controller.student;

import com.example.tsmstlu.dto.teaching_schedule.StudentScheduleDto;
import com.example.tsmstlu.service.StudentScheduleService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/student/schedules")
@RequiredArgsConstructor
@PreAuthorize("hasRole('STUDENT')")
public class StudentScheduleController {

    private final StudentScheduleService studentScheduleService;

    @GetMapping
    public ResponseEntity<List<StudentScheduleDto>> getSchedule() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User userDetails = (User) authentication.getPrincipal();

        List<StudentScheduleDto> schedules = studentScheduleService.getScheduleByUsername(userDetails.getUsername());

        return schedules != null && !schedules.isEmpty()
                ? ResponseEntity.ok(schedules)
                : ResponseEntity.notFound().build();
    }
}
