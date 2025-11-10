import React, { useEffect, useState } from "react";
import { FaEdit, FaTrash, FaInfoCircle, FaSearch } from "react-icons/fa";
import DepartmentForm from "./DepartmentForm";
import DepartmentDetail from "./DepartmentDetail";
import DeleteConfirmModal from "../../../components/DeleteConfirmModal";
import DepartmentApi from "../../../api/DepartmentApi";
import { getAllTeachers } from "../../../api/TeacherApi";
import "../../../styles/DepartmentList.css";

const norm = (v) => (v ?? "").toString().trim().toLowerCase();
const teacherInDept = (t, dep) => {
  const d = t?.department || {};
  return (
    (d.id && dep?.id && String(d.id) === String(dep.id)) ||
    (d.code && dep?.code && norm(d.code) === norm(dep.code)) ||
    (d.name && dep?.name && norm(d.name) === norm(dep.name))
  );
};

const DepartmentList = () => {
  const [departments, setDepartments] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [showDelete, setShowDelete] = useState(false);
  const [toDelete, setToDelete] = useState(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    loadDepartments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const applyFilter = (list, term) => {
    if (!term?.trim()) return list;
    const t = norm(term);
    return list.filter(
      (d) => norm(d.name).includes(t) || norm(d.faculty?.name).includes(t)
    );
  };

  const loadDepartments = async () => {
    try {
      console.log("%c[DEBUG] DepartmentList LOAD", "color:#22c55e;font-weight:700");
      const deps = await DepartmentApi.department.getAll();
      const tRaw = await getAllTeachers().catch(() => []);
      const teachers = Array.isArray(tRaw) ? tRaw : tRaw?.content || [];

      console.groupCollapsed("%c[DEBUG] RAW LISTS", "color:#0ea5e9;font-weight:700");
      console.log("Departments:", deps.length, deps);
      console.log("Teachers:", teachers.length, teachers.slice(0, 10));
      console.groupEnd();

      // lấy subjects theo từng bộ môn + log rõ ràng
      const subjectsPerDept = await Promise.all(
        deps.map((dep) => DepartmentApi.department.getSubjectsByDepartment(dep))
      );

      const enriched = deps.map((dep, i) => {
        const listTeachers = teachers.filter((t) => teacherInDept(t, dep));
        const listSubjects = subjectsPerDept[i] || [];

        console.groupCollapsed(
          `%c[DEBUG] MATCH → ${dep.name} (#${dep.id})`,
          "color:#a855f7;font-weight:700"
        );
        console.log("teachersOfDept (%d):", listTeachers.length, listTeachers);
        console.log("subjectsOfDept (%d):", listSubjects.length, listSubjects);
        console.groupEnd();

        return {
          ...dep,
          teacherCount: listTeachers.length,
          subjectCount: listSubjects.length,
          __teachers: listTeachers, // giữ tạm để xem chi tiết nhanh (không bắt buộc)
          __subjects: listSubjects,
        };
      });

      setDepartments(enriched);
      setFiltered(applyFilter(enriched, search));
    } catch (err) {
      console.error("Lỗi khi tải dữ liệu bộ môn:", err?.response?.data || err);
    }
  };

  useEffect(() => {
    setFiltered(applyFilter(departments, search));
  }, [search, departments]);

  const handleFormSuccess = async (payload) => {
    try {
      const saved = editing?.id
        ? await DepartmentApi.department.update(editing.id, payload)
        : await DepartmentApi.department.create(payload);

      setShowForm(false);
      setEditing(null);

      // tính lại counts cho record vừa lưu
      const [tRaw, subs] = await Promise.all([
        getAllTeachers().catch(() => []),
        DepartmentApi.department.getSubjectsByDepartment(saved),
      ]);
      const teachers = Array.isArray(tRaw) ? tRaw : tRaw?.content || [];
      const listTeachers = teachers.filter((t) => teacherInDept(t, saved));
      const listSubjects = subs || [];

      console.group(
        `%c[DEBUG] AFTER SAVE → ${saved.name}`,
        "color:#eab308;font-weight:700"
      );
      console.log("teachersOfDept (%d):", listTeachers.length, listTeachers);
      console.log("subjectsOfDept (%d):", listSubjects.length, listSubjects);
      console.groupEnd();

      setDepartments((prev) => {
        const next = [
          {
            ...saved,
            teacherCount: listTeachers.length,
            subjectCount: listSubjects.length,
            __teachers: listTeachers,
            __subjects: listSubjects,
          },
          ...prev.filter((d) => d.id !== saved.id),
        ];
        setFiltered(applyFilter(next, search));
        return next;
      });
    } catch (err) {
      console.error("Lỗi khi lưu bộ môn:", err?.response?.status, err?.response?.data || err);
    }
  };

  const handleDeleteClick = (dep) => {
    setToDelete(dep);
    setShowDelete(true);
  };

  const confirmDelete = async () => {
    if (!toDelete) return;
    try {
      await DepartmentApi.department.delete(toDelete.id);
      setDepartments((prev) => {
        const next = prev.filter((d) => d.id !== toDelete.id);
        setFiltered(applyFilter(next, search));
        return next;
      });
    } catch (err) {
      console.error("Lỗi khi xóa bộ môn:", err?.response?.data || err);
    } finally {
      setToDelete(null);
      setShowDelete(false);
    }
  };

  const handleViewDetail = async (dep) => {
    try {
      const [full, tRaw, subjects] = await Promise.all([
        DepartmentApi.department.getById(dep.id),
        getAllTeachers().catch(() => []),
        DepartmentApi.department.getSubjectsByDepartment(dep),
      ]);
      const teachers = Array.isArray(tRaw) ? tRaw : tRaw?.content || [];
      const listTeachers = teachers.filter((t) => teacherInDept(t, dep));
      const listSubjects = subjects || [];

      console.group(
        `%c[DEBUG] DETAIL → ${dep.name}`,
        "color:#f97316;font-weight:700"
      );
      console.log("teachersOfDept:", listTeachers.length, listTeachers);
      console.log("subjectsOfDept:", listSubjects.length, listSubjects);
      console.groupEnd();

      setSelected({
        ...full,
        teachers: listTeachers,
        teacherCount: listTeachers.length,
        subjects: listSubjects,
        subjectCount: listSubjects.length,
      });
      setDetailOpen(true);
    } catch (err) {
      console.error("Lỗi khi tải chi tiết đầy đủ:", err?.response?.data || err);
    }
  };

  return (
    <div className="teacher-container">
      {showForm && (
        <DepartmentForm
          onClose={() => {
            setShowForm(false);
            setEditing(null);
          }}
          editData={editing}
          onSuccess={handleFormSuccess}
        />
      )}

      <DepartmentDetail
        open={detailOpen}
        department={selected}
        onClose={() => setDetailOpen(false)}
      />

      <div className="teacher-header">
        <button
          className="add-button"
          onClick={() => {
            setEditing(null);
            setShowForm(true);
          }}
        >
          Thêm bộ môn
        </button>
        <div className="search-container">
          <input
            type="text"
            placeholder="Tìm kiếm"
            className="search-input"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <FaSearch className="search-icon" />
        </div>
      </div>

      <table className="account-table">
        <thead>
          <tr>
            <th>STT</th>
            <th>Mã bộ môn</th>
            <th>Tên bộ môn</th>
            <th>Khoa</th>
            <th>Số lượng GV</th>
            <th>Số lượng môn học</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((dep, idx) => (
            <tr key={dep.id}>
              <td>{idx + 1}</td>
              <td>{dep.code}</td>
              <td>{dep.name}</td>
              <td>{dep.faculty?.name || "Chưa xác định"}</td>
              <td>{dep.teacherCount ?? 0}</td>
              <td>{dep.subjectCount ?? 0}</td>
              <td className="actions">
                <FaInfoCircle
                  className="icon info"
                  title="Chi tiết"
                  onClick={() => handleViewDetail(dep)}
                  style={{ cursor: "pointer", marginRight: 8 }}
                />
                <FaEdit
                  className="icon edit"
                  title="Chỉnh sửa"
                  onClick={() => {
                    setEditing(dep);
                    setShowForm(true);
                  }}
                  style={{ cursor: "pointer", marginRight: 8 }}
                />
                <FaTrash
                  className="icon delete"
                  title="Xóa"
                  onClick={() => handleDeleteClick(dep)}
                  style={{ cursor: "pointer" }}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="footer">
        <div>
          Hiển thị {filtered.length} kết quả
          {search && ` (lọc từ ${departments.length})`}
        </div>
        <div className="pagination">
          <select defaultValue="10">
            <option value="10">10</option>
            <option value="25">25</option>
            <option value="50">50</option>
          </select>
          <span>Từ 1 đến {Math.min(filtered.length, 10)} bản ghi</span>
          <button disabled>&lt;</button>
          <button disabled>&gt;</button>
        </div>
      </div>

      <DeleteConfirmModal
        isOpen={showDelete}
        onClose={() => setShowDelete(false)}
        onConfirm={confirmDelete}
        title="XÓA BỘ MÔN"
        message="Bạn có chắc chắn muốn xóa bộ môn này không?"
      />
    </div>
  );
};

export default DepartmentList;
