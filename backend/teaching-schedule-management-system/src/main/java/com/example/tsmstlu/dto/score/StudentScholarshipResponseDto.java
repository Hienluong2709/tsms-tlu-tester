package com.example.tsmstlu.dto.score;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class StudentScholarshipResponseDto {
    private String studentCode;
    private String studentName;
    private String scholarshipName;
    private BigDecimal amount;
    private String status;
    private String note;
}