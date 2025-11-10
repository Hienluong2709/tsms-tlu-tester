package com.example.tsmstlu.dto.major;

import com.example.tsmstlu.dto.faculty.FacultyResponseDto;
import lombok.Data;

@Data
public class MajorDto {
    private Long id;
    private String name;
    private String code;
    private FacultyResponseDto faculty;
    private String description;
}
