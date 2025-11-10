package com.example.tsmstlu.dto.semester;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.*;
import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class SemesterDto {
    private Long id;
    private String name;
    private String academicYear;
    private LocalDate startDate;
    private LocalDate endDate;
    private String status;
}
