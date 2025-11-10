package com.example.tsmstlu.controller.admin;

import com.example.tsmstlu.dto.schedule_change.ClassCancelDto;
import com.example.tsmstlu.dto.schedule_change.MakeUpClassDto;
import com.example.tsmstlu.dto.schedule_change.ScheduleChangeApprovedDto;
import com.example.tsmstlu.dto.schedule_change.ScheduleChangeDto;
import com.example.tsmstlu.service.ScheduleChangeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/schedule-changes")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
public class ScheduleChangeController {

    private final ScheduleChangeService scheduleChangeService;

    @GetMapping
    public ResponseEntity<List<ScheduleChangeDto>> getAll() {
        List<ScheduleChangeDto> list = scheduleChangeService.getAll();
        return ResponseEntity.ok(list);
    }

    @GetMapping("/{id}/class-cancel")
    public ResponseEntity<ClassCancelDto> getClassCancelById(@PathVariable Long id) {
        ClassCancelDto dto = scheduleChangeService.getClassCancelById(id);
        return ResponseEntity.ok(dto);
    }

    @GetMapping("/{id}/make-up-class")
    public ResponseEntity<MakeUpClassDto> getMakeUpClassById(@PathVariable Long id) {
        MakeUpClassDto dto = scheduleChangeService.getMakeUpClassById(id);
        return ResponseEntity.ok(dto);
    }

    @GetMapping("/approved")
    public List<ScheduleChangeDto> getApprovedSchedules() {
        return scheduleChangeService.getApprovedSchedules();
    }

    @PutMapping("/{id}/approve")
    public ScheduleChangeApprovedDto approveSchedule(@PathVariable Long id) {
        return scheduleChangeService.approveScheduleChange(id);
    }

    @PutMapping("/{id}/reject")
    public ScheduleChangeApprovedDto rejectSchedule(@PathVariable Long id) {
        return scheduleChangeService.rejectScheduleChange(id);
    }
}
