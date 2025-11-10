import React, { useEffect, useState} from 'react';
import { FaTrashAlt, FaEdit, FaInfoCircle, FaSearch } from 'react-icons/fa';
import '../../../styles/RoomList.css';
import RoomDetail from './RoomDetail';
import RoomForm from './RoomForm';
import {getAllRooms,createRoom,updateRoom,getRoomById,deleteRoom} from '../../../api/RoomApi';

const RoomList = () => {
  const [openForm, setOpenForm] = useState(false);
  const [rooms, setRooms] = useState([]);

  const [openDetail, setOpenDetail] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [editingRoom, setEditingRoom] = useState(null);


  const fetchRooms = async () => {
    try {
      const data = await getAllRooms();
      setRooms(data);
    } catch (error) {
      console.error('❌ Lỗi khi tải danh sách phòng học:', error);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

const handleSaveRoom = async (roomData) => {
  try {
    if (roomData.id) {
      await updateRoom(roomData.id, roomData);
      alert("Cập nhật phòng học thành công!");
    } else {
      await createRoom(roomData);
      alert("Thêm phòng học thành công!");
    }
    await fetchRooms();
  } catch (error) {
    console.error('❌ Lỗi khi lưu phòng học:', error);
    alert("Có lỗi xảy ra khi lưu phòng học.");
  }
  setOpenForm(false);
  setEditingRoom(null);
};




  const handleView = async (roomToList) => {
    try {
      const fullRoomDetails = await getRoomById(roomToList.id);
      setSelectedRoom(fullRoomDetails);
      setOpenDetail(true);
    } catch (error) {
      console.error('❌ Lỗi khi tải chi tiết phòng học:', error);
    }
  };

  const handleEdit = async (roomToList) => {
    try {
      const fullRoomDetails = await getRoomById(roomToList.id);
      console.log("Full Room Details for Edit:", fullRoomDetails);
      setEditingRoom(fullRoomDetails);
      setOpenForm(true);
    } catch (error) {
      console.error('❌ Lỗi khi tải chi tiết phòng học để chỉnh sửa:', error);
      alert("Không thể tải thông tin phòng học để chỉnh sửa.");
    }
  };


  const handleRoomDelete = async (roomId) => {
    const confirmDelete = window.confirm("Bạn có chắc chắn muốn xóa phòng học này không?");
    if (confirmDelete) {
      try {
        await deleteRoom(roomId);
        await fetchRooms();
        alert("Phòng học đã được xóa thành công!");
      } catch (error) {
        console.error('❌ Lỗi khi xóa phòng học:', error);
        alert("Có lỗi xảy ra khi xóa phòng học.");
      }
    }
  };

  return (
    <div className="room-container">
      <div className="room-header">
        <button className="add-button" onClick={() => {
          setEditingRoom(null);
          setOpenForm(true);
        }}>
          Thêm phòng học
        </button>
        <div className="search-container">
          <input type="text" placeholder="Tìm kiếm" className="search-box" />
          <FaSearch className="search-icon" />
        </div>
      </div>

      <RoomDetail
        open={openDetail}
        room={selectedRoom}
        onClose={() => {
          setOpenDetail(false);
          setSelectedRoom(null);
        }}
      />

      <RoomForm
        visible={openForm}
        onClose={() => {
          setOpenForm(false);
          setEditingRoom(null);
        }}
        initialData={editingRoom}
        onSave={handleSaveRoom}
      />

      <table className="room-table">
        <thead>
          <tr>
            <th>STT</th>
            <th>Mã phòng</th>
            <th>Tên phòng</th>
            <th>Toà nhà</th>
            <th>Tầng</th>
            <th>Sức chứa</th>
            <th>Loại phòng</th>
            <th>Trạng thái</th>
            <th className="actions-header">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {rooms.map((room, index) => (
            <tr key={room.id}>
              <td>{index + 1}</td>
              <td>{room.code}</td>
              <td>{room.name}</td>
              <td>{room.building}</td>
              <td>{room.floor}</td>
              <td>{room.capacity}</td>
              <td>{room.type}</td>
              <td>{room.status}</td>
              <td className="actions">
                <FaInfoCircle
                  className="icon info"
                  title="Chi tiết"
                  onClick={() => handleView(room)}
                />
                <FaEdit
                  className="icon edit"
                  title="Chỉnh sửa"
                  onClick={() => handleEdit(room)} 
                />
                <FaTrashAlt
                  className="icon delete"
                  title="Xóa"
                  onClick={() => handleRoomDelete(room.id)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="footer">
        <div>Hiển thị {rooms.length} kết quả</div>
        <div className="pagination">
          <select>
            <option>10</option>
            <option>25</option>
            <option>50</option>
          </select>
          <span>Từ 1 đến {rooms.length} bản ghi</span>
          <button>&lt;</button>
          <button>&gt;</button>
        </div>
      </div>
    </div>
  );
};

export default RoomList;