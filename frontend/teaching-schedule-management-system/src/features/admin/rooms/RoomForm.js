import React, { useState, useEffect } from 'react';
import '../../../styles/RoomForm.css'; 

const RoomForm = ({ visible, onClose, initialData, onSave }) => {
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    building: '',
    floor: '',
    capacity: '',
    type: '',
    status: '',
    description: '',
  });

useEffect(() => {
  if (initialData) {
    console.log("📌 Initial Data received:", initialData);
    setFormData(initialData); 
  } else {
    setFormData({
      code: '',
      name: '',
      building: '',
      floor: '',
      capacity: '',
      type: '',
      status: '',
      description: '',
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
    console.log("📌 Thêm phòng học:", formData);
    onSave(formData); 
    };


  if (!visible) return null;

  return (
    <div className="modal-room-overlay">
      <div className="modal-room-content">
        <div className="modal-room-header">
          <h2>{initialData ? 'Chỉnh sửa phòng học' : 'Thêm phòng học'}</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>

        <form className="room-form" onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label>Mã phòng</label>
              <input
                type="text"
                name="code"
                value={formData.code}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Tên phòng</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Toà nhà</label>
              <input
                type="text"
                name="building"
                value={formData.building}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Tầng</label>
              <input
                type="text"
                name="floor"
                value={formData.floor}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Sức chứa</label>
              <input
                type="text"
                name="capacity"
                value={formData.capacity}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Loại phòng: *</label>
              <select name="type" value={formData.type} onChange={handleChange} required>
                <option value="">-- Chọn loại phòng --</option>
                <option value="Lý thuyết">Lý thuyết</option>
                <option value="Thực hành">Thực hành</option>
                <option value="Máy tính">Máy tính</option>
                <option value="Hội thảo">Hội thảo</option>
                <option value="Khác">Khác</option>
              </select>
            </div>

            <div className="form-group">
              <label>Trạng thái: *</label>
              <select name="status" value={formData.status} onChange={handleChange} required>
                <option value="">-- Chọn trạng thái --</option>
                <option value="Hoạt động">Hoạt động</option>
                <option value="Bảo trì">Bảo trì</option>
                <option value="Không sử dụng">Không sử dụng</option>
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

export default RoomForm;
