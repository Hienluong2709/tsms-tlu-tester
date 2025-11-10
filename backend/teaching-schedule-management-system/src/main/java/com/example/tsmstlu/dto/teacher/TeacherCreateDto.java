package com.example.tsmstlu.dto.teacher;

import com.example.tsmstlu.dto.department.DepartmentResponseDto;
import com.example.tsmstlu.dto.faculty.FacultyResponseDto;
import com.example.tsmstlu.dto.user.UserResponseDto;
import com.fasterxml.jackson.annotation.JsonIgnore;
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
public class TeacherCreateDto {
    private Long userId;
    private String teacherCode;
    private String fullName;
    private String gender;
    private String email;
    private Date dateOfBirth;
    private String phoneNumber;
    private Long departmentId;
    private Long facultyId;
    private String status;
}
