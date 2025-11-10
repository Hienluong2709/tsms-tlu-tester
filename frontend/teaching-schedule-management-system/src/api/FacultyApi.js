import axiosInstance from "./axiosInstance";
import DepartmentApi from "./DepartmentApi";
import { getAllTeachers, getTeacherById } from "./TeacherApi";

const norm = (v) => (v ?? "").toString().trim().toLowerCase();

/* CRUD */
export const getAllFaculties = async () =>
  (await axiosInstance.get("/admin/faculties")).data;
export const getFacultyById = async (id) =>
  (await axiosInstance.get(`/admin/faculties/${id}`)).data;
export const createFaculty = (data) => axiosInstance.post("/admin/faculties", data);
export const updateFaculty = (id, data) => axiosInstance.put(`/admin/faculties/${id}`, data);
export const deleteFaculty = (id) => axiosInstance.delete(`/admin/faculties/${id}`);

/* ---- Helpers: đảm bảo teacher có faculty.name ---- */
const getAllTeachersExpanded = async () => {
  const list = (await getAllTeachers().catch(() => [])) || [];
  const missing = list.filter((t) => !t?.faculty?.name);
  if (!missing.length) return list;

  // gọi chi tiết cho những thằng thiếu faculty
  const detailMap = new Map(
    (await Promise.all(missing.map((t) => getTeacherById(t.id).catch(() => null))))
      .filter(Boolean)
      .map((full) => [full.id, full])
  );

  return list.map((t) => (t?.faculty?.name ? t : (detailMap.get(t.id) || t)));
};

/* ---- Gom nhóm theo tên khoa ---- */
const buildFacultyNameAggregates = async () => {
  const [teachers, departments] = await Promise.all([
    getAllTeachersExpanded(),
    DepartmentApi.department.getAll().catch(() => []),
  ]);

  const teacherMap = new Map();
  for (const t of teachers) {
    const k = norm(t?.faculty?.name);
    if (!k) continue;
    teacherMap.set(k, (teacherMap.get(k) || 0) + 1);
  }

  const deptMap = new Map();
  for (const d of departments || []) {
    const k = norm(d?.faculty?.name);
    if (!k) continue;
    deptMap.set(k, (deptMap.get(k) || 0) + 1);
  }

  return { teacherMap, deptMap, teachers, departments: departments || [] };
};

export const getFacultiesWithCountsByName = async () => {
  const faculties = await getAllFaculties();
  const { teacherMap, deptMap } = await buildFacultyNameAggregates();
  return (faculties || []).map((f) => {
    const k = norm(f?.name);
    return {
      ...f,
      teacherCount: teacherMap.get(k) || 0,
      departmentCount: deptMap.get(k) || 0,
    };
  });
};

export const getTeachersByFacultyName = async (facultyName) => {
  const { teachers } = await buildFacultyNameAggregates();
  const k = norm(facultyName);
  return teachers.filter((t) => norm(t?.faculty?.name) === k);
};

export const getDepartmentsByFacultyName = async (facultyName) => {
  const { departments } = await buildFacultyNameAggregates();
  const k = norm(facultyName);
  return departments.filter((d) => norm(d?.faculty?.name) === k);
};

export default {
  getAllFaculties,
  getFacultyById,
  createFaculty,
  updateFaculty,
  deleteFaculty,
  getFacultiesWithCountsByName,
  getTeachersByFacultyName,
  getDepartmentsByFacultyName,
};
