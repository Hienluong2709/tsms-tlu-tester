import axiosInstance from "./axiosInstance";

/**
 * GET /api/teacher/schedules/{teacherId}
 * (params ví dụ: { date: 'YYYY-MM-DD' } nếu BE hỗ trợ)
 */
export async function getByTeacherId(teacherId, params = {}) {
  if (!teacherId) throw new Error("Thiếu teacherId.");
  const { data } = await axiosInstance.get(
    `/teacher/schedules/${teacherId}`,
    { params } // nếu BE không nhận params, bỏ đối số { params } là xong
  );
  return Array.isArray(data) ? data : [];
}

export default { getByTeacherId };
