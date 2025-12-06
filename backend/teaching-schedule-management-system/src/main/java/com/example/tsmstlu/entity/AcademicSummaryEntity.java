package com.example.tsmstlu.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;

@Entity
@Table(name = "academic_summaries")
@Data
public class AcademicSummaryEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_code", referencedColumnName = "student_code")
    private StudentEntity student;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "semester_id")
    private SemesterEntity semester;

    @Column(name = "gpa_semester")
    private BigDecimal gpaSemester;

    @Column(name = "avg_score_semester")
    private BigDecimal avgScoreSemester;

    @Column(name = "total_credits")
    private Integer totalCredits;

    @Column(name = "academic_rank")
    private String academicRank; // Xuất sắc, Giỏi...
}