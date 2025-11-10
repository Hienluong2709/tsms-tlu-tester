package com.example.tsmstlu.controller.admin;

import com.example.tsmstlu.dto.subject.SubjectCreateDto;
import com.example.tsmstlu.dto.subject.SubjectDto;
import com.example.tsmstlu.dto.subject.SubjectListDto;
import com.example.tsmstlu.dto.subject.SubjectUpdateDto;
import com.example.tsmstlu.entity.SubjectEntity;
import com.example.tsmstlu.service.SubjectService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/subjects")
@PreAuthorize("hasRole('ADMIN')")
public class SubjectController extends BaseController<
        SubjectEntity,
        SubjectListDto,
        SubjectDto,
        SubjectCreateDto,
        SubjectUpdateDto,
        Long> {

    public SubjectController(SubjectService subjectService) {
        super(subjectService);
    }
}
