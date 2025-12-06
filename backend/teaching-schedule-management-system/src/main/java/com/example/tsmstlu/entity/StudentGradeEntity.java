package com.example.tsmstlu.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;

@Entity
@Table(name = "student_grades")
@Data
public class StudentGradeEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // QUAN TRỌNG: Nối với Student qua student_code
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_code", referencedColumnName = "student_code")
    private StudentEntity student;

    // Nối với ClassSection qua ID
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "class_section_id")
    private ClassSectionEntity classSection;

    @Column(name = "attendance_score")
    private BigDecimal attendanceScore; // Chuyên cần

    @Column(name = "midterm_score")
    private BigDecimal midtermScore;    // Giữa kỳ

    @Column(name = "final_score")
    private BigDecimal finalScore;      // Cuối kỳ

    @Column(name = "total_score_10")
    private BigDecimal totalScore10;

    @Column(name = "total_score_4")
    private BigDecimal totalScore4;

    @Column(name = "letter_grade")
    private String letterGrade;

    @Column(name = "is_passed")
    private Boolean isPassed;
}