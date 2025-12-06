package com.example.tsmstlu.dto.score;

import lombok.Data;

@Data
public class ConductResponseDto {
    private Long id;
    private String studentCode;
    private String studentName;
    private String semesterName;
    private Integer score;
    private String rankConduct;
    private String status;
}