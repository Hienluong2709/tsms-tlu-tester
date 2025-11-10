// src/api/NotificationApi.js
import axiosInstance from "./axiosInstance";

/** Base có thể override qua REACT_APP_NOTI_BASE */
const BASE = process.env.REACT_APP_NOTI_BASE || "/admin/notifications";

/** Gộp params, trim string, loại null/undefined/"" */
const sanitizeParams = (params = {}) => {
  const out = {};
  Object.entries(params).forEach(([k, v]) => {
    if (v === undefined || v === null) return;
    if (typeof v === "string") {
      const t = v.trim();
      if (t !== "") out[k] = t;
    } else out[k] = v;
  });
  return out;
};

/** GET danh sách (BE có thể trả mảng hoặc Page object) */
export const fetchPage = async ({
  page = 0,
  size = 10,
  search = "",
  sort = "createdAt,desc",
} = {}) => {
  const params = sanitizeParams({ page, size, search, sort });
  const { data } = await axiosInstance.get(BASE, { params });
  return data;
};

export const getById = async (id) =>
  (await axiosInstance.get(`${BASE}/${id}`)).data;

export const remove = async (id) =>
  (await axiosInstance.delete(`${BASE}/${id}`)).data;

/** Tạo mới thủ công (nếu cần) */
export const create = async (payload) =>
  (await axiosInstance.post(BASE, payload)).data;

/**
 * Publish/gửi thông báo:
 * Nếu BE có endpoint /{id}/publish thì dùng; nếu không có
 * bạn có thể chỉnh lại hàm này cho khớp BE của bạn.
 */
export const publish = async (id) =>
  (await axiosInstance.post(`${BASE}/${id}/publish`)).data;

const NotificationApi = {
  fetchPage,
  getById,
  create,
  publish,
  delete: remove,
};

export default NotificationApi;
