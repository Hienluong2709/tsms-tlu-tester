package com.example.tsmstlu.controller.admin;

import com.example.tsmstlu.dto.student_class_section.StudentInClassDto;
import com.example.tsmstlu.dto.class_section.ClassSectionCreateDto;
import com.example.tsmstlu.dto.class_section.ClassSectionDto;
import com.example.tsmstlu.dto.class_section.ClassSectionListDto;
import com.example.tsmstlu.dto.class_section.ClassSectionUpdateDto;
import com.example.tsmstlu.entity.ClassSectionEntity;
import com.example.tsmstlu.service.ClassSectionService;
import com.example.tsmstlu.service.StudentClassSectionService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/admin/class-sections")
@PreAuthorize("hasRole('ADMIN')")
public class ClassSectionController extends BaseController <
        ClassSectionEntity,
        ClassSectionListDto,
        ClassSectionDto,
        ClassSectionCreateDto,
        ClassSectionUpdateDto,
        Long> {

    private final StudentClassSectionService studentClassSectionService;

    public ClassSectionController(ClassSectionService classSectionService, StudentClassSectionService studentClassSectionService) {
        super(classSectionService);
        this.studentClassSectionService = studentClassSectionService;
    }

    @GetMapping("/{classSectionId}/students")
    public ResponseEntity<List<StudentInClassDto>> getStudents(@PathVariable Long classSectionId) {
        return ResponseEntity.ok(studentClassSectionService.getStudentsInClassSection(classSectionId));
    }
}
