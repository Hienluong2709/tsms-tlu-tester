package com.example.tsmstlu.service.impl;

import com.example.tsmstlu.dto.faculty.FacultyDto;
import com.example.tsmstlu.entity.FacultyEntity;
import com.example.tsmstlu.repository.FacultyRepository;
import com.example.tsmstlu.service.FacultyService;
import com.example.tsmstlu.utils.MapperUtils;
import org.springframework.stereotype.Service;

@Service
public class FacultyServiceImpl extends BaseServiceImpl<FacultyEntity,FacultyDto,FacultyDto,FacultyDto,FacultyDto,Long> implements FacultyService {

    private final MapperUtils mapper;

    public FacultyServiceImpl(FacultyRepository repository, MapperUtils mapper) {
        super(repository);
        this.mapper = mapper;
    }

    @Override
    protected FacultyDto toListDto(FacultyEntity entity) {
        return mapper.toFacultyDto(entity);
    }

    @Override
    protected FacultyDto toDetailDto(FacultyEntity entity) {
        return mapper.toFacultyDto(entity);
    }

    @Override
    protected FacultyEntity fromCreateDto(FacultyDto dto) {
        return mapper.toFacultyEntity(dto);
    }

    @Override
    protected FacultyEntity fromUpdateDto(FacultyDto dto) {
        return mapper.toFacultyEntity(dto);
    }

    @Override
    protected void setId(FacultyEntity entity, Long id) {
        entity.setId(id);
    }

    @Override
    protected String getEntityName() {
        return "faculties";
    }
}

