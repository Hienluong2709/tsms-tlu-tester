import axiosInstance from './axiosInstance';

export const getAllMajors = async () => {
  try {
    const response = await axiosInstance.get('/admin/majors');
    return response.data;
  } catch (error) {
    console.error('Lỗi khi lấy danh sách chuyên ngành:', error);
    throw error;
  }
};

export const getMajorById = async (id) => {
  try {
    const response = await axiosInstance.get(`/admin/majors/${id}`);
    return response.data; 
  } catch (error) {
    console.error('Lỗi khi lấy chuyên ngành theo ID:', error);
    throw error;
  }
};


export const createMajor = (data) => {
  return axiosInstance.post('/admin/majors', data);
};

export const deleteMajor = (id) => {
  return axiosInstance.delete(`/admin/majors/${id}`);
};

export const updateMajor = (id, data) => {
  return axiosInstance.put(`/admin/majors/${id}`, data);
};
