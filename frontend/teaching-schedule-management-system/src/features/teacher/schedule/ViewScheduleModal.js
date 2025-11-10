import React, { useState } from "react";
import { FaTimes } from "react-icons/fa";
import "../../../styles/ViewScheduleModal.css";

const ViewScheduleModal = ({ isOpen, onClose, scheduleData, onFileUploaded }) => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  if (!isOpen || !scheduleData) return null;

  console.log("Schedule Data (ViewScheduleModal):", scheduleData);

  const handleSaveFile = async () => {
    if (!file) {
      alert("Vui lòng chọn file trước khi lưu!");
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("scheduleId", scheduleData.id);

      const res = await fetch("/api/schedules/upload-material", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed");
      const updatedData = await res.json();

      alert("Tải tài liệu thành công!");

      // Gọi callback để parent load lại dữ liệu
      if (onFileUploaded) onFileUploaded(updatedData);

      // Đóng modal
      onClose();
    } catch (err) {
      console.error(err);
      alert("Có lỗi khi tải tài liệu");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="view-modal-container">
        <div className="view-modal-header">
          <h2>CHI TIẾT LỊCH DẠY</h2>
          <button className="close-btn" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        <div className="view-modal-content">
          {/* Lớp học phần */}
          <div className="info-row">
            <div className="info-group full-width">
              <label>
                Lớp học phần: <span className="required">*</span>
              </label>
              <div className="info-display">
                {scheduleData.subject} ({scheduleData.classSection})
              </div>
            </div>
          </div>

          <div className="info-row">
            <div className="info-group">
              <label>Bộ môn quản lý: *</label>
              <div className="info-display">{scheduleData.department}</div>
            </div>
            <div className="info-group">
              <label>Khoa quản lý: *</label>
              <div className="info-display">{scheduleData.faculty}</div>
            </div>
          </div>

          <div className="info-row">
            <div className="info-group">
              <label>Ngày giảng: *</label>
              <div className="info-display">{scheduleData.day}</div>
            </div>
            <div className="info-group">
              <label>Tiết học: *</label>
              <div className="info-display">{scheduleData.period}</div>
            </div>
          </div>

          <div className="info-row">
            <div className="info-group">
              <label>Phòng học: *</label>
              <div className="info-display">{scheduleData.room}</div>
            </div>
            <div className="info-group">
              <label>Loại lịch học: *</label>
              <div className="info-display">{scheduleData.type}</div>
            </div>
          </div>

          <div className="info-row">
            <div className="info-group full-width">
              <label>Nội dung bài giảng:</label>
              <div className="content-display">{scheduleData.content}</div>
            </div>
          </div>

          {/* Trường tài liệu */}
          <div className="info-row">
            <div className="info-group full-width">
              <label>Tài liệu:</label>
              {scheduleData.materials ? (
                <div className="info-display">
                  📄{" "}
                  <a
                    href={scheduleData.materials}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Xem tài liệu
                  </a>
                </div>
              ) : (
                <div>
                  <input
                    type="file"
                    onChange={(e) => setFile(e.target.files[0])}
                    disabled={uploading}
                  />
                  <button
                    className="btn-save"
                    onClick={handleSaveFile}
                    disabled={uploading}
                    style={{ marginLeft: "8px" }}
                  >
                    {uploading ? "Đang lưu..." : "Lưu"}
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="view-modal-footer">
            <button className="btn-cancel" onClick={onClose}>
              Quay lại
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewScheduleModal;
