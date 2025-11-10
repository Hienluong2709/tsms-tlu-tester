import React, { useState, useEffect } from 'react';
import '../../../styles/SubjectForm.css';
import { getFaculties, getDepartmentsByFaculty } from '../../../api/ApiDropdown';

const SubjectForm = ({ visible, onClose, initialData, onSave }) => {
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    credits: '',
    description: '',
    facultyId: '',
    departmentId: '',
    type: '',
  });

  const [faculties, setFaculties] = useState([]);
  const [departments, setDepartments] = useState([]);

useEffect(() => {
  if (!visible) return;

  const loadDropdowns = async () => {
    try {
      const facultyList = await getFaculties();
      setFaculties(facultyList);

      let selectedFacultyId = '';
      let selectedDepartmentId = '';
      let departmentList = [];

      if (initialData) {
        // Tìm facultyId từ tên nếu không có ID
        if (initialData.faculty?.id) {
          selectedFacultyId = String(initialData.faculty.id);
        } else if (initialData.faculty?.name) {
          const matchedFaculty = facultyList.find(f => f.name === initialData.faculty.name);
          if (matchedFaculty) {
            selectedFacultyId = String(matchedFaculty.id);
          }
        }

        // Lấy danh sách bộ môn nếu đã có facultyId
        if (selectedFacultyId) {
          departmentList = await getDepartmentsByFaculty(selectedFacultyId);
          setDepartments(departmentList);
        }

        // Tìm departmentId từ tên nếu không có ID
        if (initialData.department?.id) {
          selectedDepartmentId = String(initialData.department.id);
        } else if (initialData.department?.name) {
          const matchedDepartment = departmentList.find(d => d.name === initialData.department.name);
          if (matchedDepartment) {
            selectedDepartmentId = String(matchedDepartment.id);
          }
        }

        // Gán formData
        setFormData({
          code: initialData.code || '',
          name: initialData.name || '',
          credits: initialData.credits || '',
          description: initialData.description || '',
          facultyId: selectedFacultyId,
          departmentId: selectedDepartmentId,
          type: initialData.type || ''
        });
      } else {
        // Reset form nếu đang ở chế độ thêm mới
        setFormData({
          code: '',
          name: '',
          credits: '',
          description: '',
          facultyId: '',
          departmentId: '',
          type: ''
        });
        setDepartments([]);
      }
    } catch (error) {
      console.error('Lỗi khi tải dropdown:', error);
    }
  };

  loadDropdowns();
}, [visible, initialData]);


  // Load lại bộ môn khi thay đổi khoa
  useEffect(() => {
    const loadDepartments = async () => {
      if (formData.facultyId) {
        try {
          const list = await getDepartmentsByFaculty(formData.facultyId);
          setDepartments(list);
        } catch (error) {
          console.error('Lỗi khi load bộ môn:', error);
        }
      } else {
        setDepartments([]);
        setFormData(prev => ({ ...prev, departmentId: '' }));
      }
    };

    loadDepartments();
  }, [formData.facultyId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const subjectDataToSave = {
      code: formData.code,
      name: formData.name,
      credits: formData.credits,
      description: formData.description,
      facultyId: formData.facultyId,
      departmentId: formData.departmentId,
      type: formData.type
    };

    if (initialData?.id) {
      await onSave(initialData.id, subjectDataToSave);
    } else {
      await onSave(null, subjectDataToSave);
    }

    onClose();
  };

  if (!visible) return null;

  return (
    <div className="modal-subject-overlay">
      <div className="modal-subject-content">
        <div className="modal-subject-header">
          <h2>{initialData ? 'CẬP NHẬT MÔN HỌC' : 'THÊM MÔN HỌC MỚI'}</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>

        <form className="subject-form" onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label>Mã môn học: *</label>
              <input name="code" value={formData.code} onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label>Tên môn học: *</label>
              <input name="name" value={formData.name} onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label>Số tín chỉ: *</label>
              <input name="credits" value={formData.credits} onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label>Khoa quản lý: *</label>
              <select name="facultyId" value={formData.facultyId} onChange={handleChange} required>
                <option value="">-- Chọn khoa phụ trách --</option>
                {faculties.map(faculty => (
                  <option key={faculty.id} value={String(faculty.id)}>{faculty.name}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Bộ môn quản lý: *</label>
              <select name="departmentId" value={formData.departmentId} onChange={handleChange} required>
                <option value="">-- Chọn bộ môn --</option>
                {departments.map(dept => (
                  <option key={dept.id} value={String(dept.id)}>{dept.name}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Loại môn học: *</label>
              <select name="type" value={formData.type} onChange={handleChange} required>
                <option value="">-- Chọn loại môn học --</option>
                <option value="Bắt buộc">Bắt buộc</option>
                <option value="Đại cương">Đại cương</option>
                <option value="Tự chọn">Tự chọn</option>
              </select>
            </div>
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

          <div className="form-actions">
            <button type="submit" className="submit-button">Xác nhận</button>
            <button type="button" className="cancel-button" onClick={onClose}>Hủy bỏ</button>
          </div>
        </form>
      </div>
    </div>
  );
};


export default SubjectForm;
