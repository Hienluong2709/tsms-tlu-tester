package com.example.tsmstlu.dto.subject;

import com.example.tsmstlu.dto.department.DepartmentResponseDto;
import com.example.tsmstlu.dto.faculty.FacultyResponseDto;
import com.example.tsmstlu.entity.DepartmentEntity;
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
public class SubjectUpdateDto {
    private String code;
    private String name;
    private String credits;
    private String description;
    private Long departmentId;
    private Long facultyId;
    private String type;
}
