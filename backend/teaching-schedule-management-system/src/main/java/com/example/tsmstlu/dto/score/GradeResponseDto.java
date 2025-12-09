package com.example.tsmstlu.dto.score;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class GradeResponseDto {
    private Long id;
    private String studentCode;
    private String studentName; // Thêm tên cho dễ nhìn
    private String className;   // Thêm tên lớp
    private BigDecimal midtermScore;
    private BigDecimal finalScore;
    private BigDecimal totalScore10;
    private BigDecimal totalScore4;
    private String letterGrade;
    private Boolean isPassed;
}