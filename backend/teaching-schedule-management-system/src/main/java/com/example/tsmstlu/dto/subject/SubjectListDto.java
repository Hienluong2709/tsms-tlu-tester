package com.example.tsmstlu.dto.subject;

import com.example.tsmstlu.dto.faculty.FacultyResponseDto;
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
public class SubjectListDto {
    private Long id;
    private String code;
    private String name;
    private String credits;
    private FacultyResponseDto faculty;
    private String type;
}
