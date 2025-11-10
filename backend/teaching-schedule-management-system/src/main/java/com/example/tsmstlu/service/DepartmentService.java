package com.example.tsmstlu.service;

import com.example.tsmstlu.dto.department.DepartmentCreateDto;
import com.example.tsmstlu.dto.department.DepartmentDto;
import com.example.tsmstlu.dto.department.DepartmentListDto;
import com.example.tsmstlu.dto.department.DepartmentUpdateDto;
import com.example.tsmstlu.entity.DepartmentEntity;

import java.util.List;

public interface DepartmentService extends BaseService<DepartmentEntity, DepartmentListDto, DepartmentDto, DepartmentCreateDto, DepartmentUpdateDto, Long> {
}
