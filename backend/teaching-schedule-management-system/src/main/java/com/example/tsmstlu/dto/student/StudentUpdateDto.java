package com.example.tsmstlu.dto.student;

import com.example.tsmstlu.dto.faculty.FacultyResponseDto;
import com.example.tsmstlu.dto.major.MajorResponseDto;
import com.example.tsmstlu.dto.user.UserResponseDto;
import lombok.Data;

import java.util.Date;

@Data
public class StudentUpdateDto {
    private Long userId;
    private String studentCode;
    private String fullName;
    private String gender;
    private String email;
    private String phoneNumber;
    private Date dateOfBirth;
    private String className;
    private Integer enrollmentYear;
    private Long majorId;
    private Long facultyId;
}
