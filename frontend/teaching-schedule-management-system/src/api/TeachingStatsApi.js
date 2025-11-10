// src/api/TeachingStatsApi.js
import axiosInstance from "./axiosInstance";

const TeachingStatsApi = {
  getMyStats: async () => {
    try {
      const response = await axiosInstance.get("/teacher/stats/me");
      return response.data;
    } catch (error) {
      console.error("Lỗi khi lấy thống kê giờ dạy:", error);
      throw error;
    }
  },
};

export default TeachingStatsApi;
