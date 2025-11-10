import React from 'react';
import { FaTimes } from 'react-icons/fa';
import '../../../styles/DeleteConfirmModal.css';

const DeleteConfirmModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = "XÓA TÀI KHOẢN", 
  message = "Bạn có chắc chắn muốn xóa tài khoản này không?",
  loading = false 
}) => {
  if (!isOpen) return null;

  return (
    <div className="delete-modal-overlay">
      <div className="delete-modal">
        <div className="delete-modal-header">
          <h3>{title}</h3>
          <FaTimes className="close-icon" onClick={onClose} />
        </div>
        
        <div className="delete-modal-body">
          <div className="warning-icon">
            <span>⚠️</span>
          </div>
          <p>{message}</p>
        </div>
        
        <div className="delete-modal-footer">
          <button 
            className="confirm-btn" 
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? "Đang xóa..." : "Xác nhận"}
          </button>
          <button 
            className="cancel-btn" 
            onClick={onClose}
            disabled={loading}
          >
            Hủy bỏ
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;
