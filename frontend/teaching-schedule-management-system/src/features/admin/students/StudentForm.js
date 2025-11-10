import React, { useState, useEffect } from 'react';
import '../../../styles/StudentForm.css';
import { getFaculties, getAllUsers, getMajors } from '../../../api/ApiDropdown';


const SUBMIT_DATE_AS_ISO = false;


const toDateInputValue = (input) => {
  if (!input) return '';

  if (typeof input === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(input)) return input;


  const d = input instanceof Date ? input : new Date(input);
  if (Number.isNaN(d.getTime())) return '';

  const tzOffset = d.getTimezoneOffset();
  const local = new Date(d.getTime() - tzOffset * 60000);
  return local.toISOString().slice(0, 10);
};


const ymdToIsoStart = (ymd) => {
  if (!ymd) return null;
  const dt = new Date(`${ymd}T00:00:00`);
  return dt.toISOString();
};


const toIntOrNull = (v) => {
  const n = parseInt(v, 10);
  return Number.isFinite(n) ? n : null;
};


const asString = (v) => (v === null || v === undefined ? '' : String(v));


const stripDiacritics = (s = '') =>
  s.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
const sameName = (a = '', b = '') =>
  stripDiacritics(String(a).trim()).toLowerCase() ===
  stripDiacritics(String(b).trim()).toLowerCase();


const findIdByName = (list = [], name) => {
  if (!name) return '';
  const found = list.find((item) => sameName(item.name, name));
  return found ? String(found.id) : '';
};

