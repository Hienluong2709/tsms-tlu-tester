import axiosInstance from './axiosInstance';

export const getAllRooms = async () => {
  try {
    const response = await axiosInstance.get('/admin/rooms');
    return response.data;
  } catch (error) {
    console.error('Lỗi khi lấy danh sách phòng học:', error);
    throw error;
  }
};

export const getRoomById = async (id) => {
  try {
    const response = await axiosInstance.get(`/admin/rooms/${id}`);
    return response.data;
  } catch (error) {
    console.error('Lỗi khi lấy phòng học theo ID:', error);
    throw error;
  }
};


export const createRoom = (data) => {
  return axiosInstance.post('/admin/rooms', data);

};

export const deleteRoom = (id) => {
  return axiosInstance.delete(`/admin/rooms/${id}`);
};

export const updateRoom = (id, data) => {
  return axiosInstance.put(`/admin/rooms/${id}`, data);
};
