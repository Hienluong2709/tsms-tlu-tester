package com.example.tsmstlu.dto.teacher;

import com.example.tsmstlu.dto.department.DepartmentResponseDto;
import com.example.tsmstlu.dto.faculty.FacultyResponseDto;
import com.example.tsmstlu.dto.user.UserResponseDto;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class TeacherDto {
    private Long id;
    private UserResponseDto user;
    private String teacherCode;
    private String fullName;
    private String gender;
    private String email;
    private Date dateOfBirth;
    private String phoneNumber;
    private DepartmentResponseDto department;
    private FacultyResponseDto faculty;
    private String status;
}
