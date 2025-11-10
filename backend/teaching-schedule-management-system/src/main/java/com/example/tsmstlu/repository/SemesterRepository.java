package com.example.tsmstlu.repository;

import com.example.tsmstlu.entity.SemesterEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SemesterRepository extends JpaRepository<SemesterEntity, Long> {
}
