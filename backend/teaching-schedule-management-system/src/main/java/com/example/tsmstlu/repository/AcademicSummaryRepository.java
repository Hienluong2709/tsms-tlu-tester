package com.example.tsmstlu.repository;
import com.example.tsmstlu.entity.AcademicSummaryEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface AcademicSummaryRepository extends JpaRepository<AcademicSummaryEntity, Long> {
    Optional<AcademicSummaryEntity> findByStudent_StudentCodeAndSemester_Id(String studentCode, Long semesterId);
}