package com.example.tsmstlu.repository;
import com.example.tsmstlu.entity.ScholarshipEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ScholarshipRepository extends JpaRepository<ScholarshipEntity, Long> {
}