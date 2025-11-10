package com.example.tsmstlu.service;

import com.example.tsmstlu.dto.student.*;
import com.example.tsmstlu.entity.StudentEntity;

public interface StudentService extends BaseService<StudentEntity, StudentListDto, StudentDto, StudentCreateDto, StudentUpdateDto, Long> {
    StudentProfileDto getStudentProfileByUsername(String username);
}