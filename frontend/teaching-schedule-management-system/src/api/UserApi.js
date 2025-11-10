import axiosInstance from "./axiosInstance";

/* API hỗ trợ lấy id → teacherId */
export default {
  /* /admin/users/search?username=... → [{id,username,name}] */
  async getUserByUsername(username) {
    const { data } = await axiosInstance.get("/admin/users/search", {
      params: { username }
    });
    return Array.isArray(data) ? data[0] : data;      // trả về 1 object
  },

  /* /admin/teachers?userId=... → [{id,...}] */
  async getTeachersByUserId(userId) {
    const { data } = await axiosInstance.get("/admin/teachers", {
      params: { userId }
    });
    return data;                                     // mảng teacher
  }
};
