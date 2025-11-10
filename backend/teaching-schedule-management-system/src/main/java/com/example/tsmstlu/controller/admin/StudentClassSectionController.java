package com.example.tsmstlu.controller.admin;

import com.example.tsmstlu.dto.student_class_section.StudentClassSectionCreateDto;
import com.example.tsmstlu.dto.student_class_section.StudentClassSectionDto;
import com.example.tsmstlu.dto.student_class_section.StudentClassSectionListDto;
import com.example.tsmstlu.dto.student_class_section.StudentInClassDto;
import com.example.tsmstlu.entity.StudentClassSectionEntity;
import com.example.tsmstlu.service.StudentClassSectionService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/student-class-sections")
@PreAuthorize("hasRole('ADMIN')")
public class StudentClassSectionController {

    private final StudentClassSectionService studentClassSectionService;

    public StudentClassSectionController(StudentClassSectionService service) {
        this.studentClassSectionService = service;
    }

    @GetMapping("/{classSectionId}/students")
    public ResponseEntity<List<StudentInClassDto>> getByClassSection(@PathVariable Long classSectionId) {
        return ResponseEntity.ok(studentClassSectionService.getStudentsInClassSection(classSectionId));
    }

    @GetMapping()
    public ResponseEntity<List<StudentClassSectionListDto>> getAllClassSectionsWithStudentCount() {
        return ResponseEntity.ok(studentClassSectionService.getAllClassSectionsWithStudentCount());
    }


    @GetMapping("/{classSectionId}")
    public ResponseEntity<StudentClassSectionDto> getById(@PathVariable Long studentId, @PathVariable Long classSectionId) {
        return ResponseEntity.ok(studentClassSectionService.getById(studentId, classSectionId));
    }

    @PostMapping
    public ResponseEntity<StudentClassSectionDto> create(@RequestBody StudentClassSectionCreateDto dto) {
        return ResponseEntity.ok(studentClassSectionService.create(dto));
    }

    @PostMapping("/{classSectionId}/students/{studentId}")
    public ResponseEntity<StudentClassSectionDto> addStudentToClassSection(
            @PathVariable Long classSectionId,
            @PathVariable Long studentId) {
        return ResponseEntity.ok(studentClassSectionService.addStudentToClassSection(classSectionId, studentId));
    }

    @DeleteMapping("/{classSectionId}/students/{studentId}")
    public ResponseEntity<Void> deleteStudentInClass(@PathVariable Long classSectionId, @PathVariable Long studentId) {
        studentClassSectionService.deleteStudentInClass(classSectionId, studentId);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{classSectionId}")
    public ResponseEntity<Void> delete(@PathVariable Long classSectionId) {
        studentClassSectionService.deleteStudentClassSection(classSectionId);
        return ResponseEntity.noContent().build();
    }
}
