// KHÔNG sửa axiosInstance.js — dùng y như hiện tại
import axiosInstance from "./axiosInstance";

/**
 * Lấy danh sách lịch dạy của giáo viên theo teacherId.
 * Backend trả kiểu: [{ classSection, details: [...] }, ...]
 */
export const getLeaveCandidates = async (teacherId) => {
  try {
    const url = `/teacher/schedules/${teacherId}`;
    const res = await axiosInstance.get(url);
    return Array.isArray(res.data) ? res.data : [];
  } catch (err) {
    console.error("Lỗi getLeaveCandidates:", {
      teacherId,
      status: err?.response?.status,
      statusText: err?.response?.statusText,
      data: err?.response?.data,
    });
    return []; // tránh crash UI
  }
};

/**
 * Gửi đăng ký nghỉ dạy
 * payload = { teachingScheduleDetailId, reason, fileUrl }
 */
export const createLeaveRequest = async (payload) => {
  const res = await axiosInstance.post("/teacher/class-cancel", payload);
  return res.data;
};
