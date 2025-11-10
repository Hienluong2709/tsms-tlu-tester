import React, { useState, useEffect } from 'react';
import { getFaculties } from '../../../api/ApiDropdown';
import '../../../styles/DepartmentForm.css';

const DepartmentForm = ({ onClose, onSuccess, editData }) => {
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    facultyId: '',
    description: '',
  });
  const [faculties, setFaculties] = useState([]);

  useEffect(() => {
    const loadFaculties = async () => {
      try {
        const data = await getFaculties();
        setFaculties(data);

        if (editData) {
          let selectedFacultyId = '';
          if (editData.faculty?.id) {
            selectedFacultyId = String(editData.faculty.id);
          } else if (editData.faculty?.name) {
            const matched = data.find(f => f.name === editData.faculty.name);
            if (matched) selectedFacultyId = String(matched.id);
          }

          setFormData({
            code: editData.code || '',
            name: editData.name || '',
            facultyId: selectedFacultyId,
            description: editData.description || '',
          });
        }
      } catch (err) {
        console.error('Lỗi khi tải danh sách khoa:', err);
      }
    };
    loadFaculties();
  }, [editData]);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    await onSuccess({
      ...formData,
      facultyId: parseInt(formData.facultyId, 10),
    });
  };

  return (
    <div className="department-form-overlay">
      <div className="department-form-card">
        <div className="department-form-header">
          <h2>{editData ? 'SỬA BỘ MÔN' : 'THÊM BỘ MÔN MỚI'}</h2>
          <button className="department-form-close" onClick={onClose}>×</button>
        </div>

        <form className="department-form-body" onSubmit={handleSubmit}>
          <div className="department-form-grid">
            <div className="form-group">
              <label>Mã bộ môn: <span>*</span></label>
              <input
                name="code"
                value={formData.code}
                onChange={handleChange}
                placeholder="Nhập mã bộ môn"
                required
              />
            </div>

            <div className="form-group">
              <label>Tên bộ môn: <span>*</span></label>
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Nhập tên bộ môn"
                required
              />
            </div>

            <div className="form-group">
              <label>Khoa: <span>*</span></label>
              <select
                name="facultyId"
                value={formData.facultyId}
                onChange={handleChange}
                required
              >
                <option value="">-- Chọn Khoa quản lý --</option>
                {faculties.map(f => (
                  <option key={f.id} value={f.id}>{f.name}</option>
                ))}
              </select>
            </div>

            <div className="form-group full-width">
              <label>Mô tả:</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Nhập mô tả"
              />
            </div>
          </div>

          <div className="department-form-footer">
            <button type="submit" className="submit-btn">
              {editData ? 'Cập nhật' : 'Xác nhận'}
            </button>
            <button type="button" className="cancel-btn" onClick={onClose}>
              Hủy bỏ
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DepartmentForm;
