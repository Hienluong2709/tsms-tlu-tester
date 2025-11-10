package com.example.tsmstlu.controller.admin;

import com.example.tsmstlu.dto.teacher.*;
import com.example.tsmstlu.entity.TeacherEntity;
import com.example.tsmstlu.service.TeacherService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/teachers")
@PreAuthorize("hasRole('ADMIN')")
public class TeacherController extends BaseController<
        TeacherEntity,
        TeacherListDto,
        TeacherDto,
        TeacherCreateDto,
        TeacherUpdateDto,
        Long> {

    public TeacherController(TeacherService teacherService) {
        super(teacherService);
    }
}
