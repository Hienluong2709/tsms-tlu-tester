import axiosInstance from './axiosInstance';

export const getAllTeachers = async () => {
  try {
    const response = await axiosInstance.get('/admin/teachers');
    return response.data;
  } catch (error) {
    console.error('Lỗi khi lấy danh sách giảng viên:', error);
    throw error;
  }
};

export const getTeacherById = async (id) => {
  try {
    const response = await axiosInstance.get(`/admin/teachers/${id}`);
    return response.data; 
  } catch (error) {
    console.error('Lỗi khi lấy giảng viên theo ID:', error);
    throw error;
  }
};


export const createTeacher = (data) => {
  return axiosInstance.post('/admin/teachers', data);
};

export const deleteTeacher = (id) => {
  return axiosInstance.delete(`/admin/teachers/${id}`);
};

export const updateTeacher = (id, data) => {
  return axiosInstance.put(`/admin/teachers/${id}`, data);
};
