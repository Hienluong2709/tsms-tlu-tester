import React from "react";
import "../../../styles/RoomDetail.css";

const RoomDetail = ({ open, onClose, room }) => {
  if (!open || !room) return null;

    console.log("Đối tượng Room nhận được:", room); 

  return (
    <div className="room-detail-modal">
      <div className="room-detail-box">
        <div className="room-detail-header">
          <h2>Chi tiết phòng học</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>

        <div className="room-detail-row">
          <label>Mã phòng:</label>
          <div>{room.code}</div>
        </div>
        <div className="room-detail-row">
          <label>Tên phòng:</label>
          <div>{room.name}</div>
        </div>
        <div className="room-detail-row">
          <label>Toà nhà:</label>
          <div>{room.building}</div>
        </div>
        <div className="room-detail-row">
          <label>Tầng:</label>
          <div>{room.floor}</div>
        </div>
        <div className="room-detail-row">
          <label>Sức chứa:</label>
          <div>{room.capacity}</div>
        </div>
        <div className="room-detail-row">
          <label>Loại phòng:</label>
          <div>{room.type}</div>
        </div>
        <div className="room-detail-row">
          <label>Trạng thái:</label>
          <div>{room.status}</div>
        </div>
        <div className="room-detail-row">
          <label>Mô tả:</label>
          <div>{room.description}</div>
        </div>
        <div className="room-detail-footer">
          <button onClick={onClose}>Đóng</button>
        </div>
      </div>
    </div>
  );
};

export default RoomDetail;
