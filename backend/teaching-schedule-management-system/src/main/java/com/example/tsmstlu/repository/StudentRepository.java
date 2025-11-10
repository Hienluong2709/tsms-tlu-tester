package com.example.tsmstlu.repository;

import com.example.tsmstlu.entity.StudentEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface StudentRepository extends JpaRepository<StudentEntity, Long> {
    Optional<StudentEntity> findByUserId(Long userId);
    Optional<StudentEntity> findByUserUsername(String username);
}
