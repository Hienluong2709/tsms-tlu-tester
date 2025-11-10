package com.example.tsmstlu.dto.teacher;

import com.example.tsmstlu.dto.department.DepartmentResponseDto;
import com.example.tsmstlu.dto.faculty.FacultyResponseDto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TeacherProfileDto {
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
