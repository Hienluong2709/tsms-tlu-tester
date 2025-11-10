import React, { useState, useEffect } from 'react';
import '../../../styles/SemesterForm.css'; 

const SemesterForm = ({ visible, onClose, initialData, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    academicYear: '',
    startDate: '',
    endDate: '',
    status: '',
  });

useEffect(() => {
  if (initialData) {
    setFormData(initialData); 
  } else {
    setFormData({
      name: '',
      academicYear: '',
      startDate: '',
      endDate: '',
      status: '',
    });
  }
}, [initialData]);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

    const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData); 
    };


  if (!visible) return null;

  return (
    <div className="modal-semester-overlay">
      <div className="modal-semester-content">
        <div className="modal-semester-header">
          <h2>{initialData ? 'Chỉnh sửa học kỳ' : 'Thêm học kỳ'}</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>

        <form className="semester-form" onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label>Tên học kỳ</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Năm học</label>
              <input
                type="text"
                name="academicYear"
                value={formData.academicYear}
                onChange={handleChange}
                placeholder="VD: 2025-2026"
                required
              />
            </div>

            <div className="form-group">
              <label>Ngày bắt đầu</label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Ngày kết thúc</label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Trạng thái: *</label>
              <select name="status" value={formData.status} onChange={handleChange} required>
                <option value="">-- Chọn trạng thái --</option>
                <option value="Đang diễn ra">Đang diễn ra</option>
                <option value="Chưa diễn ra">Chưa diễn ra</option>
              </select>
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="submit-button">Xác nhận</button>
            <button type="button" className="cancel-button" onClick={onClose}>Hủy bỏ</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SemesterForm;
