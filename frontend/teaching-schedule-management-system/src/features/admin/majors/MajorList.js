import React, { useEffect, useState} from 'react';
import { FaTrashAlt, FaEdit, FaInfoCircle, FaSearch } from 'react-icons/fa';
import '../../../styles/MajorList.css';
import MajorDetail from './MajorDetail';
import MajorForm from './MajorForm';
import { getAllMajors,getMajorById,updateMajor,createMajor,deleteMajor} from '../../../api/MajorApi';

const MajorList = () => {
  const [openForm, setOpenForm] = useState(false);
  const [majors, setMajors] = useState([]);

  const [openDetail, setOpenDetail] = useState(false);
  const [selectedMajor, setSelectedMajor] = useState(null);
  const [editingMajor, setEditingMajor] = useState(null);


  const fetchMajors = async () => {
    try {
      const data = await getAllMajors();
      setMajors(data);
    } catch (error) {
      console.error('❌ Lỗi khi tải danh sách chuyên ngành:', error);
    }
  };

  useEffect(() => {
    fetchMajors();
  }, []);

  const handleSaveMajor = async (id, majorData) => {
    try {
      if (id) {
        await updateMajor(id, majorData);
        alert("Cập nhật chuyên ngành thành công!");
      } else {
        await createMajor(majorData);
        alert("Thêm chuyên ngành thành công!");
      }
      await fetchMajors();
    } catch (error) {
      console.error('❌ Lỗi khi lưu chuyên ngành:', error);
      alert("Có lỗi xảy ra khi lưu chuyên ngành.");
    }
    setOpenForm(false);
    setEditingMajor(null);
  };



  const handleView = async (majorToList) => {
    try {
      const fullMajorDetails = await getMajorById(majorToList.id);
      setSelectedMajor(fullMajorDetails);
      setOpenDetail(true);
    } catch (error) {
      console.error('❌ Lỗi khi tải chi tiết chuyên ngành:', error);
    }
  };

  const handleEdit = async (majorToList) => {
    try {
      const fullMajorDetails = await getMajorById(majorToList.id);
      console.log("Full Major Details for Edit:", fullMajorDetails);
      setEditingMajor(fullMajorDetails);
      setOpenForm(true);
    } catch (error) {
      console.error('❌ Lỗi khi tải chi tiết chuyên ngành để chỉnh sửa:', error);
      alert("Không thể tải thông tin chuyên ngành để chỉnh sửa.");
    }
  };


  const handleMajorDelete = async (majorId) => {
    const confirmDelete = window.confirm("Bạn có chắc chắn muốn xóa chuyên ngành này không?");
    if (confirmDelete) {
      try {
        await deleteMajor(majorId);
        await fetchMajors();
        alert("Chuyên ngành đã được xóa thành công!");
      } catch (error) {
        console.error('❌ Lỗi khi xóa chuyên ngành:', error);
        alert("Có lỗi xảy ra khi xóa chuyên ngành.");
      }
    }
  };

  return (
    <div className="major-container">
      <div className="major-header">
        <button className="add-button" onClick={() => {
          setEditingMajor(null);
          setOpenForm(true);
        }}>
          Thêm chuyên ngành
        </button>
        <div className="search-container">
          <input type="text" placeholder="Tìm kiếm" className="search-box" />
          <FaSearch className="search-icon" />
        </div>
      </div>

      <MajorDetail
        open={openDetail}
        major={selectedMajor}
        onClose={() => {
          setOpenDetail(false);
          setSelectedMajor(null);
        }}
      />

      <MajorForm
        visible={openForm}
        onClose={() => {
          setOpenForm(false);
          setEditingMajor(null);
        }}
        initialData={editingMajor}
        onSave={handleSaveMajor}
      />

      <table className="subject-table">
        <thead>
          <tr>
            <th>STT</th>
            <th>Mã ngành</th>
            <th>Tên ngành</th>
            <th>Khoa</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {majors.map((major, index) => (
            <tr key={major.id}>
              <td>{index + 1}</td>
              <td>{major.code}</td>
              <td>{major.name}</td>
              <td>{major.faculty?.name || 'Chưa phân công'}</td>
              <td className="actions">
                <FaInfoCircle
                  className="icon info"
                  title="Chi tiết"
                  onClick={() => handleView(major)}
                />
                <FaEdit
                  className="icon edit"
                  title="Chỉnh sửa"
                  onClick={() => handleEdit(major)}
                />
                <FaTrashAlt
                  className="icon delete"
                  title="Xóa"
                  onClick={() => handleMajorDelete(major.id)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="footer">
        <div>Hiển thị {majors.length} kết quả</div>
        <div className="pagination">
          <select>
            <option>10</option>
            <option>25</option>
            <option>50</option>
          </select>
          <span>Từ 1 đến {majors.length} bản ghi</span>
          <button>&lt;</button>
          <button>&gt;</button>
        </div>
      </div>
    </div>
  );
};

export default MajorList;