package com.example.tsmstlu.dto.major;

import lombok.Data;

@Data
public class MajorUpdateDto {
    private String name;
    private String code;
    private Long facultyId;
    private String description;
}
