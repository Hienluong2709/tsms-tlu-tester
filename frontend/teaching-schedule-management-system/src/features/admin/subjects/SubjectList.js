import React, { useEffect, useState} from 'react';
import { FaTrashAlt, FaEdit, FaInfoCircle, FaSearch } from 'react-icons/fa';
import '../../../styles/SubjectList.css';
import SubjectDetail from './SubjectDetail';
import SubjectForm from './SubjectForm';
import { getAllSubjects,getSubjectById,updateSubject,createSubject,deleteSubject} from '../../../api/SubjectApi';

const SubjectList = () => {
  const [openForm, setOpenForm] = useState(false);
  const [subjects, setSubjects] = useState([]);

  const [openDetail, setOpenDetail] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [editingSubject, setEditingSubject] = useState(null);


  const fetchSubjects = async () => {
    try {
      const data = await getAllSubjects();
      setSubjects(data);
    } catch (error) {
      console.error('❌ Lỗi khi tải danh sách môn học:', error);
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

  const handleSaveSubject = async (id, subjectData) => {
    try {
      if (id) {
        await updateSubject(id, subjectData);
        alert("Cập nhật môn học thành công!");
      } else {
        await createSubject(subjectData);
        alert("Thêm môn học thành công!");
      }
      await fetchSubjects();
    } catch (error) {
      console.error('❌ Lỗi khi lưu môn học:', error);
      alert("Có lỗi xảy ra khi lưu môn học.");
    }
    setOpenForm(false);
    setEditingSubject(null);
  };



  const handleView = async (subjectToList) => {
    try {
      const fullSubjectDetails = await getSubjectById(subjectToList.id);
      setSelectedSubject(fullSubjectDetails);
      setOpenDetail(true);
    } catch (error) {
      console.error('❌ Lỗi khi tải chi tiết môn học:', error);
    }
  };

  const handleEdit = async (subjectToList) => {
    try {
      const fullSubjectDetails = await getSubjectById(subjectToList.id);
      console.log("Full Subject Details for Edit:", fullSubjectDetails);
      setEditingSubject(fullSubjectDetails);
      setOpenForm(true);
    } catch (error) {
      console.error('❌ Lỗi khi tải chi tiết môn học để chỉnh sửa:', error);
      alert("Không thể tải thông tin môn học để chỉnh sửa.");
    }
  };


  const handleSubjectDelete = async (subjectId) => {
    const confirmDelete = window.confirm("Bạn có chắc chắn muốn xóa giảng viên này không?");
    if (confirmDelete) {
      try {
        await deleteSubject(subjectId);
        await fetchSubjects();
        alert("Môn học đã được xóa thành công!");
      } catch (error) {
        console.error('❌ Lỗi khi xóa môn học:', error);
        alert("Có lỗi xảy ra khi xóa môn học.");
      }
    }
  };

  return (
    <div className="subject-container">
      <div className="subject-header">
        <button className="add-button" onClick={() => {
          setEditingSubject(null);
          setOpenForm(true);
        }}>
          Thêm môn học
        </button>
        <div className="search-container">
          <input type="text" placeholder="Tìm kiếm" className="search-box" />
          <FaSearch className="search-icon" />
        </div>
      </div>

      <SubjectDetail
        open={openDetail}
        subject={selectedSubject}
        onClose={() => {
          setOpenDetail(false);
          setSelectedSubject(null);
        }}
      />

      <SubjectForm
        visible={openForm}
        onClose={() => {
          setOpenForm(false);
          setEditingSubject(null);
        }}
        initialData={editingSubject}
        onSave={handleSaveSubject}
      />

      <table className="subject-table">
        <thead>
          <tr>
            <th>STT</th>
            <th>Mã môn học</th>
            <th>Tên môn học</th>
            <th>Số tín chỉ</th>
            <th>Khoa</th>
            <th>Loại môn học</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {subjects.map((subject, index) => (
            <tr key={subject.id}>
              <td>{index + 1}</td>
              <td>{subject.code}</td>
              <td>{subject.name}</td>
              <td>{subject.credits}</td>
              <td>{subject.faculty?.name || 'Chưa phân công'}</td>
              <td>{subject.type}</td>
              <td className="actions">
                <FaInfoCircle
                  className="icon info"
                  title="Chi tiết"
                  onClick={() => handleView(subject)}
                />
                <FaEdit
                  className="icon edit"
                  title="Chỉnh sửa"
                  onClick={() => handleEdit(subject)}
                />
                <FaTrashAlt
                  className="icon delete"
                  title="Xóa"
                  onClick={() => handleSubjectDelete(subject.id)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="footer">
        <div>Hiển thị {subjects.length} kết quả</div>
        <div className="pagination">
          <select>
            <option>10</option>
            <option>25</option>
            <option>50</option>
          </select>
          <span>Từ 1 đến {subjects.length} bản ghi</span>
          <button>&lt;</button>
          <button>&gt;</button>
        </div>
      </div>
    </div>
  );
};

export default SubjectList;