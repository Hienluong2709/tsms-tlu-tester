import React, { useEffect, useState} from 'react';
import { FaTrashAlt, FaEdit, FaInfoCircle, FaSearch } from 'react-icons/fa';
import '../../../styles/SemesterList.css';
import SemesterDetail from './SemesterDetail';
import SemesterForm from './SemesterForm';
import { getAllSemesters, createSemester, getSemesterById, deleteSemester, updateSemester } from '../../../api/SemesterApi';

const SemesterList = () => {
  const [openForm, setOpenForm] = useState(false);
  const [semesters, setSemesters] = useState([]);

  const [openDetail, setOpenDetail] = useState(false);
  const [selectedSemester, setSelectedSemester] = useState(null); 
  const [editingSemester, setEditingSemester] = useState(null); 


  const fetchSemesters = async () => {
    try {
      const data = await getAllSemesters();
      setSemesters(data);
    } catch (error) {
      console.error('❌ Lỗi khi tải danh sách học kỳ:', error);
    }
  };

  useEffect(() => {
    fetchSemesters();
  }, []);

const handleSaveSemester = async (data) => {
  try {
    if (data.id) {
      await updateSemester(data.id, data);
    } else {
      await createSemester(data);
    }
    await fetchSemesters(); 
    setOpenForm(false);    
    setEditingSemester(null);
  } catch (error) {
    console.error("Lỗi khi lưu học kỳ:", error.response?.data || error.message);
  }
};


  const handleView = async (semesterToList) => {
    try {
      const fullSemesterDetails = await getSemesterById(semesterToList.id);
      setSelectedSemester(fullSemesterDetails);
      setOpenDetail(true);
    } catch (error) {
      console.error('❌ Lỗi khi tải chi tiết học kỳ:', error);
    }
  };

  const handleEdit = async (semesterToList) => {
    try {
      const fullSemesterDetails = await getSemesterById(semesterToList.id);
      console.log("Full Semester Details for Edit:", fullSemesterDetails);
      setEditingSemester(fullSemesterDetails);
      setOpenForm(true);
    } catch (error) {
      console.error('❌ Lỗi khi tải chi tiết học kỳ để chỉnh sửa:', error);
      alert("Không thể tải thông tin học kỳ để chỉnh sửa.");
    }
  };


  const handleSemesterDelete = async (semesterId) => {
    const confirmDelete = window.confirm("Bạn có chắc chắn muốn xóa học kỳ này không?");
    if (confirmDelete) {
      try {
        await deleteSemester(semesterId);
        await fetchSemesters();
        alert("Học kỳ đã được xóa thành công!");
      } catch (error) {
        console.error('❌ Lỗi khi xóa học kỳ:', error);
        alert("Có lỗi xảy ra khi xóa học kỳ .");
      }
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
  };

  return (
    <div className="semester-container">
      <div className="semester-header">
        <button className="add-button" onClick={() => {
          setEditingSemester(null);
          setOpenForm(true);
        }}>
          Thêm học kỳ
        </button>
        <div className="search-container">
          <input type="text" placeholder="Tìm kiếm" className="search-box" />
          <FaSearch className="search-icon" />
        </div>
      </div>

      <SemesterDetail
        open={openDetail}
        semester={selectedSemester}
        onClose={() => {
          setOpenDetail(false);
          setSelectedSemester(null);
        }}
      />

      <SemesterForm
        visible={openForm}
        onClose={() => {
          setOpenForm(false);
          setEditingSemester(null);
        }}
        initialData={editingSemester}
        onSave={handleSaveSemester} 
      />

      <table className="semester-table">
        <thead>
          <tr>
            <th>STT</th>
            <th>Tên học kỳ</th>
            <th>Năm học</th>
            <th>Ngày bắt đầu</th>
            <th>Ngày kết thúc</th>
            <th>Trạng thái</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {semesters.map((semester, index) => (
            <tr key={semester.id}>
              <td>{index + 1}</td>
              <td>{semester.name}</td>
              <td>{semester.academicYear}</td>
              <td>{formatDate(semester.startDate)}</td>
              <td>{formatDate(semester.endDate)}</td>
              <td>{semester.status}</td>
              <td className="actions">
                <FaInfoCircle
                  className="icon info"
                  title="Chi tiết"
                  onClick={() => handleView(semester)}
                />
                <FaEdit
                  className="icon edit"
                  title="Chỉnh sửa"
                  onClick={() => handleEdit(semester)}
                />
                <FaTrashAlt
                  className="icon delete"
                  title="Xóa"
                  onClick={() => handleSemesterDelete(semester.id)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="footer">
        <div>Hiển thị {semesters.length} kết quả</div>
        <div className="pagination">
          <select>
            <option>10</option>
            <option>25</option>
            <option>50</option>
          </select>
          <span>Từ 1 đến {semesters.length} bản ghi</span>
          <button>&lt;</button>
          <button>&gt;</button>
        </div>
      </div>
    </div>
  );
};

export default SemesterList;