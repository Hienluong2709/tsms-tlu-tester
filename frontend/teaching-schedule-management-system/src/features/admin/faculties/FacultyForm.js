import React, { useEffect, useState, useCallback } from "react";
import { FaChevronDown } from "react-icons/fa";
import { getAllTeachers } from "../../../api/TeacherApi";
import "../../../styles/FacultyForm.css";

const DEFAULT_VALUES = {
  code: "",
  name: "",
  deanName: "",
  description: "",
  status: "ACTIVE",
};

const FacultyForm = ({ editData, onClose, onSuccess }) => {
  const [form, setForm] = useState(DEFAULT_VALUES);
  const [teachers, setTeachers] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  // Điền form khi sửa / reset khi thêm
  useEffect(() => {
    if (editData) {
      setForm({
        code: editData.code ?? "",
        name: editData.name ?? "",
        deanName: editData.deanName ?? "",
        description: editData.description ?? "",
        status: editData.status ?? "ACTIVE",
      });
    } else {
      setForm(DEFAULT_VALUES);
    }
  }, [editData]);

  // Load danh sách giảng viên cho dropdown Trưởng khoa
  useEffect(() => {
    (async () => {
      try {
        const list = await getAllTeachers();
        setTeachers(
          (list || []).sort((a, b) =>
            (a.fullName || "").localeCompare(b.fullName || "")
          )
        );
      } catch (e) {
        console.error("Lỗi khi tải danh sách giảng viên:", e);
      }
    })();
  }, []);

  // Đóng bằng phím Esc
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose?.();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  };

  const handleChangeDean = (e) => {
    setForm((s) => ({ ...s, deanName: e.target.value })); // lưu theo tên
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    try {
      await onSuccess(form); // payload phẳng: code, name, deanName, description, status
    } finally {
      setSubmitting(false);
    }
  };

  const closeOnOverlay = useCallback(() => onClose?.(), [onClose]);
  const stop = (e) => e.stopPropagation();

  return (
    <div className="faculty-form-overlay" onClick={closeOnOverlay}>
      <div className="faculty-form-card" onClick={stop}>
        <div className="faculty-form-header">
          <h2>{editData ? "SỬA KHOA" : "THÊM KHOA MỚI"}</h2>
          <button className="faculty-form-close" type="button" onClick={onClose}>
            ×
          </button>
        </div>

        <form className="faculty-form-body" onSubmit={handleSubmit}>
          <div className="faculty-form-grid">
            {/* Mã khoa */}
            <div className="form-group">
              <label>
                Mã khoa: <span>*</span>
              </label>
              <input
                name="code"
                value={form.code}
                onChange={handleChange}
                placeholder="Nhập mã khoa"
                required
              />
            </div>

            {/* Tên khoa */}
            <div className="form-group">
              <label>
                Tên khoa: <span>*</span>
              </label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Nhập tên khoa"
                required
              />
            </div>

            {/* Mô tả */}
            <div className="form-group full-width">
              <label>Mô tả:</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Nhập mô tả"
                rows={4}
              />
            </div>
          </div>

          {/* Divider */}
          <div className="faculty-form-divider" />

          <div className="faculty-form-footer">
            <button type="submit" className="submit-btn" disabled={submitting}>
              {submitting ? "Đang lưu..." : "Xác nhận"}
            </button>
            <button type="button" className="cancel-btn" onClick={onClose}>
              Hủy bỏ
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FacultyForm;
