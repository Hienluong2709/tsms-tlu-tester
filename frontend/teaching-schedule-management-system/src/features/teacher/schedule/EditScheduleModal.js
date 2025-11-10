// src/features/teacher/schedule/EditScheduleModal.js
import React, { useState, useEffect } from "react";
import { FaTimes, FaUpload } from "react-icons/fa";
import "../../../styles/EditScheduleModal.css";

const EditScheduleModal = ({ isOpen, onClose, onSubmit, scheduleData }) => {
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

  // Convert department display to value
  const convertToDepartmentValue = (departmentText) => {
    if (!departmentText) return "cntt";
    if (departmentText === "Công nghệ thông tin") return "cntt";
    if (departmentText === "Kỹ thuật máy tính") return "ktmt";
    if (departmentText === "Hệ thống thông tin") return "httt";
    return "cntt";
  };

  // Convert faculty display to value
  const convertToFacultyValue = (facultyText) => {
    if (!facultyText) return "cntt";
    if (facultyText === "Khoa Công nghệ thông tin") return "cntt";
    if (facultyText === "Khoa Kỹ thuật xây dựng") return "ktxd";
    if (facultyText === "Khoa Kỹ thuật thủy lợi") return "ktthuy";
    return "cntt";
  };

  // Load dữ liệu vào form khi modal mở
  useEffect(() => {
    if (isOpen && scheduleData) {
      setFormData({
        course: scheduleData.courseCode || "",
        department: convertToDepartmentValue(scheduleData.department),
        faculty: convertToFacultyValue(scheduleData.faculty),
        date: convertToDateInput(scheduleData.day) || "",
        period: convertToPeriodValue(scheduleData.period) || "",
        room: scheduleData.room?.replace(/\s-\s/g, "-") || "",
        type: convertToTypeValue(scheduleData.type) || "",
        content: scheduleData.content || "",
        materials: null,
      });
    }
  }, [isOpen, scheduleData]);

  // Convert date display to input format
  const convertToDateInput = (dayText) => {
    if (!dayText) return "";
    // Extract date from "Thứ 5, ngày 31/7/2025" format
    const dateMatch = dayText.match(/(\d{1,2})\/(\d{1,2})\/(\d{4})/);
    if (dateMatch) {
      const [, day, month, year] = dateMatch;
      return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
    }
    return "";
  };

  // Convert period display to value
  const convertToPeriodValue = (periodText) => {
    if (!periodText) return "";
    if (periodText.includes("1") && periodText.includes("3")) return "1-3";
    if (periodText.includes("4") && periodText.includes("6")) return "4-6";
    if (periodText.includes("7") && periodText.includes("9")) return "7-9";
    if (periodText.includes("10") && periodText.includes("12")) return "10-12";
    return "";
  };

  // Convert type display to value
  const convertToTypeValue = (typeText) => {
    if (!typeText) return "";
    if (typeText === "Thực hành") return "thuc-hanh";
    if (typeText === "Lý thuyết") return "ly-thuyet";
    if (typeText === "Bài tập") return "bai-tap";
    return "";
  };

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

    // Kiểm tra validation
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

    // Gọi hàm onSubmit từ parent component với ID của schedule
    onSubmit({ ...formData, id: scheduleData.id });

    // Đóng modal
    onClose();
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

  return (
    <div className="modal-overlay">
      <div className="edit-modal-container">
        <div className="edit-modal-header">
          <h2>CHỈNH SỬA LỊCH DẠY</h2>
          <button className="close-btn" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="edit-modal-form">
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
                <option value="cntt">Kỹ thuật phầm mềm</option>
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

          <div className="edit-modal-footer">
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

export default EditScheduleModal;
