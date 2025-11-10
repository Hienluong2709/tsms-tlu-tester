// src/api/NewRoomApi.js
import axiosInstance from "./axiosInstance";

/**
 * Lấy danh sách phòng học mới
 * GET /api/teacher/new-room
 */
export const getNewRooms = async () => {
  try {
    const res = await axiosInstance.get("/teacher/new-room");
    return res.data; // trả về list phòng học
  } catch (err) {
    console.error("Lỗi lấy danh sách phòng học:", err);
    throw err;
  }
};
