import axiosInstance from './axiosInstance';

export const getAllSemesters = async () => {
  try {
    const response = await axiosInstance.get('/admin/semesters');
    return response.data;
  } catch (error) {
    console.error('Lỗi khi lấy danh sách học kỳ:', error);
    throw error;
  }
};

export const getSemesterById = async (id) => {
  try {
    const response = await axiosInstance.get(`/admin/semesters/${id}`);
    return response.data;
  } catch (error) {
    console.error('Lỗi khi lấy học kỳ theo ID:', error);
    throw error;
  }
};


export const createSemester = (data) => {
  return axiosInstance.post('/admin/semesters', data);
  
};

export const deleteSemester = (id) => {
  return axiosInstance.delete(`/admin/semesters/${id}`);
};

export const updateSemester = (id, data) => {
  return axiosInstance.put(`/admin/semesters/${id}`, data);
};
