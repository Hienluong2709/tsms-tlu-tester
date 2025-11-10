// src/api/RegisterMakeupApi.js
import axiosInstance from "./axiosInstance";

/**
 * Lấy danh sách lịch giảng của giáo viên theo teacherId.
 * Backend trả dạng: [{ classSection, details: [...] }, ...]
 */
export const getTeachingSchedule = async (teacherId) => {
  const url = `/teacher/schedules/${encodeURIComponent(teacherId)}`; // chỉnh cho khớp backend của bạn
  try {
    const res = await axiosInstance.get(url, {
      headers: { Accept: "application/json" },
      withCredentials: true, // nếu backend dùng cookie
    });
    return Array.isArray(res?.data) ? res.data : [];
  } catch (err) {
    console.group("❌ API ERROR getTeachingSchedule");
    console.error("url:", url);
    console.error("status:", err?.response?.status);
    console.error("data:", err?.response?.data);
    console.groupEnd();
    throw err;
  }
};

/**
 * Gửi đăng ký dạy bù (JSON).
 * payload:
 * {
 *   teachingScheduleDetailId: number,
 *   newPeriodStart: number,
 *   newPeriodEnd: number,
 *   newDate: "YYYY-MM-DD",
 *   newRoomId: number,
 *   lectureContent?: string|null,
 *   reason?: string|null,
 *   fileUrl?: string|null
 * }
 */
export const createMakeupClass = async (payload) => {
  const url = "/teacher/make-up-class"; // CHỈNH đường dẫn này theo đúng Postman của bạn
  try {
    const res = await axiosInstance.post(url, payload, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      withCredentials: true, // nếu có cookie auth
    });
    console.group("✅ API OK createMakeupClass");
    console.log("status:", res?.status);
    console.log("data:", res?.data);
    console.groupEnd();
    // Trả nguyên res (để modal có thể dùng status/data)
    return res;
  } catch (err) {
    console.group("❌ API ERROR createMakeupClass");
    console.error("url:", url);
    console.error("status:", err?.response?.status ?? 0);
    console.error("data:", err?.response?.data);
    console.error("method:", err?.config?.method);
    console.error("headers:", err?.config?.headers);
    console.error("body:", err?.config?.data);
    console.groupEnd();
    throw err;
  }
};

/**
 * (Tuỳ chọn) Lấy danh sách phòng học.
 * Backend trả dạng: [{ id, name }, ...]
 */
export const getRooms = async () => {
  const url = "/rooms"; // chỉnh endpoint theo backend của bạn
  try {
    const res = await axiosInstance.get(url, {
      headers: { Accept: "application/json" },
      withCredentials: true,
    });
    return Array.isArray(res?.data) ? res.data : [];
  } catch (err) {
    console.group("❌ API ERROR getRooms");
    console.error("url:", url);
    console.error("status:", err?.response?.status);
    console.error("data:", err?.response?.data);
    console.groupEnd();
    throw err;
  }
};
