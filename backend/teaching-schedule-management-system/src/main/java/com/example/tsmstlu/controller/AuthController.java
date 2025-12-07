package com.example.tsmstlu.controller;

import com.example.tsmstlu.dto.user.*;
import com.example.tsmstlu.entity.UserEntity;
import com.example.tsmstlu.entity.TeacherEntity;
import com.example.tsmstlu.entity.StudentEntity;
import com.example.tsmstlu.repository.UserRepository;
import com.example.tsmstlu.repository.TeacherRepository;
import com.example.tsmstlu.repository.StudentRepository;
import com.example.tsmstlu.utils.JwtUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtUtils jwtUtils;
    private final UserRepository userRepository;
    private final TeacherRepository teacherRepository;
    private final StudentRepository studentRepository;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody UserLoginDto loginDto) {
        Authentication auth;
        try {
            auth = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginDto.getUsername(), loginDto.getPassword())
            );
        } catch (BadCredentialsException e) {
            return ResponseEntity.status(401).body("Sai username hoặc password");
        }

        SecurityContextHolder.getContext().setAuthentication(auth);
        UserDetails userDetails = (UserDetails) auth.getPrincipal();

        String token = jwtUtils.generateToken(userDetails.getUsername());

        UserEntity userEntity = userRepository.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Lấy quyền (Role)
        String role = userDetails.getAuthorities().iterator().next().getAuthority();

        Long teacherId = null;
        Long studentId = null;
        String fullName = null;
        String studentCode = null; // 1. Khai báo biến studentCode

        // Kiểm tra Role (Thêm check cả "STUDENT" cho chắc chắn vì bạn đã sửa DB)
        if ("ROLE_TEACHER".equals(role) || "TEACHER".equals(role)) {
            TeacherEntity teacher = teacherRepository.findByUserId(userEntity.getId())
                    .orElseThrow(() -> new RuntimeException("Teacher not found for user " + userEntity.getId()));
            teacherId = teacher.getId();
            fullName = teacher.getFullName();
            
        } else if ("ROLE_STUDENT".equals(role) || "STUDENT".equals(role)) {
            StudentEntity student = studentRepository.findByUserId(userEntity.getId())
                    .orElseThrow(() -> new RuntimeException("Student not found for user " + userEntity.getId()));
            studentId = student.getId();
            fullName = student.getFullName();
            studentCode = student.getStudentCode(); // 2. Lấy mã sinh viên từ bảng students
        }

        // 3. Đóng gói vào DTO trả về
        UserResponseDto userResponseDto = UserResponseDto.builder()
                .id(userEntity.getId())
                .username(userDetails.getUsername())
                .role(role)
                .teacherId(teacherId)
                .studentId(studentId)
                .fullName(fullName)
                .studentCode(studentCode) // <-- QUAN TRỌNG: Gửi kèm studentCode về
                .build();

        return ResponseEntity.ok(new JwtResponseDto(token, userResponseDto));
    }
}