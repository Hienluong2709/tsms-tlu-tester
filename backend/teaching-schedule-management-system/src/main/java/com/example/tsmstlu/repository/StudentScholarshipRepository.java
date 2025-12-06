package com.example.tsmstlu.repository;
import com.example.tsmstlu.entity.StudentScholarshipEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface StudentScholarshipRepository extends JpaRepository<StudentScholarshipEntity, Long> {
    List<StudentScholarshipEntity> findByStudent_StudentCode(String studentCode);
}