import axiosInstance from './axiosInstance';

export const getAllStatistic = async () => {
  try {
    const response = await axiosInstance.get('/admin/stats/all');
    return response.data;
  } catch (error) {
    console.error('Lỗi khi lấy danh sách thống kê:', error);
    throw error;
  }
};


