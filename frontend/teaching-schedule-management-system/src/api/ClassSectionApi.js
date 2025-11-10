import axiosInstance from "./axiosInstance";

// --- helpers ---
const toList = (x) => (Array.isArray(x) ? x : x?.content ?? []);
const pickId = (x) => (x && (x.id ?? x)) || "";

// ===== CRUD: Class Sections (ADMIN) =====
export const getAll = async () =>
  toList((await axiosInstance.get("/admin/class-sections")).data);

export const getById = async (id) =>
  (await axiosInstance.get(`/admin/class-sections/${id}`)).data;

export const create = async (data) =>
  (await axiosInstance.post("/admin/class-sections", data)).data;

export const update = async (id, data) =>
  (await axiosInstance.put(`/admin/class-sections/${id}`, data)).data;

export const remove = async (id) =>
  (await axiosInstance.delete(`/admin/class-sections/${id}`)).data;

// ===== Option endpoints (FULL lists) =====
export const getFaculties = async () =>
  toList((await axiosInstance.get("/admin/faculties")).data);

export const getDepartments = async (params = {}) =>
  toList((await axiosInstance.get("/admin/departments", { params })).data);
// ví dụ: getDepartments({ facultyId })

export const getSubjects = async (params = {}) =>
  toList((await axiosInstance.get("/admin/subjects", { params })).data);
// ví dụ: getSubjects({ departmentId })

export const getTeachers = async (params = {}) =>
  toList((await axiosInstance.get("/admin/teachers", { params })).data);
// ví dụ: getTeachers({ departmentId })

export const getRooms = async () =>
  toList((await axiosInstance.get("/admin/rooms")).data);

export const getSemesters = async () =>
  toList((await axiosInstance.get("/admin/semesters")).data);

// ===== Load tất cả options 1 phát (tiện cho form) =====
export const getAllOptions = async () => {
  const [faculties, departments, subjects, teachers, rooms, semesters] =
    await Promise.all([
      getFaculties(),
      getDepartments(),
      getSubjects(),
      getTeachers(),
      getRooms(),
      getSemesters(),
    ]);
  return { faculties, departments, subjects, teachers, rooms, semesters };
};

// ===== Chuẩn hoá record (thêm *Name và *Id nếu thiếu) =====
export const hydrate = (row) => {
  if (!row) return row;
  const t = row.teacher || {};
  const subj = row.subject || {};
  const dep = row.department || {};
  const fac = row.faculty || {};
  const sem = row.semester || {};
  const room = row.room || {};
  return {
    ...row,
    teacherId: row.teacherId ?? t.id,
    subjectId: row.subjectId ?? subj.id,
    departmentId: row.departmentId ?? dep.id,
    facultyId: row.facultyId ?? fac.id,
    semesterId: row.semesterId ?? sem.id,
    roomId: row.roomId ?? room.id,
    teacherName: t.fullName || t.name || "Chưa xác định",
    subjectName: subj.name || "Chưa xác định",
    departmentName: dep.name || "Chưa xác định",
    facultyName: fac.name || "Chưa xác định",
    semesterName: sem.name || sem.code || sem.academicYear || "Chưa xác định",
    roomName: room.name || room.code || "Chưa xác định",
  };
};

export default {
  // CRUD
  getAll, getById, create, update, delete: remove,
  // options
  getFaculties, getDepartments, getSubjects, getTeachers, getRooms, getSemesters, getAllOptions,
  // helpers
  hydrate, pickId,
};
