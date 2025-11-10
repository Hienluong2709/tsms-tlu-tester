package com.example.tsmstlu.repository;

import com.example.tsmstlu.dto.teaching_schedule.StudentScheduleDto;
import com.example.tsmstlu.entity.TeachingScheduleEntity;
import io.lettuce.core.dynamic.annotation.Param;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TeachingScheduleRepository extends JpaRepository<TeachingScheduleEntity, Long> {
    @Query("SELECT ts FROM TeachingScheduleEntity ts WHERE ts.teacher.id = :teacherId")
    List<TeachingScheduleEntity> findByTeacherId(@Param("teacherId") Long teacherId);

    @Query("""
        SELECT new com.example.tsmstlu.dto.teaching_schedule.StudentScheduleDto(
            cs.id,
            cs.name,
            cs.subject.name,
            ts.teacher.fullName,
            ts.room.code,
            d.teachingDate,
            d.periodStart,
            d.periodEnd,
            d.type
        )
        FROM StudentClassSectionEntity scs
        JOIN scs.classSection cs
        JOIN cs.teachingSchedules ts
        JOIN ts.details d
        WHERE scs.student.id = :studentId
        ORDER BY d.teachingDate, d.periodStart
    """)
    List<StudentScheduleDto> findStudentSchedule(@Param("studentId") Long studentId);
}
