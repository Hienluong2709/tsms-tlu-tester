package com.example.tsmstlu.controller.admin;

import com.example.tsmstlu.dto.faculty.FacultyDto;
import com.example.tsmstlu.entity.FacultyEntity;
import com.example.tsmstlu.service.FacultyService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/faculties")
@PreAuthorize("hasRole('ADMIN')")
public class FacultyController extends BaseController<FacultyEntity, FacultyDto,FacultyDto, FacultyDto, FacultyDto, Long> {

    public FacultyController(FacultyService facultyService) {
        super(facultyService);
    }
}
