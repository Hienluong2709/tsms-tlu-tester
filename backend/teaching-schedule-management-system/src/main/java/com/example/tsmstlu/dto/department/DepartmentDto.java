package com.example.tsmstlu.dto.department;

import com.example.tsmstlu.dto.faculty.FacultyResponseDto;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class DepartmentDto {
    private Long id;
    private String code;
    private String name;
    private String description;
    private FacultyResponseDto faculty;
}
