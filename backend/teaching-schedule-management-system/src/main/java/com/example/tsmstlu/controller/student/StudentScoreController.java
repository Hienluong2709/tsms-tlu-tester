package com.example.tsmstlu.controller.student;

import com.example.tsmstlu.dto.score.ConductInputDto;
import com.example.tsmstlu.service.ScoreService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/student/scores")
@PreAuthorize("hasRole('STUDENT')")
@RequiredArgsConstructor
public class StudentScoreController {

    private final ScoreService scoreService;

    // Dùng API này để test cho dễ (truyền mã sinh viên vào URL)
    @PostMapping("/conduct-test")
    public ResponseEntity<?> submitConductTest(@RequestParam String studentCode, 
                                               @RequestBody ConductInputDto dto) {
        return ResponseEntity.ok(scoreService.submitConductScore(studentCode, dto));
    }

    @GetMapping("/semesters")
    public ResponseEntity<?> getSemesters() {
        return ResponseEntity.ok(scoreService.getAllSemestersForStudent());
    }
}