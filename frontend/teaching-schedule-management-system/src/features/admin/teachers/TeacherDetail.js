import React from "react";
import "../../../styles/TeacherDetail.css";

const TeacherDetail = ({ open, onClose, teacher }) => {
  if (!open || !teacher) return null;

    console.log("Đối tượng Teacher nhận được:", teacher);
    console.log("Trạng thái (status) của Teacher:", teacher.status);
    console.log("Khoa (faculty) của Teacher:", teacher.faculty);

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN");
  };

  const formatStatus = (status) => {
    switch (status) {
      case "ACTIVE":
        return "Hoạt động";
      case "INACTIVE":
        return "Tạm nghỉ";
      default:
        return "Không xác định";
    }

  };

  return (
    <div className="teacher-detail-modal">
      <div className="teacher-detail-box">
        <div className="teacher-detail-header">
          <h2>Chi tiết giảng viên</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>

        <div className="teacher-detail-row">
          <label>Mã giảng viên:</label>
          <div>{teacher.teacherCode}</div>
        </div>
        <div className="teacher-detail-row">
          <label>Họ tên:</label>
          <div>{teacher.fullName}</div>
        </div>
        <div className="teacher-detail-row">
          <label>Email:</label>
          <div>{teacher.email}</div>
        </div>
        <div className="teacher-detail-row">
          <label>Ngày sinh:</label>
          <div>{formatDate(teacher.dateOfBirth)}</div>
        </div>
        <div className="teacher-detail-row">
          <label>Số điện thoại:</label>
          <div>{teacher.phoneNumber}</div>
        </div>
        <div className="teacher-detail-row">
          <label>Trạng thái:</label>  
          <div>{formatStatus(teacher.status)}</div>
        </div>
        <div className="teacher-detail-row">
          <label>Bộ môn:</label>
          <div>{teacher.department?.name || "Chưa phân công"}</div>
        </div>
        <div className="teacher-detail-row">
          <label>Khoa:</label>
          <div>{teacher.faculty?.name || "Chưa phân công"}</div>
        </div>


        <div className="teacher-detail-footer">
          <button onClick={onClose}>Đóng</button>
        </div>
      </div>
    </div>
  );
};

export default TeacherDetail;
