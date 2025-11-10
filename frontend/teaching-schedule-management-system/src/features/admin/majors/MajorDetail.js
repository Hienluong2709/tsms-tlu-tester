import React from "react";
import "../../../styles/MajorDetail.css";

const MajorDetail = ({ open, onClose, major }) => {
  if (!open || !major) return null;

    console.log("Đối tượng Major nhận được:", major);
    console.log("Trạng thái (status) của Major:", major.type);
    console.log("Khoa (faculty) của Major:", major.faculty);

  return (
    <div className="major-detail-modal">
      <div className="major-detail-box">
        <div className="major-detail-header">
          <h2>THÔNG TIN NGÀNH</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>

        <div className="major-detail-content">
        <div className="major-detail-row">
          <label>Mã chuyên ngành:</label>
          <div>{major.code}</div>
        </div>
        <div className="major-detail-row">
          <label>Tên chuyên ngành:</label>
          <div>{major.name}</div>
        </div>

        <div className="major-detail-row">
          <label>Khoa:</label>
          <div>{major.faculty?.name || "Chưa phân công"}</div>
        </div>

        <div className="major-detail-row">
          <label>Mô tả:</label>
          <div>{major.description || "kHÔNG CÓ"}</div>
        </div>

        </div>

        <div className="major-detail-footer">
          <button onClick={onClose}>Đóng</button>
        </div>
      </div>
    </div>
  );
};

export default MajorDetail;
