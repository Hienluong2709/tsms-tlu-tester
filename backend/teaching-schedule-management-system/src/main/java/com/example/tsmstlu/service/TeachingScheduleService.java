package com.example.tsmstlu.service;

import com.example.tsmstlu.dto.teaching_schedule.*;
import com.example.tsmstlu.entity.TeachingScheduleEntity;

import java.util.List;

public interface TeachingScheduleService extends BaseService<TeachingScheduleEntity, TeachingScheduleListDto, TeachingScheduleDto, TeachingScheduleCreateDto, TeachingScheduleUpdateDto, Long> {
    List<TeachingScheduleDto> getTeachingScheduleByTeacherId(Long teacherId);
}
