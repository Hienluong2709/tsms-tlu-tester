package com.example.tsmstlu.controller.teacher;

import com.example.tsmstlu.dto.teacher.TeacherProfileDto;
import com.example.tsmstlu.service.TeacherService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/teacher/profile")
@PreAuthorize("hasRole('TEACHER')")
@RequiredArgsConstructor
public class TeacherProfileController {

    private final TeacherService teacherService;

    @GetMapping
    public ResponseEntity<TeacherProfileDto> getTeacherProfile() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User userDetails = (User) authentication.getPrincipal();

        TeacherProfileDto teacherProfile = teacherService.getTeacherProfileByUsername(userDetails.getUsername());

        return teacherProfile != null
                ? ResponseEntity.ok(teacherProfile)
                : ResponseEntity.notFound().build();
    }
}
