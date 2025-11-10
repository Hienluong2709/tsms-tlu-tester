import axiosInstance from './axiosInstance';

export const getScheduleChanges = async (params) => {
  try {
    const res = await axiosInstance.get("/admin/schedule-changes", { params });
    console.log("Dữ liệu trả về từ API:", JSON.stringify(res.data, null, 2));
    return res.data;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách thay đổi lịch:", error);
    throw error;
  }
};

export const getScheduleChangeDetail = async (id, type) => {
  let endpoint = "";
  if (type === "DAY_BU") {
    endpoint = `/admin/schedule-changes/${id}/make-up-class`;
  } else if (type === "HUY_LICH") {
    endpoint = `/admin/schedule-changes/${id}/class-cancel`;
  }
  try {
    const res = await axiosInstance.get(endpoint);
    console.log("Dữ liệu chi tiết trả về:", res.data);
    return res.data;
  } catch (err) {
    console.error("Lỗi khi lấy chi tiết thay đổi lịch:", err);
    throw err;
  }
};



export const approveScheduleChange = async (id) => {
  try {
    const res = await axiosInstance.put(`/admin/schedule-changes/${id}/approve`, {
      status: "DA_DUYET",
    });
    return res.data;
  } catch (error) {
    console.error("Lỗi khi duyệt thay đổi lịch:", error);
    throw error;
  }
};

export const rejectScheduleChange = async (id) => {
  try {
    const res = await axiosInstance.put(`/admin/schedule-changes/${id}/reject`, {
      status: "TU_CHOI",
    });
    return res.data;
  } catch (error) {
    console.error("Lỗi khi từ chối thay đổi lịch:", error);
    throw error;
  }
};

export const createNotification = async (notificationData) => {
  try {
    console.log('Gửi lên server:', notificationData);
    const res = await axiosInstance.post("/admin/notifications", notificationData);
    console.log("Kết quả trả về:", res.data);
    return res.data;
  } catch (error) {
    if (error.response) {
      console.error('Lỗi Backend:', error.response.status, error.response.data);
    } else {
      console.error('Lỗi khác:', error);
    }
    throw error;
  }
};




