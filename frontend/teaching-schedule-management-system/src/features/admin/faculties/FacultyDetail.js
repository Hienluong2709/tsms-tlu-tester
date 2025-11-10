import React from "react";
import "../../../styles/FacultyDetail.css";

const FacultyDetail = ({ open, faculty, onClose }) => {
  if (!open || !faculty) return null;

  return (
    <div className="faculty-detail-overlay" onClick={onClose}>
      <div
        className="faculty-detail-modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="fac-title"
      >
        {/* Header (cố định) */}
        <div className="faculty-detail-header">
          <h2 id="fac-title">CHI TIẾT KHOA</h2>
          <button className="faculty-detail-close" onClick={onClose}>×</button>
        </div>

        {/* Body (cuộn) */}
        <div className="faculty-detail-body">
          {/* Thông tin cơ bản */}
          <div className="faculty-detail-section basic-info">
            <h3>Thông tin cơ bản</h3>
            <div className="basic-info-grid">
              <div className="basic-info-item">
                <label>Tên khoa:</label>
                <input type="text" value={faculty.name || ""} disabled />
              </div>

              <div className="basic-info-item">
                <label>Mã khoa:</label>
                <input type="text" value={faculty.code || ""} disabled />
              </div>
              <div className="basic-info-item">
                <label>Số lượng giảng viên:</label>
                <input type="number" value={faculty.teacherCount ?? faculty.teachers?.length ?? 0} disabled />
              </div>

              <div className="basic-info-item">
                <label>Số lượng bộ môn:</label>
                <input type="number" value={faculty.departmentCount ?? faculty.departments?.length ?? 0} disabled />
              </div>

              {faculty.description ? (
                <div className="basic-info-item basic-info-item--full">
                  <label>Mô tả:</label>
                  <textarea value={faculty.description} disabled rows={4} />
                </div>
              ) : null}
            </div>
          </div>

          {/* Danh sách giảng viên */}
          <div className="faculty-detail-section">
            <h3>Danh sách giảng viên</h3>
            {faculty.teachers?.length ? (
              <div className="table-scroll">
                <table className="faculty-teachers-table">
                  <thead>
                    <tr>
                      <th>STT</th>
                      <th>Mã GV</th>
                      <th>Họ tên</th>
                      <th>Email</th>
                      <th>SĐT</th>
                    </tr>
                  </thead>
                  <tbody>
                    {faculty.teachers.map((t, i) => (
                      <tr key={t.id || i}>
                        <td>{i + 1}</td>
                        <td>{t.teacherCode || t.code}</td>
                        <td>{t.fullName || t.name}</td>
                        <td>{t.email || "-"}</td>
                        <td>{t.phoneNumber || "-"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="no-data">Chưa có giảng viên</p>
            )}
          </div>

          {/* Danh sách bộ môn */}
          <div className="faculty-detail-section">
            <h3>Danh sách bộ môn</h3>
            {faculty.departments?.length ? (
              <div className="table-scroll">
                <table className="faculty-departments-table">
                  <thead>
                    <tr>
                      <th>STT</th>
                      <th>Mã bộ môn</th>
                      <th>Tên bộ môn</th>
                      <th>Mô tả</th>
                    </tr>
                  </thead>
                  <tbody>
                    {faculty.departments.map((d, i) => (
                      <tr key={d.id || i}>
                        <td>{i + 1}</td>
                        <td>{d.code}</td>
                        <td>{d.name}</td>
                        <td>{d.description || "-"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="no-data">Chưa có bộ môn</p>
            )}
          </div>
        </div>

        {/* Footer (cố định) */}
        <div className="faculty-detail-footer">
          <button className="btn-back" onClick={onClose}>Quay lại</button>
        </div>
      </div>
    </div>
  );
};

export default FacultyDetail;
