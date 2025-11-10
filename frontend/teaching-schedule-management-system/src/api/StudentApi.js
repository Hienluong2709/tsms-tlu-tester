import axiosInstance from './axiosInstance';

// Lấy tất cả sinh viên
export const getAllStudents = async () => {
  try {
    const response = await axiosInstance.get('/admin/students');
    return response.data;
  } catch (error) {
    console.error('❌ Lỗi khi lấy danh sách sinh viên:', error);
    throw error;
  }
};

// Lấy sinh viên theo ID (dùng userId hoặc studentId từ API)
export const getStudentById = async (studentId) => {
  if (!studentId) {
    console.error("❌ getStudentById: thiếu studentId");
    return null;
  }
  try {
    const response = await axiosInstance.get(`/admin/students/${studentId}`);
    return response.data;
  } catch (error) {
    console.error(`❌ Lỗi khi lấy sinh viên theo ID (${studentId}):`, error);
    throw error;
  }
};

// Thêm mới sinh viên
export const createStudent = async (data) => {
  try {
    const response = await axiosInstance.post('/admin/students', data);
    return response.data;
  } catch (error) {
    console.error("❌ Lỗi khi thêm sinh viên:", error);
    throw error;
  }
};

// Xóa sinh viên
export const deleteStudent = async (studentId) => {
  if (!studentId) {
    console.error("❌ deleteStudent: thiếu studentId");
    return null;
  }
  try {
    const response = await axiosInstance.delete(`/admin/students/${studentId}`);
    return response.data;
  } catch (error) {
    console.error(`❌ Lỗi khi xóa sinh viên (${studentId}):`, error);
    throw error;
  }
};

// Cập nhật thông tin sinh viên
export const updateStudent = async (studentId, data) => {
  if (!studentId) {
    console.error("❌ updateStudent: thiếu studentId");
    return null;
  }
  try {
    const response = await axiosInstance.put(`/admin/students/${studentId}`, data);
    return response.data;
  } catch (error) {
    console.error(`❌ Lỗi khi cập nhật sinh viên (${studentId}):`, error);
    throw error;
  }
};
