package com.example.tsmstlu.controller.student;

import com.example.tsmstlu.dto.student.StudentProfileDto;
import com.example.tsmstlu.service.StudentService;
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
@RequestMapping("/api/student/profile")
@PreAuthorize("hasRole('STUDENT')")
@RequiredArgsConstructor
public class StudentProfileController {

    private final StudentService studentService;

    @GetMapping
    public ResponseEntity<StudentProfileDto> getStudentProfile() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User userDetails = (User) authentication.getPrincipal();

        StudentProfileDto profile = studentService.getStudentProfileByUsername(userDetails.getUsername());

        return profile != null ? ResponseEntity.ok(profile) : ResponseEntity.notFound().build();
    }
}