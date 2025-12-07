package com.example.tsmstlu.dto.score;

import lombok.Data;
// import jakarta.validation.constraints.*; // Nếu bạn dùng validation annotation

@Data
public class ConductInputDto {
    private Long semesterId; // Người dùng chọn học kỳ

    // 5 Tiêu chí điểm thành phần (Thay thế cho biến 'score' cũ)
    private Integer criteria1; // Max 20
    private Integer criteria2; // Max 25
    private Integer criteria3; // Max 20
    private Integer criteria4; // Max 25
    private Integer criteria5; // Max 10
}