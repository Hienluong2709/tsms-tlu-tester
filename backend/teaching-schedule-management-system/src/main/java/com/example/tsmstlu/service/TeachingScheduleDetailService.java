package com.example.tsmstlu.service;

import com.example.tsmstlu.dto.teaching_schedule_detail.TeachingScheduleDetailDto;

import java.util.List;

public interface TeachingScheduleDetailService {
    TeachingScheduleDetailDto markAttendance(Long detailId);

}
