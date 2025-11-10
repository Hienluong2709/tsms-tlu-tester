import React from "react";
import "../../../styles/DepartmentDetail.css";

const DepartmentDetail = ({ open, department, onClose }) => {
  if (!open || !department) return null;

  return (
    <div className="department-detail-overlay" onClick={onClose}>
      <div
        className="department-detail-modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        {/* Header (đứng yên) */}
        <div className="department-detail-header">
          <h2>CHI TIẾT BỘ MÔN</h2>
          <button className="department-detail-close" onClick={onClose}>×</button>
        </div>

        {/* Body (cuộn) */}
        <div className="department-detail-body">
          {/* Thông tin cơ bản */}
          <div className="department-detail-section basic-info">
            <h3>Thông tin cơ bản</h3>
            <div className="basic-info-grid">
              <div className="basic-info-item">
                <label>Tên bộ môn:</label>
                <input type="text" value={department.name || ""} disabled />
              </div>
              <div className="basic-info-item">
                <label>Khoa:</label>
                <input type="text" value={department.faculty?.name || ""} disabled />
              </div>
              <div className="basic-info-item">
                <label>Số lượng giảng viên:</label>
                <input type="number" value={department.teacherCount ?? 0} disabled />
              </div>
              <div className="basic-info-item">
                <label>Số lượng môn học:</label>
                <input type="number" value={department.subjectCount ?? 0} disabled />
              </div>
            </div>
          </div>

          {/* Danh sách giảng viên */}
          <div className="department-detail-section">
            <h3>Danh sách giảng viên</h3>
            {department.teachers?.length ? (
              <div className="table-scroll">
                <table className="department-teachers-table">
                  <thead>
                    <tr>
                      <th>STT</th><th>Mã GV</th><th>Họ tên</th><th>Email</th><th>SĐT</th>
                    </tr>
                  </thead>
                  <tbody>
                    {department.teachers.map((t, i) => (
                      <tr key={t.id || i}>
                        <td>{i + 1}</td>
                        <td>{t.teacherCode || t.code}</td>
                        <td>{t.fullName || t.name}</td>
                        <td>{t.email}</td>
                        <td>{t.phoneNumber}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : <p className="no-data">Chưa có giảng viên</p>}
          </div>

          {/* Danh sách môn học */}
          <div className="department-detail-section">
            <h3>Danh sách môn học</h3>
            {department.subjects?.length ? (
              <div className="table-scroll">
                <table className="department-subjects-table">
                  <thead>
                    <tr>
                      <th>STT</th><th>Mã môn học</th><th>Tên môn học</th><th>Tín chỉ</th><th>Loại MH</th>
                    </tr>
                  </thead>
                  <tbody>
                    {department.subjects.map((s, i) => (
                      <tr key={s.id || i}>
                        <td>{i + 1}</td>
                        <td>{s.code || s.subjectCode}</td>
                        <td>{s.name || s.subjectName}</td>
                        <td>{s.credits}</td>
                        <td>{s.type}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : <p className="no-data">Chưa có môn học</p>}
          </div>
        </div>

        {/* Footer (đứng yên) */}
        <div className="department-detail-footer">
          <button className="btn-back" onClick={onClose}>Quay lại</button>
        </div>
      </div>
    </div>
  );
};

export default DepartmentDetail;
