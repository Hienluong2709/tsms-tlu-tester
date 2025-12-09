import React, { useState, useEffect } from 'react';
import '../../../styles/SemesterForm.css';

// Lưu ý: Bạn cần truyền thêm prop 'existingSemesters' (danh sách các học kỳ đang có) 
// từ component cha vào đây để kiểm tra trùng lặp.
const SemesterForm = ({ visible, onClose, initialData, onSave, existingSemesters = [] }) => {
  const [formData, setFormData] = useState({
    name: '',
    academicYear: '',
    startDate: '',
    endDate: '',
    status: '',
  });

  // State lưu trữ lỗi của từng trường
  const [errors, setErrors] = useState({
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
    // Reset lỗi khi mở lại form hoặc đổi dữ liệu
    setErrors({
      name: '',
      academicYear: '',
      startDate: '',
      endDate: '',
      status: '',
    });
  }, [initialData, visible]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // (Tùy chọn) Xóa lỗi của trường đó ngay khi người dùng bắt đầu sửa
    setErrors((prev) => ({
      ...prev,
      [name]: '',
    }));
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = { ...errors };
    
    // 1. Validate Tên học kỳ
    const nameTrimmed = formData.name ? String(formData.name).trim() : '';
    if (!nameTrimmed) {
      newErrors.name = "Tên học kỳ không được bỏ trống";
      isValid = false;
    } else {
      // Kiểm tra trùng: Cùng tên VÀ cùng năm học
      const isDuplicate = existingSemesters.some(sem => 
        sem.name.toLowerCase() === nameTrimmed.toLowerCase() && 
        sem.academicYear === formData.academicYear &&
        sem.id !== (initialData ? initialData.id : null) // Bỏ qua chính nó nếu đang edit
      );
      
      if (isDuplicate) {
        newErrors.name = "Tên học kỳ đã tồn tại trong năm học này";
        isValid = false;
      } else {
        newErrors.name = "";
      }
    }

    // 2. Validate Năm học
    const yearTrimmed = formData.academicYear ? String(formData.academicYear).trim() : '';
    const yearFormat = /^\d{4}-\d{4}$/; // Regex: XXXX-XXXX
    
    if (!yearTrimmed) {
      newErrors.academicYear = "Năm học không được bỏ trống";
      isValid = false;
    } else if (!yearFormat.test(yearTrimmed)) {
      newErrors.academicYear = "Năm học không đúng định dạng (VD: 2025-2026)";
      isValid = false;
    } else {
      newErrors.academicYear = "";
    }

    // 3. Validate Ngày bắt đầu
    if (!formData.startDate) {
      newErrors.startDate = "Ngày bắt đầu không được bỏ trống";
      isValid = false;
    } else {
      // Logic kiểm tra ngày bắt đầu có khớp với năm học không
      if (yearTrimmed && yearFormat.test(yearTrimmed)) {
        const startYearOfTerm = parseInt(yearTrimmed.split('-')[0]);
        const dateYear = new Date(formData.startDate).getFullYear();
        // Cho phép chênh lệch +/- 1 năm (tùy chỉnh logic này nếu cần chặt chẽ hơn)
        if (dateYear < startYearOfTerm - 1 || dateYear > startYearOfTerm + 1) {
             newErrors.startDate = "Ngày bắt đầu không hợp lệ (quá xa so với năm học)";
             isValid = false;
        } else {
             newErrors.startDate = "";
        }
      } else {
        newErrors.startDate = "";
      }
    }

    // 4. Validate Ngày kết thúc
    if (!formData.endDate) {
      newErrors.endDate = "Ngày kết thúc không được bỏ trống";
      isValid = false;
    } else if (formData.startDate && new Date(formData.endDate) <= new Date(formData.startDate)) {
      newErrors.endDate = "Ngày kết thúc phải sau Ngày bắt đầu";
      isValid = false;
    } else {
      newErrors.endDate = "";
    }

    // 5. Validate Trạng thái
    if (!formData.status) {
      newErrors.status = "Vui lòng chọn trạng thái học kỳ";
      isValid = false;
    } else {
      newErrors.status = "";
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Hệ thống hiển thị thông báo thành công
      alert("Thêm học kỳ thành công");
      // Lưu dữ liệu
      onSave(formData);
    }
  };

  if (!visible) return null;

  // Style inline cho message lỗi để đảm bảo hiển thị đỏ mà không cần sửa CSS
  const errorStyle = { color: 'red', fontSize: '0.85rem', marginTop: '5px', display: 'block' };

  return (
    <div className="modal-semester-overlay">
      <div className="modal-semester-content">
        <div className="modal-semester-header">
          <h2>{initialData ? 'Chỉnh sửa học kỳ' : 'Thêm học kỳ'}</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>

        <form className="semester-form" onSubmit={handleSubmit}>
          <div className="form-grid">
            {/* Tên học kỳ */}
            <div className="form-group">
              <label>Tên học kỳ</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                // Bỏ required của HTML để dùng validation JS tùy chỉnh
              />
              {errors.name && <span style={errorStyle}>{errors.name}</span>}
            </div>

            {/* Năm học */}
            <div className="form-group">
              <label>Năm học</label>
              <input
                type="text"
                name="academicYear"
                value={formData.academicYear}
                onChange={handleChange}
                placeholder="VD: 2025-2026"
              />
              {errors.academicYear && <span style={errorStyle}>{errors.academicYear}</span>}
            </div>

            {/* Ngày bắt đầu */}
            <div className="form-group">
              <label>Ngày bắt đầu</label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
              />
              {errors.startDate && <span style={errorStyle}>{errors.startDate}</span>}
            </div>

            {/* Ngày kết thúc */}
            <div className="form-group">
              <label>Ngày kết thúc</label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
              />
              {errors.endDate && <span style={errorStyle}>{errors.endDate}</span>}
            </div>

            {/* Trạng thái */}
            <div className="form-group">
              <label>Trạng thái: *</label>
              <select name="status" value={formData.status} onChange={handleChange}>
                <option value="">-- Chọn trạng thái --</option>
                <option value="Đang diễn ra">Đang diễn ra</option>
                <option value="Chưa diễn ra">Chưa diễn ra</option>
              </select>
              {errors.status && <span style={errorStyle}>{errors.status}</span>}
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