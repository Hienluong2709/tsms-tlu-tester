import React from "react";
import "../../../styles/SubjectDetail.css";

const SubjectDetail = ({ open, onClose, subject }) => {
  if (!open || !subject) return null;

    console.log("Đối tượng Subject nhận được:", subject);
    console.log("Trạng thái (status) của Subject:", subject.type);
    console.log("Khoa (faculty) của Subject:", subject.faculty);

  return (
    <div className="subject-detail-modal">
      <div className="subject-detail-box">
        <div className="subject-detail-header">
          <h2>Chi tiết môn học</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>

        <div className="subject-detail-content">
        <div className="subject-detail-row">
          <label>Mã môn học:</label>
          <div>{subject.code}</div>
        </div>
        <div className="subject-detail-row">
          <label>Tên môn học:</label>
          <div>{subject.name}</div>
        </div>
        <div className="subject-detail-row">
          <label>Số tín chỉ:</label>
          <div>{subject.credits}</div>
        </div>
        <div className="subject-detail-row">
          <label>Loại môn học:</label>
          <div>{subject.type}</div>
        </div>
        <div className="subject-detail-row">
          <label>Mô tả:</label>
          <div>{subject.description || "Chưa phân công"}</div>
        </div>
        <div className="subject-detail-row">
          <label>Trạng thái:</label>
          <div>{subject.type}</div>
        </div>
        <div className="subject-detail-row">
          <label>Bộ môn:</label>
          <div>{subject.department?.name || "Chưa phân công"}</div>
        </div>
        <div className="subject-detail-row">
          <label>Khoa:</label>
          <div>{subject.faculty?.name || "Chưa phân công"}</div>
        </div>
        </div>


        <div className="subject-detail-footer">
          <button onClick={onClose}>Đóng</button>
        </div>
      </div>
    </div>
  );
};

export default SubjectDetail;
