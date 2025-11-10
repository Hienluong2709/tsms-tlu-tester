import React, { useState, useEffect } from 'react';
import '../../../styles/MajorForm.css';
import { getFaculties } from '../../../api/ApiDropdown';

const MajorForm = ({ visible, onClose, initialData, onSave }) => {
  const [formData, setFormData] = useState({ code: '', name: '', facultyId: '' });
  const [faculties, setFaculties] = useState([]);

  useEffect(() => {
    if (!visible) return;

    const loadDropdowns = async () => {
      try {
        const facultyList = await getFaculties();
        setFaculties(facultyList);

        let selectedFacultyId = '';
        if (initialData) {
          if (initialData.faculty?.id) {
            selectedFacultyId = String(initialData.faculty.id);
          } else if (initialData.faculty?.name) {
            const matchedFaculty = facultyList.find(f => f.name === initialData.faculty.name);
            if (matchedFaculty) selectedFacultyId = String(matchedFaculty.id);
          }
          setFormData({
            code: initialData.code || '',
            name: initialData.name || '',
            facultyId: selectedFacultyId,
            description: initialData.description || '',
          });
        } else {
          setFormData({ code: '', name: '', facultyId: '', description: '' });
        }
      } catch (error) {
        console.error('Lỗi khi tải dropdown:', error);
      }
    };

    loadDropdowns();
  }, [visible, initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const subjectDataToSave = {
      code: formData.code,
      name: formData.name,
      facultyId: formData.facultyId,
      description: formData.description,
    };
    if (initialData?.id) await onSave(initialData.id, subjectDataToSave);
    else await onSave(null, subjectDataToSave);
    onClose();
  };

  if (!visible) return null;

  return (
    <div className="modal-major-overlay">
      <div className="modal-major-content">
        <div className="modal-major-header">
          <h2>{initialData ? 'CHỈNH SỬA THÔNG TIN NGÀNH' : 'THÊM NGÀNH MỚI'}</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        <form className="major-form" onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label>Mã chuyên ngành: *</label>
              <input name="code" value={formData.code} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Tên chuyên ngành: *</label>
              <input name="name" value={formData.name} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Khoa quản lý: *</label>
              <select name="facultyId" value={formData.facultyId} onChange={handleChange} required>
                <option value="">-- Chọn khoa phụ trách --</option>
                {faculties.map(f => <option key={f.id} value={String(f.id)}>{f.name}</option>)}
              </select>
            </div>

            <div className="form-group" style={{ gridColumn: "1 / -1" }}>
            <label>Mô tả:</label>
            <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Nhập mô tả"
                rows={4}
            />
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

export default MajorForm;
