package com.example.tsmstlu.dto.student_class_section;

import com.example.tsmstlu.dto.class_section.ClassSectionResponseDto;
import com.example.tsmstlu.dto.student.StudentDto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StudentClassSectionDto {
    private StudentDto student;
    private ClassSectionResponseDto classSection;
}