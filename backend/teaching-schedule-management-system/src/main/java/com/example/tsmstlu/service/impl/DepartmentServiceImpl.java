package com.example.tsmstlu.service.impl;

import com.example.tsmstlu.dto.department.DepartmentCreateDto;
import com.example.tsmstlu.dto.department.DepartmentDto;
import com.example.tsmstlu.dto.department.DepartmentListDto;
import com.example.tsmstlu.dto.department.DepartmentUpdateDto;
import com.example.tsmstlu.entity.DepartmentEntity;
import com.example.tsmstlu.entity.FacultyEntity;
import com.example.tsmstlu.repository.DepartmentRepository;
import com.example.tsmstlu.repository.FacultyRepository;
import com.example.tsmstlu.service.DepartmentService;
import com.example.tsmstlu.utils.MapperUtils;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.CachePut;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Caching;

import java.util.List;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Service
@Slf4j
public class DepartmentServiceImpl implements DepartmentService {

    private final DepartmentRepository departmentRepository;
    private final FacultyRepository facultyRepository;
    private final MapperUtils mapper;

    @Override
    @Cacheable(value = "departmentCache", key = "'all'")
    public List<DepartmentListDto> getAll() {
        return departmentRepository.findAll()
                .stream()
                .map(mapper::toDepartmentListDto)
                .collect(Collectors.toList());
    }

    @Override
    @Cacheable(value = "departmentCache", key = "#id")
    public DepartmentDto getById(Long id) {
        DepartmentEntity entity = departmentRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Department not found with id: " + id));
        return mapper.toDepartmentDto(entity);
    }

    @Override
    @Caching(
            put = { @CachePut(value = "departmentCache", key = "#result.id") },
            evict = { @CacheEvict(value = "departmentCache", key = "'all'") }
    )
    public DepartmentDto create(DepartmentCreateDto dto) {
        DepartmentEntity entity = mapper.toDepartmentEntity(dto);

        FacultyEntity faculty = facultyRepository.findById(dto.getFacultyId())
                .orElseThrow(() -> new EntityNotFoundException("Faculty not found with id: " + dto.getFacultyId()));
        entity.setFaculty(faculty);

        DepartmentEntity saved = departmentRepository.save(entity);
        return mapper.toDepartmentDto(saved);
    }

    @Override
    @Caching(
            put = { @CachePut(value = "departmentCache", key = "#id") },
            evict = { @CacheEvict(value = "departmentCache", key = "'all'") }
    )
    public DepartmentDto update(Long id, DepartmentUpdateDto dto) {
        DepartmentEntity entity = departmentRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Department not found with id: " + id));

        mapper.copyEntity(dto, entity);

        if (dto.getFacultyId() != null) {
            FacultyEntity faculty = facultyRepository.findById(dto.getFacultyId())
                    .orElseThrow(() -> new EntityNotFoundException("Faculty not found with id: " + dto.getFacultyId()));
            entity.setFaculty(faculty);
        }

        DepartmentEntity updated = departmentRepository.save(entity);
        return mapper.toDepartmentDto(updated);
    }

    @Override
    @Caching(evict = {
            @CacheEvict(value = "departmentCache", key = "#id"),
            @CacheEvict(value = "departmentCache", key = "'all'")
    })
    public void delete(Long id) {
        if (!departmentRepository.existsById(id)) {
            throw new EntityNotFoundException("Department not found with id: " + id);
        }
        departmentRepository.deleteById(id);
        log.info("Deleted department with id: {}", id);
    }
}
