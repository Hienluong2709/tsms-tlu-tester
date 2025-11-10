package com.example.tsmstlu.repository;

import com.example.tsmstlu.dto.teaching_log.TeacherStatsDto;
import com.example.tsmstlu.entity.TeacherEntity;
import com.example.tsmstlu.entity.TeachingScheduleDetailEntity;
import com.example.tsmstlu.entity.TeachingScheduleEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface TeachingScheduleDetailRepository extends JpaRepository<TeachingScheduleDetailEntity, Long> {

    @Query("""
        SELECT new com.example.tsmstlu.dto.teaching_log.TeacherStatsDto(
            t.id,
            t.fullName,
            s.id,
            s.name,
            SUM(CASE WHEN d.status = 'DA_DAY' THEN d.periodEnd - d.periodStart + 1 ELSE 0 END),
            SUM(CASE WHEN d.status = 'CHUA_DAY' THEN d.periodEnd - d.periodStart + 1 ELSE 0 END),
            SUM(CASE WHEN d.status = 'DAY_BU' THEN d.periodEnd - d.periodStart + 1 ELSE 0 END),
            SUM(d.periodEnd - d.periodStart + 1)
        )
        FROM TeachingScheduleDetailEntity d
        JOIN d.schedule ts
        JOIN ts.teacher t
        JOIN ts.semester s
        WHERE (:semesterId IS NULL OR s.id = :semesterId)
        GROUP BY t.id, s.id, t.fullName, s.name
    """)
    List<TeacherStatsDto> getAllTeacherStats(@Param("semesterId") Long semesterId);

    // Thống kê giờ giảng dạy cho 1 giảng viên theo kỳ học
    @Query("""
        SELECT new com.example.tsmstlu.dto.teaching_log.TeacherStatsDto(
            t.id,
            t.fullName,
            s.id,
            s.name,
            SUM(CASE WHEN d.status = 'DA_DAY' THEN d.periodEnd - d.periodStart + 1 ELSE 0 END),
            SUM(CASE WHEN d.status = 'CHUA_DAY' THEN d.periodEnd - d.periodStart + 1 ELSE 0 END),
            SUM(CASE WHEN d.status = 'DAY_BU' THEN d.periodEnd - d.periodStart + 1 ELSE 0 END),
            SUM(d.periodEnd - d.periodStart + 1)
        )
        FROM TeachingScheduleDetailEntity d
        JOIN d.schedule ts
        JOIN ts.teacher t
        JOIN ts.semester s
        WHERE t.id = :teacherId AND (:semesterId IS NULL OR s.id = :semesterId)
        GROUP BY t.id, s.id, t.fullName, s.name
    """)
    List<TeacherStatsDto> getTeacherStats(@Param("teacherId") Long teacherId, @Param("semesterId") Long semesterId);

    @Query("""
        select d from TeachingScheduleDetailEntity d
        left join fetch d.schedule s
        left join fetch s.details
        where d.id = :id
    """)
    Optional<TeachingScheduleDetailEntity> findByIdWithScheduleDetails(@Param("id") Long id);
}
