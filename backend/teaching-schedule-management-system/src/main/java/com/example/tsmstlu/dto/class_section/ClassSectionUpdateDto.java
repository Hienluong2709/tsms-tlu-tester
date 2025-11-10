package com.example.tsmstlu.dto.class_section;

import com.example.tsmstlu.dto.department.DepartmentUpdateDto;
import com.example.tsmstlu.dto.faculty.FacultyResponseDto;
import com.example.tsmstlu.dto.room.RoomResponseDto;
import com.example.tsmstlu.dto.semester.SemesterResponseDto;
import com.example.tsmstlu.dto.subject.SubjectResponseDto;
import com.example.tsmstlu.dto.teacher.TeacherResponseDto;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class ClassSectionUpdateDto {
    private String name;
    private Long teacherId;
    private Long subjectId;
    private Long departmentId;
    private Long facultyId;
    private Long semesterId;
    private Long roomId;
}
