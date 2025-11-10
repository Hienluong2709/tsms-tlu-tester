package com.example.tsmstlu.service;

import com.example.tsmstlu.dto.teacher.*;
import com.example.tsmstlu.entity.TeacherEntity;

public interface TeacherService  extends BaseService<TeacherEntity, TeacherListDto, TeacherDto, TeacherCreateDto, TeacherUpdateDto, Long> {
    TeacherProfileDto getTeacherProfileByUsername(String username);
}
