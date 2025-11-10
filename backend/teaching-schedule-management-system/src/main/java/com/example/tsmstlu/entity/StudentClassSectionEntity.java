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
@Table(name = TableNameContants.STUDENT_CLASS_SECTION)
public class StudentClassSectionEntity extends BaseEntity {

    @EmbeddedId
    private StudentClassSectionId id;

    @ManyToOne
    @MapsId("studentId")
    @JoinColumn(name = "student_id", nullable = false)
    private StudentEntity student;

    @ManyToOne
    @MapsId("classSectionId")
    @JoinColumn(name = "class_section_id", nullable = false)
    private ClassSectionEntity classSection;
}


