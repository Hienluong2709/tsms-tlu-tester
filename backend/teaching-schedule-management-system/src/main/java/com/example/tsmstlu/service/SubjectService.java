package com.example.tsmstlu.service;

import com.example.tsmstlu.dto.subject.SubjectCreateDto;
import com.example.tsmstlu.dto.subject.SubjectDto;
import com.example.tsmstlu.dto.subject.SubjectListDto;
import com.example.tsmstlu.dto.subject.SubjectUpdateDto;
import com.example.tsmstlu.entity.SubjectEntity;

public interface SubjectService extends BaseService<
        SubjectEntity,
        SubjectListDto,
        SubjectDto,
        SubjectCreateDto,
        SubjectUpdateDto,
        Long> {
}
