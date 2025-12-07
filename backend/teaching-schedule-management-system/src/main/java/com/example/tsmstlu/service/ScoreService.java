package com.example.tsmstlu.service;

import com.example.tsmstlu.dto.score.ConductInputDto;
import com.example.tsmstlu.dto.score.GradeInputDto;
import com.example.tsmstlu.dto.score.GradeResponseDto;
import com.example.tsmstlu.entity.*;
import com.example.tsmstlu.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ScoreService {

    private final StudentGradeRepository gradeRepository;
    private final StudentRepository studentRepository;
    private final ClassSectionRepository classSectionRepository;
    private final ConductPointRepository conductRepository;
    private final SemesterRepository semesterRepository;
    private final ScholarshipRepository scholarshipRepository;
    private final StudentScholarshipRepository studentScholarshipRepository;
    private final AcademicSummaryRepository academicSummaryRepository;

    // 1. CHỨC NĂNG: ADMIN NHẬP ĐIỂM
    @Transactional
    public GradeResponseDto inputGrade(GradeInputDto dto) {
        // Tìm sinh viên
        StudentEntity student = studentRepository.findByStudentCode(dto.getStudentCode())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy sinh viên: " + dto.getStudentCode()));
        
        // Tìm lớp học phần
        ClassSectionEntity classSection = classSectionRepository.findById(dto.getClassSectionId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy lớp học phần"));

        // Tìm hoặc tạo mới bảng điểm
        StudentGradeEntity grade = gradeRepository
                .findByStudent_StudentCodeAndClassSection_Id(dto.getStudentCode(), dto.getClassSectionId())
                .orElse(new StudentGradeEntity());

        // Cập nhật thông tin
        grade.setStudent(student);
        grade.setClassSection(classSection);
        grade.setAttendanceScore(dto.getAttendanceScore());
        grade.setMidtermScore(dto.getMidtermScore());
        grade.setFinalScore(dto.getFinalScore());

        // Tính điểm tổng kết (hệ 10)
        // Công thức: 10% CC + 40% GK + 50% CK
        double cc = dto.getAttendanceScore().doubleValue();
        double gk = dto.getMidtermScore().doubleValue();
        double ck = dto.getFinalScore().doubleValue();
        
        double total10 = (cc * 0.1) + (gk * 0.4) + (ck * 0.5);
        grade.setTotalScore10(BigDecimal.valueOf(total10).setScale(2, RoundingMode.HALF_UP));

        // Quy đổi điểm chữ và hệ 4
        convertScore(grade, total10);

        // Lưu xuống DB
        StudentGradeEntity savedGrade = gradeRepository.save(grade);

        // Chuyển đổi sang DTO để trả về
        GradeResponseDto response = new GradeResponseDto();
        response.setId(savedGrade.getId());
        response.setStudentCode(student.getStudentCode());
        
        // Lấy tên từ đối tượng student đã tìm thấy ở trên (đảm bảo không null)
        response.setStudentName(student.getFullName());
        // Lấy tên lớp từ đối tượng classSection đã tìm thấy ở trên
        response.setClassName(classSection.getName());
        
        response.setAttendanceScore(savedGrade.getAttendanceScore());
        response.setMidtermScore(savedGrade.getMidtermScore());
        response.setFinalScore(savedGrade.getFinalScore());
        response.setTotalScore10(savedGrade.getTotalScore10());
        response.setTotalScore4(savedGrade.getTotalScore4());
        response.setLetterGrade(savedGrade.getLetterGrade());
        response.setIsPassed(savedGrade.getIsPassed());

        return response;
    }

    // 2. CHỨC NĂNG: SINH VIÊN CHẤM ĐIỂM RÈN LUYỆN
    @Transactional
    public com.example.tsmstlu.dto.score.ConductResponseDto submitConductScore(String studentCode, ConductInputDto dto) {
        // Validate dữ liệu đầu vào
        if (dto.getCriteria1() == null || dto.getCriteria2() == null || 
            dto.getCriteria3() == null || dto.getCriteria4() == null || dto.getCriteria5() == null) {
            throw new RuntimeException("Vui lòng nhập đầy đủ điểm cho cả 5 tiêu chí");
        }

        validateCriteriaScore(dto.getCriteria1(), 20, "Mục 1");
        validateCriteriaScore(dto.getCriteria2(), 25, "Mục 2");
        validateCriteriaScore(dto.getCriteria3(), 20, "Mục 3");
        validateCriteriaScore(dto.getCriteria4(), 25, "Mục 4");
        validateCriteriaScore(dto.getCriteria5(), 10, "Mục 5");

        StudentEntity student = studentRepository.findByStudentCode(studentCode)
                .orElseThrow(() -> new RuntimeException("Sinh viên không tồn tại"));
        
        SemesterEntity semester = semesterRepository.findById(dto.getSemesterId())
                .orElseThrow(() -> new RuntimeException("Học kỳ không tồn tại"));

        ConductPointEntity conduct = conductRepository
                .findByStudent_StudentCodeAndSemester_Id(studentCode, dto.getSemesterId())
                .orElse(new ConductPointEntity());

        conduct.setStudent(student);
        conduct.setSemester(semester);

        conduct.setCriteria1(dto.getCriteria1());
        conduct.setCriteria2(dto.getCriteria2());
        conduct.setCriteria3(dto.getCriteria3());
        conduct.setCriteria4(dto.getCriteria4());
        conduct.setCriteria5(dto.getCriteria5());

        int totalScore = dto.getCriteria1() + dto.getCriteria2() + dto.getCriteria3() 
                       + dto.getCriteria4() + dto.getCriteria5();
        conduct.setScore(totalScore);
        conduct.setRankConduct(calculateRank(totalScore));
        conduct.setStatus("PENDING"); 
        
        ConductPointEntity savedConduct = conductRepository.save(conduct);

        com.example.tsmstlu.dto.score.ConductResponseDto response = new com.example.tsmstlu.dto.score.ConductResponseDto();
        response.setId(savedConduct.getId());
        response.setStudentCode(student.getStudentCode());
        if (student.getFullName() != null) response.setStudentName(student.getFullName());
        if (semester.getName() != null) response.setSemesterName(semester.getName());
        response.setScore(savedConduct.getScore());
        response.setRankConduct(savedConduct.getRankConduct());
        response.setStatus(savedConduct.getStatus());
        return response;
    }

    // 3. CHỨC NĂNG: ADMIN XÉT HỌC BỔNG
    @Transactional
    public List<com.example.tsmstlu.dto.score.StudentScholarshipResponseDto> evaluateScholarship(Long scholarshipId) {
        ScholarshipEntity scholarship = scholarshipRepository.findById(scholarshipId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đợt học bổng"));

        Long semesterId = scholarship.getSemester().getId();
        List<StudentEntity> allStudents = studentRepository.findAll();

        // Bước 3.1: Tính toán/Cập nhật GPA
        for (StudentEntity student : allStudents) {
            calculateSemesterGPA(student, semesterId);
        }

        // Bước 3.2: Lọc danh sách trúng tuyển
        List<com.example.tsmstlu.dto.score.StudentScholarshipResponseDto> results = new java.util.ArrayList<>();

        for (StudentEntity student : allStudents) {
            AcademicSummaryEntity summary = academicSummaryRepository
                    .findByStudent_StudentCodeAndSemester_Id(student.getStudentCode(), semesterId)
                    .orElse(null);
            
            ConductPointEntity conduct = conductRepository
                    .findByStudent_StudentCodeAndSemester_Id(student.getStudentCode(), semesterId)
                    .orElse(null);

            if (summary != null && conduct != null) {
                boolean isGpaOk = summary.getGpaSemester().compareTo(scholarship.getMinGpa()) >= 0;
                boolean isConductOk = conduct.getScore() >= scholarship.getMinConductScore();

                if (isGpaOk && isConductOk) {
                    StudentScholarshipEntity award = studentScholarshipRepository
                            .findByStudent_StudentCode(student.getStudentCode()).stream()
                            .filter(s -> s.getScholarship().getId().equals(scholarshipId))
                            .findFirst()
                            .orElse(new StudentScholarshipEntity());

                    if (award.getId() == null) {
                        award.setStudent(student);
                        award.setScholarship(scholarship);
                        award.setAmount(scholarship.getBudget().divide(BigDecimal.valueOf(100))); 
                        award.setStatus("AWARDED");
                        award.setNote("Đủ điều kiện: GPA " + summary.getGpaSemester() + " & ĐRL " + conduct.getScore());
                        studentScholarshipRepository.save(award);
                    }
                    
                    com.example.tsmstlu.dto.score.StudentScholarshipResponseDto dto = new com.example.tsmstlu.dto.score.StudentScholarshipResponseDto();
                    dto.setStudentCode(student.getStudentCode());
                    if (student.getFullName() != null) dto.setStudentName(student.getFullName());
                    dto.setScholarshipName(scholarship.getName());
                    dto.setAmount(award.getAmount());
                    dto.setStatus(award.getStatus());
                    dto.setNote(award.getNote());
                    
                    results.add(dto);
                }
            }
        }
        return results;
    }

    // 4. CHỨC NĂNG PHỤ: LẤY DANH SÁCH HỌC KỲ CHO SINH VIÊN
    public List<com.example.tsmstlu.dto.semester.SemesterDto> getAllSemestersForStudent() {
        List<SemesterEntity> entities = semesterRepository.findAll();
        
        List<com.example.tsmstlu.dto.semester.SemesterDto> dtos = new java.util.ArrayList<>();
        for (SemesterEntity entity : entities) {
            com.example.tsmstlu.dto.semester.SemesterDto dto = new com.example.tsmstlu.dto.semester.SemesterDto();
            dto.setId(entity.getId());
            dto.setName(entity.getName());
            dtos.add(dto);
        }
        return dtos;
    }

    // 5. CHỨC NĂNG PHỤ: LẤY DANH SÁCH LỚP HỌC PHẦN (CHO ADMIN DROPDOWN)
    public List<com.example.tsmstlu.dto.class_section.ClassSectionResponseDto> getAllClassSectionsForDropdown() {
        List<ClassSectionEntity> entities = classSectionRepository.findAll();
        
        // Convert sang DTO đơn giản (chỉ cần ID và Name)
        List<com.example.tsmstlu.dto.class_section.ClassSectionResponseDto> dtos = new java.util.ArrayList<>();
        for (ClassSectionEntity entity : entities) {
            com.example.tsmstlu.dto.class_section.ClassSectionResponseDto dto = new com.example.tsmstlu.dto.class_section.ClassSectionResponseDto();
            dto.setId(entity.getId());
            dto.setName(entity.getName()); // Tên lớp (VD: Lập trình Java 01)
            // dto.setSubjectName(entity.getSubject().getName()); // Nếu muốn hiện thêm tên môn
            dtos.add(dto);
        }
        return dtos;
    }
    
    // --- HELPER METHODS ---

    private void convertScore(StudentGradeEntity grade, double score10) {
        grade.setIsPassed(score10 >= 4.0);
        if (score10 >= 8.5) { grade.setLetterGrade("A"); grade.setTotalScore4(BigDecimal.valueOf(4.0)); }
        else if (score10 >= 8.0) { grade.setLetterGrade("B+"); grade.setTotalScore4(BigDecimal.valueOf(3.5)); }
        else if (score10 >= 7.0) { grade.setLetterGrade("B"); grade.setTotalScore4(BigDecimal.valueOf(3.0)); }
        else if (score10 >= 6.5) { grade.setLetterGrade("C+"); grade.setTotalScore4(BigDecimal.valueOf(2.5)); }
        else if (score10 >= 5.5) { grade.setLetterGrade("C"); grade.setTotalScore4(BigDecimal.valueOf(2.0)); }
        else if (score10 >= 5.0) { grade.setLetterGrade("D+"); grade.setTotalScore4(BigDecimal.valueOf(1.5)); }
        else if (score10 >= 4.0) { grade.setLetterGrade("D"); grade.setTotalScore4(BigDecimal.valueOf(1.0)); }
        else { grade.setLetterGrade("F"); grade.setTotalScore4(BigDecimal.valueOf(0.0)); }
    }

    private void calculateSemesterGPA(StudentEntity student, Long semesterId) {
        AcademicSummaryEntity summary = academicSummaryRepository
                .findByStudent_StudentCodeAndSemester_Id(student.getStudentCode(), semesterId)
                .orElse(new AcademicSummaryEntity());
        
        summary.setStudent(student);
        summary.setSemester(semesterRepository.findById(semesterId).orElse(null));
        
        // Dummy logic
        if (summary.getGpaSemester() == null) {
             summary.setGpaSemester(BigDecimal.valueOf(3.6));
             summary.setAcademicRank("Xuất sắc");
        }
        academicSummaryRepository.save(summary);
    }

    private void validateCriteriaScore(Integer score, int max, String label) {
        if (score < 0 || score > max) {
            throw new RuntimeException(label + " phải nằm trong khoảng 0 đến " + max);
        }
    }

    private String calculateRank(int totalScore) {
        if (totalScore >= 90) return "Xuất sắc";
        if (totalScore >= 80) return "Tốt";
        if (totalScore >= 65) return "Khá";
        if (totalScore >= 50) return "Trung bình";
        return "Yếu";
    }
}