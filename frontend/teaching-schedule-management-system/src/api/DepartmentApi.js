import axiosInstance from "./axiosInstance";
import { getAllTeachers } from "./TeacherApi";
import { getAllSubjects, getSubjectById } from "./SubjectApi";

// ---------- helpers ----------
const toArray = (d) => (Array.isArray(d) ? d : d?.content || []);
const norm = (v) => (v ?? "").toString().trim().toLowerCase();
const sameDeptTeacher = (t, dep) => {
  const d = t?.department || {};
  return (
    (d.id && dep?.id && String(d.id) === String(dep.id)) ||
    (d.code && dep?.code && norm(d.code) === norm(dep.code)) ||
    (d.name && dep?.name && norm(d.name) === norm(dep.name))
  );
};

// ---------- Subject index (build từ getAllSubjects + getSubjectById) ----------
let subjectIndexCache = null;      // { byDepName: Map<string, Subject[]>, all: Subject[] }
let subjectIndexAt = 0;            // timestamp ms
const subjectDetailCache = new Map(); // id -> detail

const expandOne = async (s) => {
  if (s?.department?.name) return s;
  if (subjectDetailCache.has(s.id)) return { ...s, ...subjectDetailCache.get(s.id) };
  try {
    const detail = await getSubjectById(s.id);
    subjectDetailCache.set(s.id, detail);
    return { ...s, ...detail };
  } catch {
    return s;
  }
};

// Build index 1 lần rồi cache ~60s
const buildSubjectIndex = async () => {
  const now = Date.now();
  if (subjectIndexCache && now - subjectIndexAt < 60_000) return subjectIndexCache;

  const raw = await getAllSubjects().catch(() => []);
  const list = toArray(raw);

  // Batching để hạn chế concurrent calls
  const expanded = [];
  const BATCH = 8;
  for (let i = 0; i < list.length; i += BATCH) {
    const part = list.slice(i, i + BATCH);
    const out = await Promise.all(part.map(expandOne));
    expanded.push(...out);
  }

  // Nhóm theo department.name (fallback này là theo yêu cầu của bạn)
  const byDepName = new Map(); // key = lowercased dep name
  for (const s of expanded) {
    const name = s?.department?.name || s?.departmentName;
    if (!name) continue;
    const key = norm(name);
    if (!byDepName.has(key)) byDepName.set(key, []);
    byDepName.get(key).push(s);
  }

  subjectIndexCache = { byDepName, all: expanded };
  subjectIndexAt = now;
  return subjectIndexCache;
};

// ---------- Department API ----------
export const departmentApi = {
  // CRUD
  getAll: async () => (await axiosInstance.get("/admin/departments")).data,
  getById: async (id) => (await axiosInstance.get(`/admin/departments/${id}`)).data,
  create: async (data) => (await axiosInstance.post("/admin/departments", data)).data,
  update: async (id, data) => (await axiosInstance.put(`/admin/departments/${id}`, data)).data,
  delete: async (id) => (await axiosInstance.delete(`/admin/departments/${id}`)).data,

  getFaculties: async () => (await axiosInstance.get("/admin/faculties")).data,

  // Giảng viên theo bộ môn (ưu tiên data có sẵn)
  getTeachersByDepartment: async (dep) => {
    const depId = typeof dep === "object" ? dep.id : dep;
    try {
      const res = await axiosInstance.get(`/admin/departments/${depId}/teachers`);
      const data = res.data;
      return toArray(data);
    } catch {
      const tRaw = await getAllTeachers().catch(() => []);
      const all = toArray(tRaw);
      const depObj = typeof dep === "object" ? dep : { id: depId };
      return all.filter((t) => sameDeptTeacher(t, depObj));
    }
  },

  /**
   * Môn theo bộ môn (dựa trên getSubjectById + nhóm theo department.name)
   * -> Không dùng /subjects/count, không phụ thuộc /departments/{id}/subjects (vì đang trả sai).
   */
  getSubjectsByDepartment: async (dep) => {
    const depName = norm(typeof dep === "object" ? dep.name : dep);
    if (!depName) return [];
    const idx = await buildSubjectIndex();
    return idx.byDepName.get(depName) || [];
  },

  // Đếm số lượng (không gọi /count để né 403)
  getTeacherCount: async (dep) => (await departmentApi.getTeachersByDepartment(dep)).length,
  getSubjectCount: async (dep) => (await departmentApi.getSubjectsByDepartment(dep)).length,

  /**
   * Tổng hợp nhanh cho toàn bộ bộ môn:
   * - teacherCount: lọc từ danh sách GV
   * - subjectCount: tra index theo tên bộ môn
   */
  getAggregatedCounts: async (departments) => {
    const [tRaw, idx] = await Promise.all([
      getAllTeachers().catch(() => []),
      buildSubjectIndex(),
    ]);
    const teachers = toArray(tRaw);

    const teacherCountMap = new Map(); // dep.id -> count
    for (const dep of departments) {
      const tCount = teachers.filter((t) => sameDeptTeacher(t, dep)).length;
      teacherCountMap.set(dep.id, tCount);
    }

    const subjectCountMap = new Map(); // dep.id -> count (theo tên)
    for (const dep of departments) {
      const key = norm(dep.name);
      subjectCountMap.set(dep.id, (idx.byDepName.get(key) || []).length);
    }

    return { teacherCountMap, subjectCountMap };
  },
};

export default { department: departmentApi };
