// src/api/StudentClassSectionApi.js
import axiosInstance from "./axiosInstance";

/** BASE đã có prefix /api trong axiosInstance */
const BASE = process.env.REACT_APP_SCS_BASE || "/admin/student-class-sections";

/* -------------------- Utils -------------------- */
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

/* Chuẩn hoá 1 row sinh viên từ nhiều dạng trả về */
export const normalizeSectionStudent = (raw) => {
  const st = raw?.student || {};
  return {
    studentId: raw?.studentId ?? st?.id ?? raw?.id,
    code:
      raw?.studentCode ??
      st?.studentCode ??
      st?.code ??
      raw?.code ??
      "",
    fullName: raw?.fullName ?? st?.fullName ?? "",
    className:
      raw?.className ??
      st?.className ??
      st?.classGroup ??
      st?.classCode ??
      "",
  };
};

/* -------------------- Paging (nếu vẫn cần ở nơi khác) -------------------- */
export const fetchPage = async ({
  page = 0,
  size = 10,
  search = "",
  sort = "createdAt,desc",
  studentId,
  classSectionId,
} = {}) => {
  const params = sanitizeParams({
    page,
    size,
    search,
    sort,
    studentId,
    classSectionId,
  });
  const { data } = await axiosInstance.get(BASE, { params });
  return data;
};

export const getById = async (id) =>
  (await axiosInstance.get(`${BASE}/${id}`)).data;

/* -------------------- APIs theo yêu cầu mới -------------------- */
/** GET /admin/student-class-sections/{sectionId}/students */
export const listStudentsInSection = async (sectionId) => {
  const { data } = await axiosInstance.get(`${BASE}/${sectionId}/students`);
  const list = Array.isArray(data) ? data : data?.content || [];
  return list.map(normalizeSectionStudent);
};

/** POST /admin/student-class-sections/{sectionId}/students/{studentId} */
export const addStudentToSection = async (sectionId, studentId) => {
  const { data } = await axiosInstance.post(
    `${BASE}/${sectionId}/students/${studentId}`
  );
  return data;
};

/** DELETE /admin/student-class-sections/{sectionId}/students/{studentId} */
export const removeStudentFromSection = async (sectionId, studentId) => {
  const { data } = await axiosInstance.delete(
    `${BASE}/${sectionId}/students/${studentId}`
  );
  return data;
};

const StudentClassSectionApi = {
  fetchPage,
  getById,
  listStudentsInSection,
  addStudentToSection,
  removeStudentFromSection,
};

export default StudentClassSectionApi;
