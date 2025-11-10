package com.example.tsmstlu.entity;

import com.example.tsmstlu.common.TableNameContants;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@EqualsAndHashCode(callSuper = true)
@Entity
@Table(name = TableNameContants.SUBJECT)
public class SubjectEntity extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String code;
    private String name;
    private String credits;
    private String description;

    @ManyToOne(optional = false)
    @JoinColumn(name = "faculty_id", nullable = false)
    private FacultyEntity faculty;

    @ManyToOne(optional = false)
    @JoinColumn(name = "department_id", nullable = false)
    private DepartmentEntity department;

    private String type;

}
