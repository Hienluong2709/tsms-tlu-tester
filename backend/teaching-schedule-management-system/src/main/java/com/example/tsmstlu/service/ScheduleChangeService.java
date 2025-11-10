package com.example.tsmstlu.service;

import com.example.tsmstlu.dto.schedule_change.*;
import java.util.List;

public interface ScheduleChangeService {
    List<ScheduleChangeDto> getAll();
    ClassCancelDto getClassCancelById(Long id);
    ClassCancelDto createClassCancel(ClassCancelCreateDto dto);
    MakeUpClassDto getMakeUpClassById(Long id);
    MakeUpClassDto createMakeUpClass(MakeUpClassCreateDto dto);
    List<ScheduleChangeDto> getApprovedSchedules();
    ScheduleChangeApprovedDto approveScheduleChange(Long id);
    ScheduleChangeApprovedDto rejectScheduleChange(Long id);
    List<ScheduleChangeDto> getByTeacherUsername(String username);
}
