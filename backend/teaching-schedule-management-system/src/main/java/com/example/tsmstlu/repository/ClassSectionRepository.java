package com.example.tsmstlu.repository;

import com.example.tsmstlu.entity.ClassSectionEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ClassSectionRepository extends JpaRepository<ClassSectionEntity, Long> {
}
