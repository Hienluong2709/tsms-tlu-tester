package com.example.tsmstlu.service.impl;

import com.example.tsmstlu.dto.teaching_schedule.StudentScheduleDto;
import com.example.tsmstlu.entity.StudentEntity;
import com.example.tsmstlu.repository.StudentRepository;
import com.example.tsmstlu.repository.TeachingScheduleRepository;
import com.example.tsmstlu.service.StudentScheduleService;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class StudentScheduleServiceImpl implements StudentScheduleService {

    private final TeachingScheduleRepository teachingScheduleRepository;
    private final StudentRepository studentRepository;

    @Override
    @Cacheable(value = "studentScheduleById", key = "#studentId")
    public List<StudentScheduleDto> getScheduleByStudentId(Long studentId) {
        return teachingScheduleRepository.findStudentSchedule(studentId);
    }

    @Override
    @Cacheable(value = "studentScheduleByUsername", key = "#username")
    public List<StudentScheduleDto> getScheduleByUsername(String username) {
        StudentEntity student = studentRepository.findByUserUsername(username)
                .orElseThrow(() -> new RuntimeException("Student not found"));
        return getScheduleByStudentId(student.getId());
    }
}
