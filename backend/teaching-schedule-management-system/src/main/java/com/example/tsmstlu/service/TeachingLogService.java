package com.example.tsmstlu.service;

import com.example.tsmstlu.dto.teacher.TeacherProfileDto;
import com.example.tsmstlu.dto.teaching_log.TeacherStatsDto;

import java.util.List;

public interface TeachingLogService {
    List<TeacherStatsDto> getAllTeacherStats(Long semesterId);
    /**
     * Lấy thống kê giờ giảng dạy cho giảng viên theo kỳ học
     *
     * @param teacherId  ID giảng viên
     * @param semesterId ID học kỳ (có thể null để lấy tất cả)
     * @return danh sách thống kê theo học kỳ
     */
    List<TeacherStatsDto> getTeacherStats(Long teacherId, Long semesterId);
    List<TeacherStatsDto> getTeacherStatsByUsername(String username, Long semesterId);
}
