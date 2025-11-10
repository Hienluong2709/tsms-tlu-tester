import axiosInstance from './axiosInstance';

export const getAllSubjects = async () => {
  try {
    const response = await axiosInstance.get('/admin/subjects');
    return response.data;
  } catch (error) {
    console.error('Lỗi khi lấy danh sách môn học:', error);
    throw error;
  }
};

export const getSubjectById = async (id) => {
  try {
    const response = await axiosInstance.get(`/admin/subjects/${id}`);
    return response.data; 
  } catch (error) {
    console.error('Lỗi khi lấy môn học theo ID:', error);
    throw error;
  }
};


export const createSubject = (data) => {
  return axiosInstance.post('/admin/subjects', data);
};

export const deleteSubject = (id) => {
  return axiosInstance.delete(`/admin/subjects/${id}`);
};

export const updateSubject = (id, data) => {
  return axiosInstance.put(`/admin/subjects/${id}`, data);
};
