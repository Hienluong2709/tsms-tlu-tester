package com.example.tsmstlu.service.impl;

import com.example.tsmstlu.dto.teacher.*;
import com.example.tsmstlu.entity.DepartmentEntity;
import com.example.tsmstlu.entity.FacultyEntity;
import com.example.tsmstlu.entity.TeacherEntity;
import com.example.tsmstlu.entity.UserEntity;
import com.example.tsmstlu.repository.DepartmentRepository;
import com.example.tsmstlu.repository.FacultyRepository;
import com.example.tsmstlu.repository.TeacherRepository;
import com.example.tsmstlu.repository.UserRepository;
import com.example.tsmstlu.service.TeacherService;
import com.example.tsmstlu.utils.MapperUtils;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Caching;

@Service
@RequiredArgsConstructor
@Slf4j
public class TeacherServiceImpl implements TeacherService {

    private final MapperUtils mapper;
    private final TeacherRepository teacherRepository;
    private final DepartmentRepository departmentRepository;
    private final FacultyRepository facultyRepository;
    private final UserRepository userRepository;

    @Override
    @Cacheable(value = "teacherCache", key = "'all'")
   public List<TeacherListDto> getAll() {
        return teacherRepository.findAll()
                .stream()
                .map(mapper::toTeacherListDto)
                .collect(Collectors.toList());
    }

    @Override
    @Cacheable(value = "teacherCache", key = "#id")
    public TeacherDto getById(Long id) {
        TeacherEntity entity = teacherRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Teacher not found with id: " + id));
        return mapper.toTeacherDetailDto(entity);
    }

    @Override
    @Caching(evict = {
            @CacheEvict(value = "teacherCache", key = "'all'"),
            @CacheEvict(value = "teacherCache", allEntries = true),
            @CacheEvict(value = "teacherProfileCache", allEntries = true)
    })
    public TeacherDto create(TeacherCreateDto dto) {
        TeacherEntity entity = mapper.toTeacherEntity(dto);

        if(dto.getUserId() != null) {
            UserEntity user = userRepository.findById(dto.getUserId())
                    .orElseThrow(() -> new EntityNotFoundException("User not found with id: " + dto.getUserId()));
            entity.setUser(user);
        }

        DepartmentEntity department = departmentRepository.findById(dto.getDepartmentId())
                .orElseThrow(() -> new EntityNotFoundException("Department not found with id: " + dto.getDepartmentId()));
        entity.setDepartment(department);

        FacultyEntity faculty = facultyRepository.findById(dto.getFacultyId())
                .orElseThrow(() -> new EntityNotFoundException("Faculty not found with id: " + dto.getFacultyId()));
        entity.setFaculty(faculty);

        TeacherEntity saved = teacherRepository.save(entity);
        return mapper.toTeacherDetailDto(saved);
    }

    @Override
    @Caching(evict = {
            @CacheEvict(value = "teacherCache", key = "#id"),
            @CacheEvict(value = "teacherCache", key = "'all'"),
            @CacheEvict(value = "teacherProfileCache", allEntries = true)
    })
    public TeacherDto update(Long id, TeacherUpdateDto dto) {
        TeacherEntity entity = teacherRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Teacher not found with id: " + id));

        mapper.copyEntity(dto, entity);

        if(dto.getUserId() != null) {
            UserEntity user = userRepository.findById(dto.getUserId())
                    .orElseThrow(() -> new EntityNotFoundException("User not found with id: " + dto.getUserId()));
            entity.setUser(user);
        }

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

        TeacherEntity updated = teacherRepository.save(entity);
        return mapper.toTeacherDetailDto(updated);
    }

    @Override
    @Caching(evict = {
            @CacheEvict(value = "teacherCache", key = "#id"),
            @CacheEvict(value = "teacherCache", key = "'all'"),
            @CacheEvict(value = "teacherProfileCache", allEntries = true)
    })
    public void delete(Long id) {
        if (!teacherRepository.existsById(id)) {
            throw new EntityNotFoundException("Teacher not found with id: " + id);
        }
        teacherRepository.deleteById(id);
        log.info("Deleted teacher with id: {}", id);
    }

    @Override
    @Cacheable(value = "teacherProfileCache", key = "#username")
    public TeacherProfileDto getTeacherProfileByUsername(String username) {
        return teacherRepository.findByUserUsername(username)
                .map(mapper::toTeacherProfileDto)
                .orElseThrow(() -> new RuntimeException("Teacher not found with username: " + username));
    }
}
