package com.example.tsmstlu.controller.teacher;

import com.example.tsmstlu.dto.schedule_change.ScheduleChangeDto;
import com.example.tsmstlu.service.ScheduleChangeService;
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
@RequiredArgsConstructor
@RequestMapping("/api/teacher/schedule-change-list")
@PreAuthorize("hasRole('TEACHER')")
public class ScheduleChangeListController {
    private final ScheduleChangeService scheduleChangeService;

    @GetMapping
    public ResponseEntity<List<ScheduleChangeDto>> getAll() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User userDetails = (User) authentication.getPrincipal();

        List<ScheduleChangeDto> list = scheduleChangeService.getByTeacherUsername(userDetails.getUsername());

        return list != null && !list.isEmpty()
                ? ResponseEntity.ok(list)
                : ResponseEntity.notFound().build();
    }
}
