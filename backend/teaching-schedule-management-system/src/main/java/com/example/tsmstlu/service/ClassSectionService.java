package com.example.tsmstlu.service;

import com.example.tsmstlu.dto.class_section.ClassSectionCreateDto;
import com.example.tsmstlu.dto.class_section.ClassSectionDto;
import com.example.tsmstlu.dto.class_section.ClassSectionListDto;
import com.example.tsmstlu.dto.class_section.ClassSectionUpdateDto;
import com.example.tsmstlu.entity.ClassSectionEntity;

public interface ClassSectionService extends BaseService<
        ClassSectionEntity,
        ClassSectionListDto,
        ClassSectionDto,
        ClassSectionCreateDto,
        ClassSectionUpdateDto,
        Long> {
}
