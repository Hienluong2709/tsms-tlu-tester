package com.example.tsmstlu.controller.admin;

import com.example.tsmstlu.dto.major.MajorCreateDto;
import com.example.tsmstlu.dto.major.MajorDto;
import com.example.tsmstlu.dto.major.MajorListDto;
import com.example.tsmstlu.dto.major.MajorUpdateDto;
import com.example.tsmstlu.entity.MajorEntity;
import com.example.tsmstlu.service.MajorService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/majors")
@PreAuthorize("hasRole('ADMIN')")
public class MajorController extends BaseController<
        MajorEntity,
        MajorListDto,
        MajorDto,
        MajorCreateDto,
        MajorUpdateDto,
        Long> {

    public MajorController(MajorService majorService) {
        super(majorService);
    }
}
