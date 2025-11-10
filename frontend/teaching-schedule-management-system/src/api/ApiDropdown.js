import axiosInstance from './axiosInstance';

export const getFaculties = async () => {
  try {
    const response = await axiosInstance.get('/admin/faculties');
    return response.data;
  } catch (error) {
    console.error('Lỗi khi lấy danh sách Khoa:', error);
    throw error;
  }
};


export const getDepartmentsByFaculty = async (facultyId) => {
  try {
    const response = await axiosInstance.get('/admin/departments', {
      params: { facultyId },
    });
    return response.data;
  } catch (error) {
    console.error('Lỗi khi lấy danh sách Bộ môn:', error);
    throw error;
  }
};

export const getAllUsers = async () => {
  try {
    const res = await axiosInstance.get("/admin/users");
    return res.data; 
  } catch (error) {
    console.error("Lỗi khi lấy danh sách users:", error);
    return [];
  }
};


export const getMajors = async () => {
  try {
    const response = await axiosInstance.get('/admin/majors');
    return response.data;
  } catch (error) {
    console.error('Lỗi khi lấy danh sách Chuyên ngành:', error);
    throw error;
  }
};

export const getSemesters = async () => {
  try {
    const response = await axiosInstance.get('/admin/semesters');
    return response.data;
  } catch (error) {
    console.error('Lỗi khi lấy danh sách Học kỳ:', error);
    throw error;
  }
};

