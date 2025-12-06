package com.example.tsmstlu.repository;
import com.example.tsmstlu.entity.ConductPointEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface ConductPointRepository extends JpaRepository<ConductPointEntity, Long> {
    Optional<ConductPointEntity> findByStudent_StudentCodeAndSemester_Id(String studentCode, Long semesterId);
}