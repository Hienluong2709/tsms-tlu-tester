package com.example.tsmstlu.service.impl;

import com.example.tsmstlu.dto.class_section.ClassSectionCreateDto;
import com.example.tsmstlu.dto.class_section.ClassSectionDto;
import com.example.tsmstlu.dto.class_section.ClassSectionListDto;
import com.example.tsmstlu.dto.class_section.ClassSectionUpdateDto;
import com.example.tsmstlu.entity.*;
import com.example.tsmstlu.repository.*;
import com.example.tsmstlu.service.ClassSectionService;
import com.example.tsmstlu.utils.MapperUtils;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.Caching;
import org.springframework.stereotype.Service;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.CachePut;
import org.springframework.cache.annotation.CacheEvict;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Slf4j
@RequiredArgsConstructor
public class ClassSectionServiceImpl implements ClassSectionService {

    private final ClassSectionRepository classSectionRepository;
    private final MapperUtils mapper;
    private final TeacherRepository teacherRepository;
    private final SubjectRepository subjectRepository;
    private final DepartmentRepository departmentRepository;
    private final FacultyRepository facultyRepository;
    private final RoomRepository roomRepository;
    private final SemesterRepository semesterRepository;

    @Override
    @Cacheable(value = "classSectionCache", key = "'all'")
    public List<ClassSectionListDto> getAll() {
        return classSectionRepository.findAll()
                .stream()
                .map(mapper::toClassSectionListDto)
                .collect(Collectors.toList());
    }

    @Override
    @Cacheable(value = "classSectionCache", key = "#id")
    public ClassSectionDto getById(Long id) {
        ClassSectionEntity entity = classSectionRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Class Section not found with id: " + id));
        return mapper.toClassSectionDetailDto(entity);
    }

    @Override
    @Caching(
            put = { @CachePut(value = "classSectionCache", key = "#result.id") },
            evict = { @CacheEvict(value = "classSectionCache", key = "'all'") }
    )
    public ClassSectionDto create(ClassSectionCreateDto dto) {
        ClassSectionEntity entity = mapper.toClassSectionEntity(dto);

        if(dto.getTeacherId() != null) {
            TeacherEntity teacher = teacherRepository.findById(dto.getTeacherId())
                    .orElseThrow(() -> new EntityNotFoundException("Teacher not found with id: " + dto.getTeacherId()));
            entity.setTeacher(teacher);
        }

        if(dto.getSubjectId() != null) {
            SubjectEntity subject = subjectRepository.findById(dto.getSubjectId())
                    .orElseThrow(() -> new EntityNotFoundException("Subject not found with id: " + dto.getSubjectId()));
            entity.setSubject(subject);
        }

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

        if(dto.getRoomId() != null) {
            RoomEntity room = roomRepository.findById(dto.getRoomId())
                    .orElseThrow(() -> new EntityNotFoundException("Room not found with id: " + dto.getRoomId()));
            entity.setRoom(room);
        }

        if(dto.getSemesterId() != null) {
            SemesterEntity semester = semesterRepository.findById(dto.getSemesterId())
                    .orElseThrow(() -> new EntityNotFoundException("Semester not found with id: " + dto.getSemesterId()));
            entity.setSemester(semester);
        }

        ClassSectionEntity saved = classSectionRepository.save(entity);
        return mapper.toClassSectionDetailDto(saved);
    }

    @Override
    @Caching(
            put = { @CachePut(value = "classSectionCache", key = "#id") },
            evict = { @CacheEvict(value = "classSectionCache", key = "'all'") }
    )
    public ClassSectionDto update(Long id, ClassSectionUpdateDto dto) {
        ClassSectionEntity entity = classSectionRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Class Section not found with id: " + id));

        mapper.copyEntity(dto, entity);

        if (dto.getTeacherId() != null) {
            TeacherEntity teacher = teacherRepository.findById(dto.getTeacherId())
                    .orElseThrow(() -> new EntityNotFoundException("Teacher not found with id: " + dto.getTeacherId()));
            entity.setTeacher(teacher);
        }

        if (dto.getSubjectId() != null) {
            SubjectEntity subject = subjectRepository.findById(dto.getSubjectId())
                    .orElseThrow(() -> new EntityNotFoundException("Subject not found with id: " + dto.getSubjectId()));
            entity.setSubject(subject);
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

        if (dto.getRoomId() != null) {
            RoomEntity room = roomRepository.findById(dto.getRoomId())
                    .orElseThrow(() -> new EntityNotFoundException("Room not found with id: " + dto.getRoomId()));
            entity.setRoom(room);
        }

        if (dto.getSemesterId() != null) {
            SemesterEntity semester = semesterRepository.findById(dto.getSemesterId())
                    .orElseThrow(() -> new EntityNotFoundException("Semester not found with id: " + dto.getSemesterId()));
            entity.setSemester(semester);
        }

        ClassSectionEntity updated = classSectionRepository.save(entity);
        return mapper.toClassSectionDetailDto(updated);
    }

    @Override
    @Caching(evict = {
            @CacheEvict(value = "classSectionCache", key = "#id"),
            @CacheEvict(value = "classSectionCache", key = "'all'")
    })
    public void delete(Long id) {
        if(!classSectionRepository.existsById(id)) {
            throw new EntityNotFoundException("Class Section not found with id: " + id);
        }
        classSectionRepository.deleteById(id);
        log.info("Deleted class section with id: {}", id);
    }
}
