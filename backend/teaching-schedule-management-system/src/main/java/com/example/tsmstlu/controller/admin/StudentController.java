package com.example.tsmstlu.controller.admin;

import com.example.tsmstlu.dto.student.StudentCreateDto;
import com.example.tsmstlu.dto.student.StudentDto;
import com.example.tsmstlu.dto.student.StudentListDto;
import com.example.tsmstlu.dto.student.StudentUpdateDto;
import com.example.tsmstlu.entity.StudentEntity;
import com.example.tsmstlu.service.StudentService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/students")
@PreAuthorize("hasRole('ADMIN')")
public class StudentController extends BaseController <
        StudentEntity,
        StudentListDto,
        StudentDto,
        StudentCreateDto,
        StudentUpdateDto,
        Long> {

    public StudentController(StudentService studentService) {
        super(studentService);
    }
}
