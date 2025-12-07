import axiosClient from "./axiosInstance";

const ScoreApi = {
    // ADMIN: Nhập điểm kết quả học tập
    inputGrade: (data) => {
        const url = '/admin/scores/grade';
        return axiosClient.post(url, data);
    },

    // STUDENT: Chấm điểm rèn luyện
    submitConduct: (studentCode, data) => {
        // Lưu ý: Backend đang dùng @RequestParam cho studentCode
        const url = `/student/scores/conduct-test?studentCode=${studentCode}`;
        return axiosClient.post(url, data);
    },

    // ADMIN: Xét học bổng (Làm sẵn để dùng sau)
    evaluateScholarship: (scholarshipId) => {
        const url = `/admin/scores/scholarship/evaluate/${scholarshipId}`;
        return axiosClient.post(url);
    }, // <--- ĐÃ THÊM DẤU PHẨY Ở ĐÂY

    getAllClassSections: () => {
        return axiosClient.get('/admin/scores/class-sections');
    },

    // STUDENT: Lấy danh sách học kỳ
    getSemesters: () => {
        return axiosClient.get('/student/scores/semesters');
    }
};

export default ScoreApi;