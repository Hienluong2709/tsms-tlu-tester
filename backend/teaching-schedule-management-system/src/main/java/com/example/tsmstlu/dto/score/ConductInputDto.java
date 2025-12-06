package com.example.tsmstlu.dto.score;

import lombok.Data;

@Data
public class ConductInputDto {
    private Long semesterId;
    private Integer score; // Sinh viên tự đánh giá
}