package com.example.tsmstlu.controller.admin;

import com.example.tsmstlu.dto.score.GradeInputDto;
import com.example.tsmstlu.service.ScoreService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/scores") // Chuẩn đường dẫn admin
@PreAuthorize("hasRole('ADMIN')")    // Chuẩn bảo mật admin
@RequiredArgsConstructor
public class AdminScoreController {

    private final ScoreService scoreService;

    // 1. Nhập điểm kết quả học tập
    @PostMapping("/grade")
    public ResponseEntity<?> inputGrade(@RequestBody GradeInputDto dto) {
        return ResponseEntity.ok(scoreService.inputGrade(dto));
    }

    // 2. Xét học bổng
    @PostMapping("/scholarship/evaluate/{scholarshipId}")
    public ResponseEntity<?> evaluateScholarship(@PathVariable Long scholarshipId) {
        return ResponseEntity.ok(scoreService.evaluateScholarship(scholarshipId));
    }
}