package com.example.tsmstlu.service.impl;

import com.example.tsmstlu.dto.student_class_section.*;
import com.example.tsmstlu.entity.*;
import com.example.tsmstlu.repository.*;
import com.example.tsmstlu.service.StudentClassSectionService;
import com.example.tsmstlu.utils.MapperUtils;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.CachePut;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import jakarta.persistence.EntityNotFoundException;
import org.springframework.web.bind.annotation.ResponseStatus;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Slf4j
@RequiredArgsConstructor
public class StudentClassSectionServiceImpl implements StudentClassSectionService {

    private final StudentClassSectionRepository studentClassSectionRepository;
    private final StudentRepository studentRepository;
    private final ClassSectionRepository classSectionRepository;
    private final MapperUtils mapper;

    @Override
    @Cacheable(value = "studentsInClassSection", key = "#classSectionId")
    public List<StudentInClassDto> getStudentsInClassSection(Long classSectionId) {
        List<StudentClassSectionEntity> students =
                studentClassSectionRepository.findAllByClassSectionIdFetchAll(classSectionId);

        if (!classSectionRepository.existsById(classSectionId)) {
            throw new ResourceNotFoundException("Class section with id " + classSectionId + " not found");
        }

        return students.stream()
                .map(scs -> StudentInClassDto.builder()
                        .studentId(scs.getStudent().getId())
                        .studentCode(scs.getStudent().getStudentCode())
                        .fullName(scs.getStudent().getFullName())
                        .className(scs.getStudent().getClassName())
                        .build())
                .collect(Collectors.toList());
    }

    @Override
    @Cacheable(value = "classSectionsWithCount", key = "'all'")
    public List<StudentClassSectionListDto> getAllClassSectionsWithStudentCount() {
        List<Object[]> results = studentClassSectionRepository.getAllClassSectionsWithStudentCount();

        return results.stream()
                .map(obj -> {
                    ClassSectionEntity classSection = (ClassSectionEntity) obj[0];
                    Long studentCount = (Long) obj[1];
                    return StudentClassSectionListDto.builder()
                            .classSection(mapper.toClassSectionDetailDto(classSection))
                            .studentCount(studentCount)
                            .build();
                })
                .collect(Collectors.toList());
    }

    @Override
    @Cacheable(value = "studentClassSection", key = "#classSectionId + '_' + #studentId")
    public StudentClassSectionDto getById(Long classSectionId, Long studentId) {
        StudentClassSectionId id = new StudentClassSectionId(studentId, classSectionId);
        StudentClassSectionEntity entity = studentClassSectionRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Student not found in this class section"));

        return mapper.toStudentClassSectionDto(entity);
    }

    @Override
    @CachePut(value = "studentClassSection", key = "#dto.classSectionId + '_' + #dto.studentId")
    @CacheEvict(value = {"studentsInClassSection", "classSectionsWithCount"}, allEntries = true)
    public StudentClassSectionDto create(StudentClassSectionCreateDto dto) {
        StudentEntity student = studentRepository.findById(dto.getStudentId())
                .orElseThrow(() -> new EntityNotFoundException("Student not found with ID: " + dto.getStudentId()));

        ClassSectionEntity classSection = classSectionRepository.findById(dto.getClassSectionId())
                .orElseThrow(() -> new EntityNotFoundException("ClassSection not found with ID: " + dto.getClassSectionId()));

        StudentClassSectionId id = new StudentClassSectionId(dto.getStudentId(), dto.getClassSectionId());
        if (studentClassSectionRepository.existsById(id)) {
            throw new IllegalArgumentException("Student already exists in this class section");
        }

        StudentClassSectionEntity entity = new StudentClassSectionEntity();
        entity.setId(id);
        entity.setStudent(student);
        entity.setClassSection(classSection);

        StudentClassSectionEntity saved = studentClassSectionRepository.save(entity);
        log.info("Added student {} to class section {}", dto.getStudentId(), dto.getClassSectionId());
        return mapper.toStudentClassSectionDto(saved);
    }


    @Override
    @CacheEvict(value = {"studentClassSection", "studentsInClassSection", "classSectionsWithCount"}, allEntries = true)
    public void deleteStudentInClass(Long classSectionId, Long studentId) {
        StudentClassSectionId id = new StudentClassSectionId(studentId, classSectionId);
        if (!studentClassSectionRepository.existsById(id)) {
            throw new EntityNotFoundException("Student not found in this class section");
        }
        studentClassSectionRepository.deleteById(id);
        log.info("Removed student {} from class section {}", studentId, classSectionId);
    }

    @Override
    @Transactional
    @CacheEvict(value = {"studentClassSection", "studentsInClassSection", "classSectionsWithCount"}, allEntries = true)
    public void deleteStudentClassSection(Long classSectionId) {
        if (!classSectionRepository.existsById(classSectionId)) {
            throw new EntityNotFoundException("Class section not found");
        }
        studentClassSectionRepository.deleteByClassSectionId(classSectionId);
        classSectionRepository.deleteById(classSectionId);
        log.info("Deleted class section {} and all its student registrations", classSectionId);
    }

    @Override
    @CacheEvict(value = {"studentsInClassSection", "classSectionsWithCount"}, allEntries = true)
    public StudentClassSectionDto addStudentToClassSection(Long classSectionId, Long studentId) {
        StudentEntity student = studentRepository.findById(studentId)
                .orElseThrow(() -> new EntityNotFoundException("Student not found with ID: " + studentId));

        ClassSectionEntity classSection = classSectionRepository.findById(classSectionId)
                .orElseThrow(() -> new EntityNotFoundException("Class section not found with ID: " + classSectionId));

        StudentClassSectionId id = new StudentClassSectionId(studentId, classSectionId);
        if (studentClassSectionRepository.existsById(id)) {
            throw new IllegalArgumentException("Student already exists in this class section");
        }

        StudentClassSectionEntity entity = new StudentClassSectionEntity();
        entity.setId(id);
        entity.setStudent(student);
        entity.setClassSection(classSection);

        StudentClassSectionEntity saved = studentClassSectionRepository.save(entity);
        log.info("Added student {} to class section {}", studentId, classSectionId);
        return mapper.toStudentClassSectionDto(saved);
    }

    @ResponseStatus(HttpStatus.NOT_FOUND)
    public static class ResourceNotFoundException extends RuntimeException {
        public ResourceNotFoundException(String message) {
            super(message);
        }
    }

}
