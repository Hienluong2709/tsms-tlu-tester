import React from "react";
import { FaTimes } from "react-icons/fa";
import "../../../styles/ClassSectionDetail.css";

const safe = (v, fallback = "Chưa xác định") =>
  v === 0 || v ? v : fallback;

const ClassSectionDetail = ({ open, data, onClose }) => {
  if (!open || !data) return null;

  const fields = [
    ["Tên học phần", safe(data?.name)],
    ["Giảng viên phụ trách", safe(data?.teacher?.fullName || data?.teacherName)],
    ["Khoa phụ trách", safe(data?.faculty?.name || data?.facultyName)],
    ["Bộ môn phụ trách", safe(data?.department?.name || data?.departmentName)],
    ["Học phần", safe(data?.subject?.name || data?.subjectName)],
    [
      "Học kỳ",
      safe(
        data?.semester?.name ||
          data?.semester?.code ||
          data?.semester?.academicYear ||
          data?.semesterName
      ),
    ],
    ["Phòng học", safe(data?.room?.name || data?.room?.code || data?.roomName)],
  ];

  return (
    <div className="csd-modal">
      <div className="csd-box" role="dialog" aria-modal="true" aria-label="Thông tin lớp học phần" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="csd-header">
          <h2>THÔNG TIN LỚP HỌC PHẦN</h2>
          <button className="csd-close" onClick={onClose} aria-label="Đóng">
            <FaTimes />
          </button>
        </div>

        {/* Body */}
        <div className="csd-body">
          {fields.map(([label, value]) => (
            <div key={label} className="csd-row">
              <label className="csd-label">{label}:</label>
              <div className="csd-value">{value}</div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="csd-footer">
          <button className="csd-primary" onClick={onClose}>Quay lại</button>
        </div>
      </div>
    </div>
  );
};

export default ClassSectionDetail;
