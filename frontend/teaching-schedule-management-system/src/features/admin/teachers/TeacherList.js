import React, { useEffect, useState} from 'react';
import { FaTrashAlt, FaEdit, FaInfoCircle, FaSearch } from 'react-icons/fa';
import '../../../styles/TeacherList.css';
import TeacherDetail from './TeacherDetail';
import TeacherForm from './TeacherForm';
import { getAllTeachers, createTeacher, getTeacherById, deleteTeacher, updateTeacher } from '../../../api/TeacherApi';

const TeacherList = () => {
  const [openForm, setOpenForm] = useState(false);
  const [teachers, setTeachers] = useState([]);

  const [openDetail, setOpenDetail] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState(null); 
  const [editingTeacher, setEditingTeacher] = useState(null); 


  const fetchTeachers = async () => {
    try {
      const data = await getAllTeachers();
      setTeachers(data);
    } catch (error) {
      console.error('❌ Lỗi khi tải danh sách giảng viên:', error);
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  const handleSaveTeacher = async (id, teacherData) => {
    try {
      if (id) {
        await updateTeacher(id, teacherData);
        alert("Cập nhật giảng viên thành công!");
      } else {
        await createTeacher(teacherData);
        alert("Thêm giảng viên thành công!");
      }
      await fetchTeachers(); 
    } catch (error) {
      console.error('❌ Lỗi khi lưu giảng viên:', error);
      alert("Có lỗi xảy ra khi lưu giảng viên.");
    }
    setOpenForm(false); 
    setEditingTeacher(null); 
  };



  const handleView = async (teacherToList) => {
    try {
      const fullTeacherDetails = await getTeacherById(teacherToList.id);
      setSelectedTeacher(fullTeacherDetails);
      setOpenDetail(true);
    } catch (error) {
      console.error('❌ Lỗi khi tải chi tiết giảng viên:', error);
    }
  };

  const handleEdit = async (teacherToList) => {
    try {
      const fullTeacherDetails = await getTeacherById(teacherToList.id);
      console.log("Full Teacher Details for Edit:", fullTeacherDetails);
      setEditingTeacher(fullTeacherDetails);
      setOpenForm(true); 
    } catch (error) {
      console.error('❌ Lỗi khi tải chi tiết giảng viên để chỉnh sửa:', error);
      alert("Không thể tải thông tin giảng viên để chỉnh sửa.");
    }
  };


  const handleTeacherDelete = async (teacherId) => {
    const confirmDelete = window.confirm("Bạn có chắc chắn muốn xóa giảng viên này không?");
    if (confirmDelete) {
      try {
        await deleteTeacher(teacherId);
        await fetchTeachers();
        alert("Giảng viên đã được xóa thành công!");
      } catch (error) {
        console.error('❌ Lỗi khi xóa giảng viên:', error);
        alert("Có lỗi xảy ra khi xóa giảng viên.");
      }
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
  };

  return (
    <div className="teacher-container">
      <div className="teacher-header">
        <button className="add-button" onClick={() => {
          setEditingTeacher(null);
          setOpenForm(true);
        }}>
          Thêm giảng viên
        </button>
        <div className="search-container">
          <input type="text" placeholder="Tìm kiếm" className="search-box" />
          <FaSearch className="search-icon" />
        </div>
      </div>

      <TeacherDetail
        open={openDetail}
        teacher={selectedTeacher}
        onClose={() => {
          setOpenDetail(false);
          setSelectedTeacher(null);
        }}
      />

      <TeacherForm
        visible={openForm}
        onClose={() => {
          setOpenForm(false);
          setEditingTeacher(null); 
        }}
        initialData={editingTeacher} 
        onSave={handleSaveTeacher} 
      />

      <table className="teacher-table">
        <thead>
          <tr>
            <th>STT</th>
            <th>Mã giảng viên</th>
            <th>Họ tên</th>
            <th>Ngày sinh</th>
            <th>Email</th>
            <th>Số điện thoại</th>
            <th>Bộ môn</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {teachers.map((teacher, index) => (
            <tr key={teacher.id}>
              <td>{index + 1}</td>
              <td>{teacher.teacherCode}</td>
              <td>{teacher.fullName}</td>
              <td>{formatDate(teacher.dateOfBirth)}</td>
              <td>{teacher.email}</td>
              <td>{teacher.phoneNumber}</td>
              <td>{teacher.department?.name || 'Chưa phân công'}</td>
              <td className="actions">
                <FaInfoCircle
                  className="icon info"
                  title="Chi tiết"
                  onClick={() => handleView(teacher)}
                />
                <FaEdit
                  className="icon edit"
                  title="Chỉnh sửa"
                  onClick={() => handleEdit(teacher)} 
                />
                <FaTrashAlt
                  className="icon delete"
                  title="Xóa"
                  onClick={() => handleTeacherDelete(teacher.id)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="footer">
        <div>Hiển thị {teachers.length} kết quả</div>
        <div className="pagination">
          <select>
            <option>10</option>
            <option>25</option>
            <option>50</option>
          </select>
          <span>Từ 1 đến {teachers.length} bản ghi</span>
          <button>&lt;</button>
          <button>&gt;</button>
        </div>
      </div>
    </div>
  );
};

export default TeacherList;