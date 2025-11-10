package com.example.tsmstlu.controller.admin;

import com.example.tsmstlu.dto.teaching_schedule.TeachingScheduleCreateDto;
import com.example.tsmstlu.dto.teaching_schedule.TeachingScheduleDto;
import com.example.tsmstlu.dto.teaching_schedule.TeachingScheduleListDto;
import com.example.tsmstlu.dto.teaching_schedule.TeachingScheduleUpdateDto;
import com.example.tsmstlu.entity.TeachingScheduleEntity;
import com.example.tsmstlu.service.TeachingScheduleService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/teaching-schedules")
@PreAuthorize("hasRole('ADMIN')")
public class TeachingScheduleController extends BaseController <
        TeachingScheduleEntity,
        TeachingScheduleListDto,
        TeachingScheduleDto,
        TeachingScheduleCreateDto,
        TeachingScheduleUpdateDto,
        Long> {

    public TeachingScheduleController(TeachingScheduleService teachingScheduleService) {
        super(teachingScheduleService);
    }
}
