package com.example.tsmstlu.dto.student_class_section;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class StudentInClassDto {
    private Long studentId;
    private String studentCode;
    private String fullName;
    private String className;
}
