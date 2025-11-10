package com.example.tsmstlu.repository;

import com.example.tsmstlu.entity.ScheduleChangeEntity;
import com.example.tsmstlu.entity.TeachingScheduleEntity;
import io.lettuce.core.dynamic.annotation.Param;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ScheduleChangeRepository extends JpaRepository<ScheduleChangeEntity, Long> {
    List<ScheduleChangeEntity> findByStatus(String status);
    List<ScheduleChangeEntity> findByTeachingScheduleDetailScheduleTeacherUserUsername(String username);
}
