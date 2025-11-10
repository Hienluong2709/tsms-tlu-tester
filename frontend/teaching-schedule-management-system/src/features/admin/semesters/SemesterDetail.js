import React from "react";
import "../../../styles/SemesterDetail.css";

const SemesterDetail = ({ open, onClose, semester }) => {
  if (!open || !semester) return null;

    console.log("Đối tượng Semester nhận được:", semester);
    console.log("Trạng thái (status) của Semester:", semester.status);
    console.log("Khoa (faculty) của Semester:", semester.faculty);

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN");
  };

 

  return (
    <div className="semester-detail-modal">
      <div className="semester-detail-box">
        <div className="semester-detail-header">
          <h2>Chi tiết học kỳ</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>

        <div className="semester-detail-row">
          <label>Mã học kỳ:</label>
          <div>{semester.id}</div>
        </div>
        <div className="semester-detail-row">
          <label>Tên học kỳ:</label>
          <div>{semester.name}</div>
        </div>
        <div className="semester-detail-row">
          <label>Năm học:</label>
          <div>{semester.academicYear}</div>
        </div>
        <div className="semester-detail-row">
          <label>Ngày bắt đầu:</label>
          <div>{formatDate(semester.startDate)}</div>
        </div>
        <div className="semester-detail-row">
          <label>Ngày kết thúc:</label>
          <div>{formatDate(semester.endDate)}</div>
        </div>
        <div className="semester-detail-row">
          <label>Trạng thái:</label>
          <div>{semester.status}</div>
        </div>
        <div className="semester-detail-footer">
          <button onClick={onClose}>Đóng</button>
        </div>
      </div>
    </div>
  );
};

export default SemesterDetail;
