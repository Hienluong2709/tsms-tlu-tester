package com.example.tsmstlu.service.impl;

import com.example.tsmstlu.dto.subject.SubjectCreateDto;
import com.example.tsmstlu.dto.subject.SubjectDto;
import com.example.tsmstlu.dto.subject.SubjectListDto;
import com.example.tsmstlu.dto.subject.SubjectUpdateDto;
import com.example.tsmstlu.entity.DepartmentEntity;
import com.example.tsmstlu.entity.FacultyEntity;
import com.example.tsmstlu.entity.SubjectEntity;
import com.example.tsmstlu.repository.DepartmentRepository;
import com.example.tsmstlu.repository.FacultyRepository;
import com.example.tsmstlu.repository.SubjectRepository;
import com.example.tsmstlu.service.SubjectService;
import com.example.tsmstlu.utils.MapperUtils;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Caching;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Slf4j
@RequiredArgsConstructor
public class SubjectServiceImpl implements SubjectService {

    private final SubjectRepository subjectRepository;
    private final MapperUtils mapper;
    private final DepartmentRepository departmentRepository;
    private final FacultyRepository facultyRepository;

    @Override
    @Cacheable(value = "subjectCache", key = "'all'")
    public List<SubjectListDto> getAll() {
        return subjectRepository.findAll()
                .stream()
                .map(mapper::toSubjectListDto)
                .collect(Collectors.toList());
    }

    @Override
    @Cacheable(value = "subjectCache", key = "#id")
    public SubjectDto getById(Long id) {
        SubjectEntity entity = subjectRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Subject not found with id: " + id));
        return mapper.toSubjectDetailDto(entity);
    }

    @Override
    @Caching(evict = {
            @CacheEvict(value = "subjectCache", key = "'all'"),
            @CacheEvict(value = "subjectCache", allEntries = true)
    })
    public SubjectDto create(SubjectCreateDto dto) {
        SubjectEntity entity = mapper.toSubjectEntity(dto);

        if(dto.getDepartmentId() != null) {
            DepartmentEntity department = departmentRepository.findById(dto.getDepartmentId())
                    .orElseThrow(() -> new EntityNotFoundException("Department not found with id: " + dto.getDepartmentId()));
            entity.setDepartment(department);
        }

        if(dto.getFacultyId() != null) {
            FacultyEntity faculty = facultyRepository.findById(dto.getFacultyId())
                    .orElseThrow(() -> new EntityNotFoundException("Faculty not found with id: " + dto.getFacultyId()));
            entity.setFaculty(faculty);
        }

        SubjectEntity saved = subjectRepository.save(entity);
        return mapper.toSubjectDetailDto(saved);
    }

    @Override
    @Caching(evict = {
            @CacheEvict(value = "subjectCache", key = "#id"),
            @CacheEvict(value = "subjectCache", key = "'all'")
    })
    public SubjectDto update(Long id, SubjectUpdateDto dto) {
        SubjectEntity entity = subjectRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Subject not found with id: " + id));

        mapper.copyEntity(dto, entity);

        if (dto.getDepartmentId() != null) {
            DepartmentEntity department = departmentRepository.findById(dto.getDepartmentId())
                    .orElseThrow(() -> new EntityNotFoundException("Department not found with id: " + dto.getDepartmentId()));
            entity.setDepartment(department);
        }

        if (dto.getFacultyId() != null) {
            FacultyEntity faculty = facultyRepository.findById(dto.getFacultyId())
                    .orElseThrow(() -> new EntityNotFoundException("Faculty not found with id: " + dto.getFacultyId()));
            entity.setFaculty(faculty);
        }

        SubjectEntity updated = subjectRepository.save(entity);
        return mapper.toSubjectDetailDto(updated);
    }

    @Override
    @Caching(evict = {
            @CacheEvict(value = "subjectCache", key = "#id"),
            @CacheEvict(value = "subjectCache", key = "'all'")
    })
    public void delete(Long id) {
        if (!subjectRepository.existsById(id)) {
            throw new EntityNotFoundException("Subject not found with id: " + id);
        }
        subjectRepository.deleteById(id);
        log.info("Deleted subject with id: {}", id);
    }
}
