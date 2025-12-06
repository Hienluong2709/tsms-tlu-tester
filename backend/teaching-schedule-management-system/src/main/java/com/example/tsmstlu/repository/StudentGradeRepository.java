package com.example.tsmstlu.repository;
import com.example.tsmstlu.entity.StudentGradeEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface StudentGradeRepository extends JpaRepository<StudentGradeEntity, Long> {
    // Tìm điểm của sinh viên trong 1 lớp cụ thể
    Optional<StudentGradeEntity> findByStudent_StudentCodeAndClassSection_Id(String studentCode, Long classSectionId);

    // Lấy bảng điểm của 1 sinh viên
    List<StudentGradeEntity> findByStudent_StudentCode(String studentCode);
}