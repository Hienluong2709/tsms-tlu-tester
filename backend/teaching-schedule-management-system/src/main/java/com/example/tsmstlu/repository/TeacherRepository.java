package com.example.tsmstlu.repository;

import com.example.tsmstlu.entity.TeacherEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TeacherRepository extends JpaRepository<TeacherEntity, Long> {
    Optional<TeacherEntity> findByUserId(Long userId);
    Optional<TeacherEntity> findByUserUsername(String username);
}
