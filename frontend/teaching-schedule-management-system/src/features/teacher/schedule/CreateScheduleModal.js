// src/features/teacher/schedule/CreateScheduleModal.js
import React, { useState } from "react";
import { FaTimes, FaUpload, FaExclamationTriangle } from "react-icons/fa";
import "../../../styles/CreateScheduleModal.css";

const CreateScheduleModal = ({
  isOpen,
  onClose,
  onSubmit,
  mode = "create",
  scheduleData = null,
}) => {
  const [formData, setFormData] = useState({
    course: "",
    department: "",
    faculty: "",
    date: "",
    period: "",
    room: "",
    type: "",
    content: "",
    materials: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      materials: e.target.files[0],
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (mode === "delete") {
      // Xử lý xóa
      onSubmit(scheduleData);
      return;
    }

    // Kiểm tra validation cho mode create
    if (
      !formData.course ||
      !formData.department ||
      !formData.faculty ||
      !formData.date ||
      !formData.period ||
      !formData.room ||
      !formData.type
    ) {
      alert("Vui lòng điền đầy đủ các trường bắt buộc!");
      return;
    }

    // Gọi hàm onSubmit từ parent component
    onSubmit(formData);

    // Reset form
    setFormData({
      course: "",
      department: "",
      faculty: "",
      date: "",
      period: "",
      room: "",
      type: "",
      content: "",
      materials: null,
    });
  };

  const handleCancel = () => {
    setFormData({
      course: "",
      department: "",
      faculty: "",
      date: "",
      period: "",
      room: "",
      type: "",
      content: "",
      materials: null,
    });
    onClose();
  };

  if (!isOpen) return null;

  // Render cho mode delete
  if (mode === "delete") {
    return (
      <div className="modal-overlay">
        <div className="modal-container delete-mode">
          <div className="modal-header">
            <h2>XÓA LỊCH DẠY</h2>
            <button className="close-btn" onClick={onClose}>
              <FaTimes />
            </button>
          </div>

          <div className="modal-form">
            <div className="warning-section">
              <div className="warning-icon">
                <FaExclamationTriangle />
              </div>
              <div className="warning-text">
                <p>Bạn có chắc chắn muốn xóa lịch dạy này không?</p>
              </div>
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn-confirm"
                onClick={handleSubmit}
              >
                Xác nhận
              </button>
              <button
                type="button"
                className="btn-cancel"
                onClick={handleCancel}
              >
                Hủy bỏ
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Render cho mode create (default)

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h2>TẠO LỊCH DẠY</h2>
          <button className="close-btn" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-row">
            <div className="form-group full-width">
              <label htmlFor="course">
                Lớp học phần: <span className="required">*</span>
              </label>
              <select
                id="course"
                name="course"
                value={formData.course}
                onChange={handleChange}
                required
              >
                <option value="">-Chọn lớp học phần-</option>
                <option value="CSE423_001">
                  Lập trình phân tán-2-24 (CSE423_001)
                </option>
                <option value="CSE481_002">
                  Công nghệ phần mềm-2-24 (CSE481_002)
                </option>
                <option value="CSE350_003">
                  Cơ sở dữ liệu-2-24 (CSE350_003)
                </option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="department">
                Bộ môn quản lý: <span className="required">*</span>
              </label>
              <select
                id="department"
                name="department"
                value={formData.department}
                onChange={handleChange}
                required
              >
                <option value="">-Chọn bộ môn quản lý-</option>
                <option value="cntt">Kỹ thuật phần mềm</option>
                <option value="ktmt">Công nghệ phần mềm</option>
                <option value="httt">Hệ thống thông tin</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="faculty">
                Khoa quản lý: <span className="required">*</span>
              </label>
              <select
                id="faculty"
                name="faculty"
                value={formData.faculty}
                onChange={handleChange}
                required
              >
                <option value="">-Chọn khoa quản lý-</option>
                <option value="cntt">Khoa Công nghệ thông tin</option>
                <option value="ktxd">Khoa Kỹ thuật xây dựng</option>
                <option value="ktthuy">Khoa Kỹ thuật thủy lợi</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="date">
                Ngày giảng: <span className="required">*</span>
              </label>
              <input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="period">
                Tiết học: <span className="required">*</span>
              </label>
              <select
                id="period"
                name="period"
                value={formData.period}
                onChange={handleChange}
                required
              >
                <option value="">-Chọn tiết học-</option>
                <option value="1-3">Tiết 1-3 (7:00-9:40)</option>
                <option value="4-6">Tiết 4-6 (9:50-12:30)</option>
                <option value="7-9">Tiết 7-9 (13:30-16:10)</option>
                <option value="10-12">Tiết 10-12 (16:20-19:00)</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="room">
                Phòng học: <span className="required">*</span>
              </label>
              <select
                id="room"
                name="room"
                value={formData.room}
                onChange={handleChange}
                required
              >
                <option value="">-Chọn phòng học-</option>
                <option value="208-B5">208 - B5</option>
                <option value="209-B5">209 - B5</option>
                <option value="301-B5">301 - B5</option>
                <option value="302-B5">302 - B5</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="type">
                Loại lịch học: <span className="required">*</span>
              </label>
              <select
                id="type"
                name="type"
                value={formData.type}
                onChange={handleChange}
                required
              >
                <option value="">-Chọn loại lịch học-</option>
                <option value="thuc-hanh">Thực hành</option>
                <option value="ly-thuyet">Lý thuyết</option>
                <option value="bai-tap">Bài tập</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group full-width">
              <label htmlFor="content">Nội dung bài giảng:</label>
              <textarea
                id="content"
                name="content"
                value={formData.content}
                onChange={handleChange}
                placeholder="Nhập nội dung bài giảng"
                rows="3"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group full-width">
              <label htmlFor="materials">Tài liệu:</label>
              <div className="file-upload">
                <input
                  type="file"
                  id="materials"
                  name="materials"
                  onChange={handleFileChange}
                  style={{ display: "none" }}
                  accept=".pdf,.doc,.docx,.ppt,.pptx"
                />
                <label htmlFor="materials" className="file-upload-label">
                  <FaUpload />
                  Tải file tài liệu
                </label>
                {formData.materials && (
                  <span className="file-name">{formData.materials.name}</span>
                )}
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button type="submit" className="btn-confirm">
              Xác nhận
            </button>
            <button type="button" className="btn-cancel" onClick={handleCancel}>
              Hủy bỏ
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateScheduleModal;
