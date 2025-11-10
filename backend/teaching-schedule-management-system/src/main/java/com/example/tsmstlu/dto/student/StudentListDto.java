package com.example.tsmstlu.dto.student;

import com.example.tsmstlu.dto.faculty.FacultyResponseDto;
import com.example.tsmstlu.dto.major.MajorResponseDto;
import com.example.tsmstlu.dto.user.UserResponseDto;
import lombok.Data;

@Data
public class StudentListDto {
    private Long id;
    private String studentCode;
    private String fullName;
    private String gender;
    private String className;
    private Integer enrollmentYear;
    private MajorResponseDto major;
    private FacultyResponseDto faculty;
}
