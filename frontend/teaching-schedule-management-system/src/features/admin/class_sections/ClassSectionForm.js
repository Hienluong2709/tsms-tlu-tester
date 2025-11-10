// src/features/admin/classSections/ClassSectionForm.js
import React, { useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";
import ClassSectionApi from "../../../api/ClassSectionApi";
import "../../../styles/ClassSectionForm.css";

const EMPTY = {
  name: "",
  facultyId: "",
  departmentId: "",
  subjectId: "",
  teacherId: "",
  roomId: "",
  semesterId: "",
};

const S = (v) => (v === 0 || v ? String(v) : "");
const norm = (v) => (v ?? "").toString().trim().toLowerCase();

const idByName = (list, wantName, getName = (x) => x?.name) => {
  if (!wantName) return "";
  const n = norm(wantName);
  const hit = (list || []).find((x) => norm(getName(x)) === n);
  return S(hit?.id) || "";
};

export default function ClassSectionForm({
  open = true,
  onClose,
  onSuccess,
  editData = null,
}) {
  const [payload, setPayload] = useState(EMPTY);
  const [saving, setSaving] = useState(false);

  // options (chỉ để render select)
  const [faculties, setFaculties] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [semesters, setSemesters] = useState([]);

  useEffect(() => {
    if (!open) return;
    (async () => {
      try {
        const opts = await ClassSectionApi.getAllOptions();
        setFaculties(opts.faculties || []);
        setDepartments(opts.departments || []);
        setSubjects(opts.subjects || []);
        setTeachers(opts.teachers || []);
        setRooms(opts.rooms || []);
        setSemesters(opts.semesters || []);

        if (!editData) {
          setPayload(EMPTY);
          return;
        }

        const full = editData;

        // Faculty
        const facultyId =
          S(full.facultyId) ||
          S(full.faculty?.id) ||
          idByName(opts.faculties, full?.faculty?.name || full.facultyName);

        // Department (id -> tên -> suy từ subject)
        let departmentId =
          S(full.departmentId) ||
          S(full.department?.id) ||
          idByName(opts.departments, full?.department?.name || full.departmentName);

        if (!departmentId) {
          const wantedSubName = full?.subject?.name || full.subjectName;
          const subHit = (opts.subjects || []).find(
            (s) => norm(s?.name) === norm(wantedSubName)
          );
          const depFromSub =
            S(subHit?.departmentId) ||
            S(subHit?.department?.id) ||
            idByName(opts.departments, subHit?.department?.name);
          if (depFromSub) departmentId = depFromSub;
        }

        // Subject (ưu tiên cùng bộ môn)
        let subjectId =
          S(full.subjectId) ||
          S(full.subject?.id) ||
          idByName(
            departmentId
              ? (opts.subjects || []).filter(
                  (s) =>
                    S(s.departmentId) === departmentId ||
                    S(s?.department?.id) === departmentId
                )
              : opts.subjects || [],
            full?.subject?.name || full.subjectName
          ) ||
          idByName(opts.subjects, full?.subject?.name || full.subjectName);

        // Teacher (ưu tiên theo bộ môn -> khoa)
        const teacherId =
          S(full.teacherId) ||
          S(full.teacher?.id) ||
          idByName(
            (opts.teachers || []).filter((t) => {
              const tDep = S(t?.departmentId ?? t?.department?.id);
              const tFac = S(t?.facultyId ?? t?.faculty?.id);
              if (departmentId && tDep) return tDep === S(departmentId);
              if (facultyId && tFac) return tFac === S(facultyId);
              return true;
            }),
            full?.teacher?.fullName || full.teacherName || full?.teacher?.name,
            (t) => t.fullName || t.name
          ) ||
          idByName(
            opts.teachers,
            full?.teacher?.fullName || full.teacherName || full?.teacher?.name,
            (t) => t.fullName || t.name
          );

        // Room
        const roomId =
          S(full.roomId) ||
          S(full.room?.id) ||
          idByName(
            opts.rooms,
            full?.room?.name || full.roomName || full?.room?.code,
            (r) => r.name || r.code
          );

        // Semester: name / code / academicYear, hoặc unique trong năm
        let semesterId =
          S(full.semesterId) || S(full.semester?.id) || (() => {
            const list = opts.semesters || [];
            const wantName =
              full?.semester?.name ||
              full?.semester?.code ||
              full?.semester?.academicYear ||
              full.semesterName ||
              full.academicYear;
            const nWant = norm(wantName);
            const hit =
              list.find(
                (s) =>
                  norm(s?.name) === nWant ||
                  norm(s?.code) === nWant ||
                  norm(s?.academicYear) === nWant
              ) || null;
            if (hit) return S(hit.id);

            // Nếu chỉ biết academicYear → lấy bản ghi duy nhất trong năm đó
            const nYear = norm(full?.semester?.academicYear || full.academicYear);
            if (nYear) {
              const inYear = list.filter((s) => norm(s?.academicYear) === nYear);
              if (inYear.length === 1) return S(inYear[0]?.id);
            }
            return "";
          })();

        setPayload({
          name: full.name ?? "",
          facultyId,
          departmentId,
          subjectId,
          teacherId,
          roomId,
          semesterId,
        });
      } catch (e) {
        console.error("[CSF] Load/PREFILL lỗi:", e?.response?.data || e);
      }
    })();
  }, [open, editData]);

  // Reset dây chuyền CHỈ khi người dùng đổi select
  const onChange = (k) => (e) => {
    const v = e.target.value;
    setPayload((p) => {
      const next = { ...p, [k]: v };
      if (k === "facultyId") {
        next.departmentId = "";
        next.subjectId = "";
        next.teacherId = "";
      }
      if (k === "departmentId") {
        next.subjectId = "";
        next.teacherId = "";
      }
      return next;
    });
  };

  const requiredOk =
    payload.name?.trim() &&
    payload.facultyId &&
    payload.departmentId &&
    payload.subjectId &&
    payload.teacherId &&
    payload.roomId &&
    payload.semesterId;

  const submit = async (e) => {
    e.preventDefault();
    if (!requiredOk || saving) return;

    const body = {
      name: payload.name.trim(),
      facultyId: Number(payload.facultyId),
      departmentId: Number(payload.departmentId),
      subjectId: Number(payload.subjectId),
      teacherId: Number(payload.teacherId),
      roomId: Number(payload.roomId),
      semesterId: Number(payload.semesterId),
    };

    setSaving(true);
    try {
      const saved = editData
        ? await ClassSectionApi.update(editData.id, body)
        : await ClassSectionApi.create(body);
      onSuccess?.(saved);
      onClose?.();
    } catch (err) {
      console.error("[CSF] Lưu lỗi:", err?.response?.data || err);
      alert("Không thể lưu lớp học phần. Vui lòng thử lại!");
    } finally {
      setSaving(false);
    }
  };

  if (!open) return null;

  return (
    <div className="csf-overlay" onClick={onClose}>
      <div className="csf-modal" onClick={(e) => e.stopPropagation()}>
        <div className="csf-header">
          <h3>{editData ? "CẬP NHẬT LỚP HỌC PHẦN" : "THÊM LỚP HỌC PHẦN MỚI"}</h3>
          <button className="csf-close" onClick={onClose} aria-label="Đóng">
            <FaTimes />
          </button>
        </div>

        <form className="csf-body" onSubmit={submit}>
          <div className="csf-row">
            <div className="csf-field">
              <label>Tên lớp học phần: <span className="csf-required">*</span></label>
              <input
                type="text"
                placeholder="Nhập tên lớp học phần"
                value={payload.name}
                onChange={onChange("name")}
              />
            </div>

            <div className="csf-field">
              <label>Khoa phụ trách: <span className="csf-required">*</span></label>
              <div className="csf-select-wrap">
                <select value={payload.facultyId} onChange={onChange("facultyId")}>
                  <option value="">-- Chọn khoa --</option>
                  {faculties.map((f) => (
                    <option key={f.id} value={f.id}>{f.name}</option>
                  ))}
                </select>
                <span className="csf-caret">▾</span>
              </div>
            </div>
          </div>

          <div className="csf-row">
            <div className="csf-field">
              <label>Bộ môn phụ trách: <span className="csf-required">*</span></label>
              <div className="csf-select-wrap">
                <select value={payload.departmentId} onChange={onChange("departmentId")}>
                  <option value="">-- Chọn bộ môn --</option>
                  {departments.map((d) => (
                    <option key={d.id} value={d.id}>{d.name}</option>
                  ))}
                </select>
                <span className="csf-caret">▾</span>
              </div>
            </div>

            <div className="csf-field">
              <label>Giảng viên phụ trách: <span className="csf-required">*</span></label>
              <div className="csf-select-wrap">
                <select value={payload.teacherId} onChange={onChange("teacherId")}>
                  <option value="">-- Chọn giảng viên --</option>
                  {teachers.map((t) => (
                    <option key={t.id} value={t.id}>{t.fullName || t.name}</option>
                  ))}
                </select>
                <span className="csf-caret">▾</span>
              </div>
            </div>
          </div>

          <div className="csf-row">
            <div className="csf-field">
              <label>Học phần: <span className="csf-required">*</span></label>
              <div className="csf-select-wrap">
                <select value={payload.subjectId} onChange={onChange("subjectId")}>
                  <option value="">-- Chọn học phần --</option>
                  {subjects.map((s) => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
                <span className="csf-caret">▾</span>
              </div>
            </div>

            <div className="csf-field">
              <label>Phòng học: <span className="csf-required">*</span></label>
              <div className="csf-select-wrap">
                <select value={payload.roomId} onChange={onChange("roomId")}>
                  <option value="">-- Chọn phòng học --</option>
                  {rooms.map((r) => (
                    <option key={r.id} value={r.id}>{r.name || r.code}</option>
                  ))}
                </select>
                <span className="csf-caret">▾</span>
              </div>
            </div>
          </div>

          <div className="csf-row">
            <div className="csf-field">
              <label>Học kỳ: <span className="csf-required">*</span></label>
              <div className="csf-select-wrap">
                <select value={payload.semesterId} onChange={onChange("semesterId")}>
                  <option value="">-- Chọn học kỳ --</option>
                  {semesters.map((s) => (
                    <option key={s.id} value={s.id}>{s.name || s.code || s.academicYear}</option>
                  ))}
                </select>
                <span className="csf-caret">▾</span>
              </div>
            </div>
            <div className="csf-field" />
          </div>

          <div className="csf-divider" />

          <div className="csf-actions">
            <button type="submit" className="csf-primary" disabled={!requiredOk || saving}>
              {saving ? "Đang lưu..." : "Xác nhận"}
            </button>
            <button type="button" className="csf-outline" onClick={onClose} disabled={saving}>
              Hủy bỏ
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
