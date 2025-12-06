package com.example.tsmstlu.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "conduct_points")
@Data
public class ConductPointEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_code", referencedColumnName = "student_code")
    private StudentEntity student;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "semester_id")
    private SemesterEntity semester;

    private Integer score; // Điểm số (0-100)

    @Column(name = "rank_conduct")
    private String rankConduct; // Tốt, Khá...

    private String status; // PENDING, APPROVED
}