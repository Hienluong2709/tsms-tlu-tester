package com.example.tsmstlu.dto.student_class_section;

import com.example.tsmstlu.dto.class_section.ClassSectionResponseDto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class StudentClassSectionDetailDto {
    private Long id;
    private ClassSectionResponseDto classSection;
    private List<StudentInClassDto> students;
}
