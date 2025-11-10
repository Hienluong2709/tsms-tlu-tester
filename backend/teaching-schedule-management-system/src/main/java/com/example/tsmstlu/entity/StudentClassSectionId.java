package com.example.tsmstlu.entity;

import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.*;
import java.io.Serializable;

@Embeddable
@Data
@NoArgsConstructor
@AllArgsConstructor
public class StudentClassSectionId implements Serializable {
    private Long studentId;
    private Long classSectionId;
}