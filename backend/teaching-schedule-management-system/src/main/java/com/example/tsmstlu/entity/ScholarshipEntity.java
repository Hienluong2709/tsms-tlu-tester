package com.example.tsmstlu.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;

@Entity
@Table(name = "scholarships")
@Data
public class ScholarshipEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "semester_id")
    private SemesterEntity semester;

    private String name;
    private String type;

    @Column(name = "min_gpa")
    private BigDecimal minGpa;

    @Column(name = "min_conduct_score")
    private Integer minConductScore;

    private BigDecimal budget;
}