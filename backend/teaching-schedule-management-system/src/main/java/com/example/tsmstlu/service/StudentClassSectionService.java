package com.example.tsmstlu.service;

import com.example.tsmstlu.dto.student_class_section.StudentClassSectionCreateDto;
import com.example.tsmstlu.dto.student_class_section.StudentClassSectionDto;
import com.example.tsmstlu.dto.student_class_section.StudentClassSectionListDto;
import com.example.tsmstlu.dto.student_class_section.StudentInClassDto;
import java.util.List;

public interface StudentClassSectionService {
    List<StudentInClassDto> getStudentsInClassSection(Long classSectionId);
    StudentClassSectionDto getById(Long classSectionId, Long studentId);
    StudentClassSectionDto create(StudentClassSectionCreateDto dto);
    void deleteStudentInClass(Long classSectionId, Long studentId);
    List<StudentClassSectionListDto> getAllClassSectionsWithStudentCount();
    void deleteStudentClassSection(Long classSectionId);
    StudentClassSectionDto addStudentToClassSection(Long classSectionId, Long studentId);

}
