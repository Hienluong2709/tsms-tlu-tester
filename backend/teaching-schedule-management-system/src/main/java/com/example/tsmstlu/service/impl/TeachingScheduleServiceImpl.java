package com.example.tsmstlu.service.impl;

import com.example.tsmstlu.dto.teaching_schedule.*;
import com.example.tsmstlu.entity.*;
import com.example.tsmstlu.repository.*;
import com.example.tsmstlu.utils.MapperUtils;
import com.example.tsmstlu.service.TeachingScheduleService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Caching;

@Slf4j
@Service
@RequiredArgsConstructor
public class TeachingScheduleServiceImpl implements TeachingScheduleService {

    private final TeachingScheduleRepository teachingScheduleRepository;
    private final MapperUtils mapperUtils;
    private final ClassSectionRepository classSectionRepository;

    @Override
    @Cacheable(value = "teachingScheduleCache", key = "'all'")
    public List<TeachingScheduleListDto> getAll() {
        return teachingScheduleRepository.findAll()
                .stream()
                .map(mapperUtils::toTeachingScheduleListDto)
                .collect(Collectors.toList());
    }

    @Override
    @Cacheable(value = "teachingScheduleCache", key = "#id")
    public TeachingScheduleDto getById(Long id) {
        TeachingScheduleEntity entity = teachingScheduleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Schedule not found"));
        return mapperUtils.toTeachingScheduleDto(entity);
    }

    @Override
    @Transactional
    @Caching(evict = {
            @CacheEvict(value = "teachingScheduleCache", key = "'all'"),
            @CacheEvict(value = "teachingScheduleCache", allEntries = true)
    })
    public TeachingScheduleDto create(TeachingScheduleCreateDto dto) {
        TeachingScheduleEntity schedule = mapperUtils.toTeachingScheduleEntity(dto);

        if(dto.getClassSectionId() != null) {
            ClassSectionEntity classSection = classSectionRepository.findById(dto.getClassSectionId())
                    .orElseThrow(() -> new RuntimeException("Class section not found"));
            schedule.setClassSection(classSection);

            schedule.setRoom(classSection.getRoom());
            schedule.setSemester(classSection.getSemester());
            schedule.setTeacher(classSection.getTeacher());
        }

        schedule.setDetails(dto.getDetails().stream()
                .map(d -> {
                    TeachingScheduleDetailEntity detail = mapperUtils.toTeachingScheduleDetailEntity(d);
                    detail.setSchedule(schedule);
                    detail.setStatus("CHUA_DAY");
                    return detail;
                }).collect(Collectors.toList())
        );

        TeachingScheduleEntity saved = teachingScheduleRepository.save(schedule);
        return mapperUtils.toTeachingScheduleDto(saved);
    }

    @Override
    @Transactional@Caching(evict = {
            @CacheEvict(value = "teachingScheduleCache", key = "#id"),
            @CacheEvict(value = "teachingScheduleCache", key = "'all'"),
            @CacheEvict(value = "teachingScheduleByTeacher", allEntries = true)
    })

    public TeachingScheduleDto update(Long id, TeachingScheduleUpdateDto dto) {
        TeachingScheduleEntity schedule = teachingScheduleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Schedule not found"));

        mapperUtils.copyEntity(dto, schedule);

        if(dto.getClassSectionId() != null) {
            ClassSectionEntity classSection = classSectionRepository.findById(dto.getClassSectionId())
                    .orElseThrow(() -> new RuntimeException("Class section not found"));
            schedule.setClassSection(classSection);

            schedule.setRoom(classSection.getRoom());
            schedule.setSemester(classSection.getSemester());
            schedule.setTeacher(classSection.getTeacher());
        }

        schedule.getDetails().clear();
        dto.getDetails().forEach(d -> {
            TeachingScheduleDetailEntity detail = mapperUtils.toTeachingScheduleDetailEntity(d);
            detail.setSchedule(schedule);
            schedule.getDetails().add(detail);
        });

        TeachingScheduleEntity updated = teachingScheduleRepository.save(schedule);
        return mapperUtils.toTeachingScheduleDto(updated);
    }

    @Override
    @Transactional
    @Caching(evict = {
            @CacheEvict(value = "teachingScheduleCache", key = "#id"),
            @CacheEvict(value = "teachingScheduleCache", key = "'all'"),
            @CacheEvict(value = "teachingScheduleByTeacher", allEntries = true)
    })
    public void delete(Long id) {
        if (!teachingScheduleRepository.existsById(id)) {
            throw new RuntimeException("Schedule not found");
        }
        teachingScheduleRepository.deleteById(id);
        log.info("Deleted teaching schedule with id: {}", id);
    }

    @Override
    @Cacheable(value = "teachingScheduleByTeacher", key = "#teacherId")
    public List<TeachingScheduleDto> getTeachingScheduleByTeacherId(Long teacherId) {
        List<TeachingScheduleEntity> schedules = teachingScheduleRepository.findByTeacherId(teacherId);

        if (schedules.isEmpty()) {
            throw new RuntimeException("No teaching schedule found for teacherId: " + teacherId);
        }

        return schedules.stream()
                .map(mapperUtils::toTeachingScheduleDto)
                .collect(Collectors.toList());
    }
}
