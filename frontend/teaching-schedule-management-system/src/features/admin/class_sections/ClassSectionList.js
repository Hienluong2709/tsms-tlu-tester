import React, { useEffect, useMemo, useState } from "react";
import { FaEdit, FaTrash, FaInfoCircle, FaSearch } from "react-icons/fa";

import ClassSectionApi from "../../../api/ClassSectionApi";
import ClassSectionForm from "./ClassSectionForm";
import ClassSectionDetail from "./ClassSectionDetail";
import DeleteConfirmModal from "../../../components/DeleteConfirmModal";

import "../../../styles/ClassSectionList.css";

const norm = (v) => (v ?? "").toString().trim().toLowerCase();

const ClassSectionList = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [toDelete, setToDelete] = useState(null);

  useEffect(() => { loadAll(); }, []);
  const loadAll = async () => {
    setLoading(true);
    try {
      const data = await ClassSectionApi.getAll();
      setRows((data || []).map(ClassSectionApi.hydrate));
    } catch (e) {
      console.error("[CS LIST] Load lỗi:", e?.response?.data || e);
    } finally {
      setLoading(false);
    }
  };

  const filtered = useMemo(() => {
    if (!search.trim()) return rows;
    const t = norm(search);
    return rows.filter(
      (x) =>
        norm(x.name).includes(t) ||
        norm(x.teacherName).includes(t) ||
        norm(x.subjectName).includes(t) ||
        norm(x.facultyName).includes(t) ||
        norm(x.semesterName).includes(t) ||
        norm(x.roomName).includes(t)
    );
  }, [rows, search]);

  const onCreateClick = () => { setEditing(null); setShowForm(true); };

  const onEditClick = async (row) => {
    try {
      const full = await ClassSectionApi.getById(row.id);
      setEditing(full);
      setShowForm(true);
    } catch (e) {
      console.error("[CS LIST] Lỗi load bản ghi để sửa:", e?.response?.data || e);
    }
  };

  const onViewClick = async (row) => {
    try {
      const full = await ClassSectionApi.getById(row.id);
      setSelected(full);
      setDetailOpen(true);
    } catch (e) {
      console.error("[CS LIST] Lỗi xem chi tiết:", e?.response?.data || e);
    }
  };

  const onDeleteClick = (row) => { setToDelete(row); setConfirmOpen(true); };
  const onConfirmDelete = async () => {
    if (!toDelete) return;
    try {
      await ClassSectionApi.delete(toDelete.id);
      setRows((prev) => prev.filter((x) => x.id !== toDelete.id));
    } catch (e) {
      console.error("[CS LIST] Xóa lỗi:", e?.response?.data || e);
    } finally {
      setConfirmOpen(false);
      setToDelete(null);
    }
  };

  const onFormSuccess = (saved) => {
    const hydrated = ClassSectionApi.hydrate(saved);
    setRows((prev) => [hydrated, ...prev.filter((x) => x.id !== hydrated.id)]);
    setShowForm(false);
    setEditing(null);
  };

  return (
    <div className="class-section-container">
      {showForm && (
        <ClassSectionForm
          open
          editData={editing}
          onClose={() => { setShowForm(false); setEditing(null); }}
          onSuccess={onFormSuccess}
        />
      )}

      <ClassSectionDetail
        open={detailOpen}
        data={selected}
        onClose={() => setDetailOpen(false)}
      />

      <div className="class-section-header">
        <button className="class-section-add-btn" onClick={onCreateClick}>
          Thêm lớp học phần
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

      <table className="class-section-table">
        <thead>
          <tr>
            <th>STT</th>
            <th>Tên lớp học phần</th>
            <th>Giảng viên phụ trách</th>
            <th>Khoa</th>
            <th>Học phần</th>
            <th>Phòng</th>
            <th>Học kỳ</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr><td colSpan={8}>Đang tải...</td></tr>
          ) : filtered.length === 0 ? (
            <tr><td colSpan={8}>Không có dữ liệu</td></tr>
          ) : (
            filtered.map((row, i) => (
              <tr key={row.id}>
                <td>{i + 1}</td>
                <td>{row.name}</td>
                <td>{row.teacherName}</td>
                <td>{row.facultyName}</td>
                <td>{row.subjectName}</td>
                <td>{row.roomName}</td>
                <td>{row.semesterName}</td>
                <td className="class-section-actions">
                  <FaInfoCircle
                    className="class-section-icon info"
                    title="Chi tiết"
                    onClick={() => onViewClick(row)}
                  />
                  <FaEdit
                    className="class-section-icon edit"
                    title="Chỉnh sửa"
                    onClick={() => onEditClick(row)}
                  />
                  <FaTrash
                    className="class-section-icon delete"
                    title="Xóa"
                    onClick={() => onDeleteClick(row)}
                  />
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <div className="class-section-footer">
        <div>Hiển thị {filtered.length} kết quả{search && ` (lọc từ ${rows.length})`}</div>
      </div>

      <DeleteConfirmModal
        isOpen={confirmOpen}
        title="XÓA LỚP HỌC PHẦN"
        message={`Bạn có chắc muốn xóa "${toDelete?.name || ""}"?`}
        onClose={() => setConfirmOpen(false)}
        onConfirm={onConfirmDelete}
      />
    </div>
  );
};

export default ClassSectionList;
