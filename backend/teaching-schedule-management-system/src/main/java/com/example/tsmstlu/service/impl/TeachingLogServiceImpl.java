package com.example.tsmstlu.service.impl;

import com.example.tsmstlu.dto.teaching_log.TeacherStatsDto;
import com.example.tsmstlu.entity.TeacherEntity;
import com.example.tsmstlu.repository.TeacherRepository;
import com.example.tsmstlu.repository.TeachingScheduleDetailRepository;
import com.example.tsmstlu.service.TeachingLogService;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TeachingLogServiceImpl implements TeachingLogService {

    private final TeachingScheduleDetailRepository teachingScheduleDetailRepository;
    private final TeacherRepository teacherRepository;

    @Override
    @Cacheable(value = "teacherStatsAll", key = "'semester_' + #semesterId")
    public List<TeacherStatsDto> getAllTeacherStats(Long semesterId) {
        return teachingScheduleDetailRepository.getAllTeacherStats(semesterId);
    }

    @Override
    @Cacheable(value = "teacherStats", key = "#teacherId + '_' + #semesterId")
    public List<TeacherStatsDto> getTeacherStats(Long teacherId, Long semesterId) {
        return teachingScheduleDetailRepository.getTeacherStats(teacherId, semesterId);
    }

    @Override
    @Cacheable(value = "teacherStatsByUsername", key = "#username + '_' + #semesterId")
    public List<TeacherStatsDto> getTeacherStatsByUsername(String username, Long semesterId) {
        TeacherEntity teacher = teacherRepository.findByUserUsername(username)
                .orElseThrow(() -> new RuntimeException("Teacher not found with username: " + username));

        return teachingScheduleDetailRepository.getTeacherStats(teacher.getId(), semesterId);
    }
}
