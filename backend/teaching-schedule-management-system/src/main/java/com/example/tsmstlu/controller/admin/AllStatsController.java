package com.example.tsmstlu.controller.admin;

import com.example.tsmstlu.dto.teaching_log.TeacherStatsDto;
import com.example.tsmstlu.service.TeachingLogService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/admin/stats")
@PreAuthorize("hasRole('ADMIN')")
public class AllStatsController {

    private final TeachingLogService teachingLogService;

    @GetMapping("/all")
    public ResponseEntity<List<TeacherStatsDto>> getAllStats(@RequestParam(required = false) Long semesterId) {
        List<TeacherStatsDto> stats = teachingLogService.getAllTeacherStats(semesterId);
        return ResponseEntity.ok(stats);
    }
}
