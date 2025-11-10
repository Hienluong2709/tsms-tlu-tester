// src/api/TeachingHoursApi.js
import axiosInstance from "./axiosInstance";

// Gọi API lấy danh sách lịch dạy của giáo viên
export const getTeachingSchedules = async (teacherId) => {
  try {
    const response = await axiosInstance.get(`/teacher/schedules/${teacherId}`);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách lịch dạy:", error);
    throw error;
  }
};

// Xác nhận chấm công (PUT)
export const confirmTeachingHour = async (scheduleDetailId) => {
  try {
    const response = await axiosInstance.put(
      `/teacher/teaching-schedule-details/${scheduleDetailId}/attendance`,
      {
        status: "DA_DAY", // Đánh dấu đã dạy
      }
    );
    return response.data;
  } catch (error) {
    console.error("Lỗi khi xác nhận giờ dạy:", error);
    throw error;
  }
};
