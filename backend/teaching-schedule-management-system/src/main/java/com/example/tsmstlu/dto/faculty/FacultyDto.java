package com.example.tsmstlu.dto.faculty;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class FacultyDto {
    private Long id;
    private String code;
    private String name;
    private String description;
}