const StudentForm = ({ visible, onClose, initialData, onSave }) => {
  const [formData, setFormData] = useState({
    userId: '',
    studentCode: '',
    fullName: '',
    phoneNumber: '',
    email: '',
    gender: '',
    dateOfBirth: '',
    className: '',
    enrollmentYear: '',
    facultyId: '',
    majorId: '',
  });

  const [faculties, setFaculties] = useState([]);
  const [majors, setMajors] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errMsg, setErrMsg] = useState('');

  useEffect(() => {
    if (!visible) return;

    let isMounted = true;

    const loadAll = async () => {
      try {
        setLoading(true);
        setErrMsg('');


        const [facultyList, majorList, userList] = await Promise.all([
          getFaculties(),
          getMajors(),
          getAllUsers(),
        ]);

        if (!isMounted) return;

        const facultiesSafe = Array.isArray(facultyList) ? facultyList : [];
        const majorsSafe = Array.isArray(majorList) ? majorList : [];
        const studentUsers = Array.isArray(userList)
          ? userList.filter((u) => u.role === 'STUDENT')
          : [];

        setFaculties(facultiesSafe);
        setMajors(majorsSafe);
        setUsersList(studentUsers);

      
        let selectedUserId = '';
        if (initialData) {
          if (initialData.user?.id) {
            const matched = studentUsers.find((u) => u.id === initialData.user.id);
            if (matched) selectedUserId = String(matched.id);
          } else if (initialData.userId) {
            const matched = studentUsers.find((u) => u.id === initialData.userId);
            selectedUserId = String(matched ? matched.id : initialData.userId);
          }
        }

        const resolvedFacultyId =
          initialData?.facultyId
            ? String(initialData.facultyId)
            : initialData?.faculty?.id
              ? String(initialData.faculty.id)
              : findIdByName(facultiesSafe, initialData?.faculty?.name);

        const resolvedMajorId =
          initialData?.majorId
            ? String(initialData.majorId)
            : initialData?.major?.id
              ? String(initialData.major.id)
              : findIdByName(majorsSafe, initialData?.major?.name);

        const normalized = {
          userId: selectedUserId || '',
          studentCode: asString(initialData?.studentCode),
          fullName: asString(initialData?.fullName),
          phoneNumber: asString(initialData?.phoneNumber),
          email: asString(initialData?.email),
          gender: asString(initialData?.gender),
          dateOfBirth: toDateInputValue(initialData?.dateOfBirth),
          className: asString(initialData?.className),
          enrollmentYear: initialData?.enrollmentYear ? String(initialData.enrollmentYear) : '',
          facultyId: resolvedFacultyId || '',
          majorId: resolvedMajorId || '',
        };

        setFormData((prev) => ({
          ...prev,
          ...(initialData ? normalized : prev),
        }));
      } catch (err) {
        console.error('Lỗi khi tải dropdown:', err);
        if (isMounted) setErrMsg('Không thể tải dữ liệu. Vui lòng thử lại.');
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadAll();
    return () => {
      isMounted = false;
    };
  }, [visible, initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'enrollmentYear') {
      const onlyDigits = value.replace(/[^\d]/g, '');
      setFormData((prev) => ({ ...prev, [name]: onlyDigits }));
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    const dobForSubmit = SUBMIT_DATE_AS_ISO
      ? ymdToIsoStart(formData.dateOfBirth)
      : formData.dateOfBirth || null;

    const payload = {
      studentCode: formData.studentCode?.trim(),
      fullName: formData.fullName?.trim(),
      gender: formData.gender || null,
      dateOfBirth: dobForSubmit,
      email: formData.email?.trim(),
      phoneNumber: formData.phoneNumber?.trim(),
      className: formData.className?.trim(),
      enrollmentYear: toIntOrNull(formData.enrollmentYear),
      facultyId: toIntOrNull(formData.facultyId),
      majorId: toIntOrNull(formData.majorId),
      userId: toIntOrNull(formData.userId),
    };

    try {
      if (initialData?.id) {
        await onSave(initialData.id, payload);
      } else {
        await onSave(null, payload);
      }
      onClose();
    } catch (err) {
      console.error('Lỗi khi lưu sinh viên:', err);
      setErrMsg('Không thể lưu dữ liệu. Vui lòng kiểm tra và thử lại.');
    }
  };

  if (!visible) return null;

  return (
    <div className="modal-student-overlay">
      <div className="modal-student-content">
        <div className="modal-student-header">
          <h2>{initialData ? 'CẬP NHẬT SINH VIÊN' : 'THÊM SINH VIÊN MỚI'}</h2>
          <button className="close-button" onClick={onClose} aria-label="Đóng">×</button>
        </div>

        <form className="student-form" onSubmit={handleSubmit}>
          {errMsg && <div className="form-error">{errMsg}</div>}

          <div className="form-grid">
            <div className="form-group">
              <label>Tài khoản (User): *</label>
              {loading ? (
                <p>Đang tải danh sách tài khoản...</p>
              ) : (
                <select
                  name="userId"
                  value={formData.userId}
                  onChange={handleChange}
                  required
                  disabled={loading || usersList.length === 0}
                >
                  <option value="">-- Chọn tài khoản --</option>
                  {usersList.map((user) => (
                    <option key={user.id} value={String(user.id)}>
                      {user.username}
                    </option>
                  ))}
                </select>
              )}
            </div>

            <div className="form-group">
              <label>Mã sinh viên: *</label>
              <input
                name="studentCode"
                value={formData.studentCode}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Họ tên: *</label>
              <input
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Số điện thoại: *</label>
              <input
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                required
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
              />
            </div>

            <div className="form-group">
              <label>Giới tính: *</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                required
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
                value={formData.dateOfBirth || ''}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Lớp: *</label>
              <input
                name="className"
                value={formData.className}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Năm nhập học: *</label>
              <input
                type="number"
                name="enrollmentYear"
                value={formData.enrollmentYear}
                onChange={handleChange}
                required
                min="1900"
                max="2100"
                inputMode="numeric"
              />
            </div>

            <div className="form-group">
              <label>Khoa: *</label>
              <select
                name="facultyId"
                value={formData.facultyId}
                onChange={handleChange}
                required
                disabled={loading || faculties.length === 0}
              >
                <option value="">-- Chọn khoa --</option>
                {faculties.map((faculty) => (
                  <option key={faculty.id} value={String(faculty.id)}>
                    {faculty.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Chuyên ngành: *</label>
              <select
                name="majorId"
                value={formData.majorId}
                onChange={handleChange}
                required
                disabled={loading || majors.length === 0}
              >
                <option value="">-- Chọn chuyên ngành --</option>
                {majors.map((major) => (
                  <option key={major.id} value={String(major.id)}>
                    {major.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="submit-button" disabled={loading}>
              {loading ? 'Đang xử lý...' : 'Xác nhận'}
            </button>
            <button type="button" className="cancel-button" onClick={onClose}>
              Hủy bỏ
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StudentForm;
