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

    // --- CÁC TRƯỜNG MỚI ---
    @Column(name = "criteria_1")
    private Integer criteria1;

    @Column(name = "criteria_2")
    private Integer criteria2;

    @Column(name = "criteria_3")
    private Integer criteria3;

    @Column(name = "criteria_4")
    private Integer criteria4;

    @Column(name = "criteria_5")
    private Integer criteria5;
    // ----------------------

    private Integer score; // Tổng điểm (Vẫn giữ để query cho nhanh)

    @Column(name = "rank_conduct")
    private String rankConduct; // Xếp loại

    private String status; // PENDING, APPROVED
}