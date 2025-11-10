// src/api/TeachingScheduleApi.js
import axiosInstance from "./axiosInstance";

const BASE = "/admin/teaching-schedules";

/* ================= Utils ================= */
const toRow = (o = {}) => ({
  id: o.id,
  lecturerName:
    o.teacher?.fullName ||
    o.classSection?.teacher?.fullName ||
    o.lecturerName ||
    "",
  classCode: o.classSection?.name || o.classCode || "",
  subjectName:
    o.subject?.name ||
    o.classSection?.subject?.name ||
    o.subjectName ||
    "",
  semester:
    o.semester?.academicYear ||
    o.classSection?.semester?.academicYear ||
    o.semesterName ||
    "",
  room: o.room?.name || o.classSection?.room?.name || o.room || "",
  sessions: Array.isArray(o.details) ? o.details.length : (o.sessions ?? 0),
});

const normalizeList = (raw) => {
  if (Array.isArray(raw)) return raw;
  if (raw?.content) return raw.content;
  if (raw?.items) return raw.items;
  return [];
};

const buildPage = (raw, { page = 0, size = 10 } = {}) => {
  if (Array.isArray(raw)) {
    const totalElements = raw.length;
    const totalPages = Math.max(1, Math.ceil(totalElements / size));
    const content = raw.slice(page * size, page * size + size);
    return {
      content: content.map(toRow),
      totalElements,
      totalPages,
      page,
      size,
    };
  }
  const content = (raw?.content ?? raw?.items ?? []).map(toRow);
  const totalElements = raw?.totalElements ?? raw?.total ?? content.length;
  const totalPages =
    raw?.totalPages ?? Math.max(1, Math.ceil(totalElements / (raw?.size ?? size)));
  return {
    content,
    totalElements,
    totalPages,
    page: raw?.number ?? page,
    size: raw?.size ?? size,
  };
};

/* =============== CRUD =============== */
export const getAllTeachingSchedules = async (params = {}) =>
  (await axiosInstance.get(BASE, { params })).data;

export const getTeachingScheduleById = async (id) =>
  (await axiosInstance.get(`${BASE}/${id}`)).data;

export const createTeachingSchedule = async (data) =>
  (await axiosInstance.post(BASE, data)).data;

export const updateTeachingSchedule = async (id, data) =>
  (await axiosInstance.put(`${BASE}/${id}`, data)).data;

export const deleteTeachingSchedule = async (id) =>
  (await axiosInstance.delete(`${BASE}/${id}`)).data;

/* ============== Paging (flexible) ============== */
export const fetchPage = async ({
  page = 0,
  size = 10,
  search = "",
  sort = "id,asc",
  ...rest // cho phép truyền thêm param như date/fromDate/toDate nếu BE support
} = {}) => {
  const raw = await getAllTeachingSchedules({ page, size, search, sort, ...rest });
  // Nếu BE trả về page (có content) -> buildPage sẽ xử lý
  // Nếu trả mảng -> cũng buildPage bình thường
  return buildPage(raw, { page, size });
};

/* ============== Lấy lịch theo ngày ============== */
/** 
 * fetchToday({ date: 'YYYY-MM-DD' })
 * - Nếu BE hỗ trợ param `date`/`fromDate`/`toDate` thì truyền luôn qua rest.
 * - Nếu không, sẽ lấy toàn bộ rồi lọc ở FE (fallback).
 */
export const fetchToday = async ({ date }) => {
  // Thử gọi có param date (nếu BE hỗ trợ sẽ lọc sẵn)
  const raw = await getAllTeachingSchedules({ date }).catch(() => null);

  if (raw) {
    const list = normalizeList(raw);
    // Nếu BE đã lọc sẵn thì trả luôn
    if (list.length > 0) return list.map(toRow);
  }

  // Fallback: gọi không filter rồi tự lọc ở FE theo yyyy-mm-dd xuất hiện trong startTime hoặc ngày
  const all = await getAllTeachingSchedules().catch(() => []);
  const listAll = normalizeList(all);

  const yyyy = String(date).slice(0, 4);
  const mm = String(date).slice(5, 7);
  const dd = String(date).slice(8, 10);

  const sameDay = (item) => {
    const d =
      item.date ||
      item.startDate ||
      item.startTime ||
      item.classDate ||
      item.day;
    if (!d) return false;
    // Chuẩn hoá về yyyy-mm-dd
    const str = String(d);
    // thử parse ISO
    let iso = str;
    if (/^\d{4}-\d{2}-\d{2}/.test(str) === false) {
      const asDate = new Date(str);
      if (!isNaN(asDate)) {
        const m = String(asDate.getMonth() + 1).padStart(2, "0");
        const day = String(asDate.getDate()).padStart(2, "0");
        iso = `${asDate.getFullYear()}-${m}-${day}`;
      }
    }
    return iso.startsWith(`${yyyy}-${mm}-${dd}`);
  };

  return listAll.filter(sameDay).map(toRow);
};

const TeachingScheduleApi = {
  getAllTeachingSchedules,
  getTeachingScheduleById,
  create: createTeachingSchedule,
  update: updateTeachingSchedule,
  delete: deleteTeachingSchedule,
  fetchPage,
  fetchToday,
};

export default TeachingScheduleApi;
