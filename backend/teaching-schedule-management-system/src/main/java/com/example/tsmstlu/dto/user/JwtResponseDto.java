package com.example.tsmstlu.dto.user;

import lombok.*;

@Data
@AllArgsConstructor
public class JwtResponseDto {
    private String token;
    private UserResponseDto user;
}
