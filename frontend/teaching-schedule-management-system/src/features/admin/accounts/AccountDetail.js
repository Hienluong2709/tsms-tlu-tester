import React from "react";
import { FaTimes } from "react-icons/fa";
import "../../../styles/AccountDetail.css";

const AccountDetail = ({ account, onClose }) => {
  if (!account) return null;

  return (
    <div className="account-detail-modal">
      <div className="detail-box">
        <div className="detail-header">
          <span>CHI TIẾT TÀI KHOẢN</span>
          <FaTimes className="close" onClick={onClose} />
        </div>

        <div className="detail-row">
          <label>STT:</label>
          <div>{account.stt}</div>
        </div>

        <div className="detail-row">
          <label>Tên đăng nhập:</label>
          <div>{account.tenDangNhap}</div>
        </div>

        <div className="detail-row">
          <label>Vai trò:</label>
          <div>{account.vaiTro}</div>
        </div>

        <div className="detail-row">
          <label>Ngày tạo:</label>
          <div>{account.ngayTao}</div>
        </div>

        <div className="detail-footer">
          <button onClick={onClose} className="back-btn">Quay lại</button>
        </div>
      </div>
    </div>
  );
};

export default AccountDetail;