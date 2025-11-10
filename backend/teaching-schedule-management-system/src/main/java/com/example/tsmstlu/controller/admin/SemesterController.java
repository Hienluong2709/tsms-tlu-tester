package com.example.tsmstlu.controller.admin;

import com.example.tsmstlu.dto.semester.SemesterDto;
import com.example.tsmstlu.entity.SemesterEntity;
import com.example.tsmstlu.service.SemesterService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/semesters")
@PreAuthorize("hasRole('ADMIN')")
public class SemesterController extends BaseController<SemesterEntity, SemesterDto,SemesterDto,SemesterDto,SemesterDto, Long> {

    public SemesterController(SemesterService semesterService) {
        super(semesterService);
    }
}