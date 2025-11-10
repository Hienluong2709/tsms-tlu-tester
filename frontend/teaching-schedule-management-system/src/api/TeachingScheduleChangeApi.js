// src/api/TeachingScheduleChangeApi.js
import axiosInstance from "./axiosInstance";

// Lấy danh sách đăng ký nghỉ dạy & dạy bù của giảng viên
export const getScheduleChanges = async () => {
  try {
    const response = await axiosInstance.get("/teacher/schedule-change-list");
    return response.data;
  } catch (error) {
    console.error("Lỗi API getScheduleChanges:", error);
    throw error;
  }
};
