package com.example.tsmstlu.entity;

import com.example.tsmstlu.common.TableNameContants;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@EqualsAndHashCode(callSuper = true)
@Entity
@Table(name = TableNameContants.STUDENT)
public class StudentEntity extends BaseEntity{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private UserEntity user;

    @Column(name = "student_code", nullable = false, unique = true, length = 20)
    private String studentCode;

    @Column(name = "full_name", nullable = false, length = 100)
    private String fullName;

    private String gender;
    private String email;

    @Column(name = "phone_number", length = 10)
    private String phoneNumber;

    @Column(name = "date_of_birth")
    private Date dateOfBirth;

    @Column(name = "class_name", nullable = false, length = 50)
    private String className;

    @Column(name = "enrollment_year", nullable = false)
    private Integer enrollmentYear;

    @ManyToOne(optional = false)
    @JoinColumn(name = "major_id", nullable = false)
    private MajorEntity major;

    @ManyToOne(optional = false)
    @JoinColumn(name = "faculty_id", nullable = false)
    private FacultyEntity faculty;

    @OneToMany(mappedBy = "student", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<StudentClassSectionEntity> studentClassSections = new ArrayList<>();
}
