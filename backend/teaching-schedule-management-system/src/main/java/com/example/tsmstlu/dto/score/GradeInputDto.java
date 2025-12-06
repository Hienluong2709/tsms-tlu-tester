package com.example.tsmstlu.dto.score;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class GradeInputDto {
    private String studentCode;    // Mã sinh viên cần nhập điểm
    private Long classSectionId;   // Mã lớp học phần
    
    private BigDecimal attendanceScore; // Điểm CC
    private BigDecimal midtermScore;    // Điểm GK
    private BigDecimal finalScore;      // Điểm CK
}