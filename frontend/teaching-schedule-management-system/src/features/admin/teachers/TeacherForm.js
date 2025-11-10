import React, { useState, useEffect, useCallback } from 'react';
import '../../../styles/TeacherForm.css';
import { getFaculties, getDepartmentsByFaculty, getAllUsers } from '../../../api/ApiDropdown';

const TeacherForm = ({ visible, onClose, initialData, onSave }) => {
  const [formData, setFormData] = useState({
    userId: '',
    teacherCode: '',
    fullName: '',
    gender: '',
    dateOfBirth: '',
    email: '',
    phoneNumber: '',
    facultyId: '',
    departmentId: '',
    status: '',
  });

  const [faculties, setFaculties] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [loading, setLoading] = useState(false);

  // Hàm load departments riêng biệt
  const loadDepartments = useCallback(async (facultyId) => {
    console.log('=== LOAD DEPARTMENTS ===');
    console.log('facultyId:', facultyId);
    
    if (!facultyId) {
      console.log('Không có facultyId, clear departments');
      setDepartments([]);
      return;
    }

    try {
      setLoading(true);
      console.log('Gọi API getDepartmentsByFaculty với facultyId:', facultyId);
      const list = await getDepartmentsByFaculty(facultyId);
      console.log('Departments response:', list);
      setDepartments(list || []);
    } catch (error) {
      console.error('Lỗi khi load bộ môn:', error);
      setDepartments([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!visible) return;

    console.log('=== LOADING INITIAL DATA ===');
    console.log('visible:', visible);
    console.log('initialData:', initialData);
    console.log('initialData JSON:', JSON.stringify(initialData, null, 2));
    console.log('initialData structure:', JSON.stringify(initialData, null, 2));

    const loadInitialData = async () => {
      try {
        setLoading(true);
        
        console.log('Bắt đầu load faculties và users...');
        
        const [facultyList, userList] = await Promise.all([
          getFaculties(),
          getAllUsers()
        ]);

        console.log('Faculty list loaded:', facultyList);
        console.log('User list loaded:', userList);

        setFaculties(facultyList || []);
        
        const teacherUsers = userList ? userList.filter(u => u.role === 'TEACHER') : [];
        setUsersList(teacherUsers);

        if (initialData) {
          console.log('Chế độ sửa - initialData structure:', {
            facultyName: initialData.faculty?.name,
            departmentName: initialData.department?.name
          });
          
          const selectedFaculty = facultyList.find(f => f.name === initialData.faculty?.name);
          const facultyId = selectedFaculty?.id;
          
          console.log('Found faculty:', selectedFaculty);
          console.log('Faculty ID:', facultyId);

          let initialDepartments = [];
          let departmentId = null;
          
          if (facultyId) {
            try {
              console.log('Đang load departments cho facultyId:', facultyId);
              initialDepartments = await getDepartmentsByFaculty(facultyId);
              console.log('Departments loaded:', initialDepartments);
              setDepartments(initialDepartments || []);
              
              const selectedDepartment = initialDepartments.find(d => d.name === initialData.department?.name);
              departmentId = selectedDepartment?.id;
              console.log('Found department:', selectedDepartment);
              console.log('Department ID:', departmentId);
            } catch (error) {
              console.error('Lỗi khi load departments cho initialData:', error);
              setDepartments([]);
            }
          }

          const selectedUserId = teacherUsers.find(u => 
            u.id === initialData.user?.id || u.id === initialData.userId
          )?.id;

          console.log('Selected userId:', selectedUserId);

          const newFormData = {
            userId: selectedUserId ? String(selectedUserId) : '',
            teacherCode: initialData.teacherCode || '',
            fullName: initialData.fullName || '',
            gender: initialData.gender || '',
            dateOfBirth: initialData.dateOfBirth ? initialData.dateOfBirth.slice(0, 10) : '',
            email: initialData.email || '',
            phoneNumber: initialData.phoneNumber || '',
            facultyId: facultyId ? String(facultyId) : '',
            departmentId: departmentId ? String(departmentId) : '',
            status: initialData.status || '',
          };

          console.log('Setting form data with found IDs:', newFormData);
          setFormData(newFormData);
        } else {
          console.log('Chế độ thêm mới');
          setFormData({
            userId: '',
            teacherCode: '',
            fullName: '',
            gender: '',
            dateOfBirth: '',
            email: '',
            phoneNumber: '',
            facultyId: '',
            departmentId: '',
            status: '',
          });
          setDepartments([]);
        }
      } catch (error) {
        console.error('Lỗi khi tải dữ liệu ban đầu:', error);
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, [visible, initialData]); 

  useEffect(() => {
    console.log('=== FACULTIES EFFECT TRIGGERED ===');
    console.log('formData.facultyId:', formData.facultyId);
    
    if (formData.facultyId && faculties.length > 0) {
      loadDepartments(formData.facultyId);
    }
  }, [formData.facultyId, loadDepartments, faculties.length]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    setFormData(prevData => {
      const newFormData = {
        ...prevData,
        [name]: value,
      };

      if (name === 'facultyId') {
        newFormData.departmentId = '';
      }

      return newFormData;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const teacherDataToSave = {
        teacherCode: formData.teacherCode,
        fullName: formData.fullName,
        gender: formData.gender,
        dateOfBirth: formData.dateOfBirth,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        facultyId: parseInt(formData.facultyId),
        departmentId: parseInt(formData.departmentId),
        userId: parseInt(formData.userId),
        status: formData.status,
      };

      if (initialData?.id) {
        await onSave(initialData.id, teacherDataToSave);
      } else {
        await onSave(null, teacherDataToSave);
      }

      onClose();
    } catch (error) {
      console.error('Lỗi khi lưu dữ liệu:', error);
    }
  };

  if (!visible) return null;

  return (
    <div className="modal-teacher-overlay">
      <div className="modal-teacher-content">
        <div className="modal-teacher-header">
          <h2>{initialData ? 'CẬP NHẬT GIẢNG VIÊN' : 'THÊM GIẢNG VIÊN MỚI'}</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>

        <form className="teacher-form" onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label>Tài khoản (User): *</label>
              <select
                name="userId"
                value={formData.userId}
                onChange={handleChange}
                required
                disabled={loading}
              >
                <option value="">-- Chọn tài khoản --</option>
                {usersList.map(user => (
                  <option key={user.id} value={String(user.id)}>
                    {user.username}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Mã giảng viên: *</label>
              <input 
                name="teacherCode" 
                value={formData.teacherCode} 
                onChange={handleChange} 
                required 
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label>Họ tên: *</label>
              <input 
                name="fullName" 
                value={formData.fullName} 
                onChange={handleChange} 
                required 
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label>Giới tính: *</label>
              <select 
                name="gender" 
                value={formData.gender} 
                onChange={handleChange} 
                required
                disabled={loading}
              >
                <option value="">-- Chọn giới tính --</option>
                <option value="Nam">Nam</option>
                <option value="Nữ">Nữ</option>
              </select>
            </div>

            <div className="form-group">
              <label>Ngày sinh: *</label>
              <input 
                type="date" 
                name="dateOfBirth" 
                value={formData.dateOfBirth} 
                onChange={handleChange} 
                required 
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label>Email: *</label>
              <input 
                type="email" 
                name="email" 
                value={formData.email} 
                onChange={handleChange} 
                required 
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label>Số điện thoại: *</label>
              <input 
                name="phoneNumber" 
                value={formData.phoneNumber} 
                onChange={handleChange} 
                required 
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label>Khoa quản lý: *</label>
              <select 
                name="facultyId" 
                value={formData.facultyId} 
                onChange={handleChange} 
                required
                disabled={loading}
              >
                <option value="">-- Chọn khoa phụ trách --</option>
                {faculties.map(faculty => (
                  <option key={faculty.id} value={String(faculty.id)}>
                    {faculty.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Bộ môn quản lý: *</label>
              <select 
                name="departmentId" 
                value={formData.departmentId} 
                onChange={handleChange} 
                required
                disabled={loading || !formData.facultyId}
              >
                <option value="">
                  {loading ? "Đang tải..." : "-- Chọn bộ môn --"}
                </option>
                {departments.map(dept => (
                  <option key={dept.id} value={String(dept.id)}>
                    {dept.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Trạng thái: *</label>
              <select 
                name="status" 
                value={formData.status} 
                onChange={handleChange} 
                required
                disabled={loading}
              >
                <option value="">-- Chọn trạng thái --</option>
                <option value="ACTIVE">Hoạt động</option>
                <option value="INACTIVE">Tạm nghỉ</option>
              </select>
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="submit-button" disabled={loading}>
              {loading ? "Đang xử lý..." : "Xác nhận"}
            </button>
            <button type="button" className="cancel-button" onClick={onClose} disabled={loading}>
              Hủy bỏ
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TeacherForm;