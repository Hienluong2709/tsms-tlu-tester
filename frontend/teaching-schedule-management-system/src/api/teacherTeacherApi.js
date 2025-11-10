// src/api/TeacherScheduleApi.js
import axios from "./axiosInstance";

async function tryGet(url, config = {}) {
  try {
    const res = await axios.get(url, config);
    if (res?.status === 200) return res.data;
  } catch (_) {}
  return null;
}

const TeacherScheduleApi = {
  // Cũ: theo teacherId (giữ lại để dùng khi có id)
  async getAllByTeacherId(teacherId) {
    // thử vài format thường gặp
    return (
      await tryGet(`/teacher-schedules/teacher/${teacherId}`) ||
      await tryGet(`/schedules/teacher/${teacherId}`) ||
      await tryGet(`/class-schedules/teacher/${teacherId}`) ||
      []
    );
  },

  // Mới: lấy theo "tôi" (me)
  async getMine() {
    return (
      await tryGet(`/teacher-schedules/me`) ||
      await tryGet(`/schedules/me`) ||
      await tryGet(`/class-schedules/me`) ||
      []
    );
  },

  // Mới: lấy theo username (khi chỉ có JWT sub hoặc user.username)
  async getAllByUsername(username) {
    // thử path param, query param, và vài biến thể tên param
    return (
      await tryGet(`/teacher-schedules/username/${encodeURIComponent(username)}`) ||
      await tryGet(`/schedules/username/${encodeURIComponent(username)}`) ||
      await tryGet(`/class-schedules/username/${encodeURIComponent(username)}`) ||
      await tryGet(`/teacher-schedules`, { params: { username } }) ||
      await tryGet(`/teacher-schedules`, { params: { teacherUsername: username } }) ||
      await tryGet(`/schedules`, { params: { username } }) ||
      await tryGet(`/class-schedules`, { params: { username } }) ||
      []
    );
  },
};

export default TeacherScheduleApi;
