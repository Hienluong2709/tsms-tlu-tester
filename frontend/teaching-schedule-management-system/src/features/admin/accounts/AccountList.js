// src/pages/.../AccountList.jsx
import React, { useState, useEffect } from "react";
import { FaEdit, FaTrash, FaInfoCircle, FaSearch } from "react-icons/fa";
import "../../../styles/AccountList.css";
import AccountForm from "./AccountForm";
import AccountDetail from "./AccountDetail";
import DeleteConfirmModal from "./DeleteConfirmModal";
import { useAuth } from "../../../contexts/AuthContext";
import { accountApi } from "../../../api/AccountApi";

const AccountList = () => {
  const [showForm, setShowForm] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [editingAccount, setEditingAccount] = useState(null);
  const [deletingAccount, setDeletingAccount] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [filteredAccounts, setFilteredAccounts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [error, setError] = useState(null);

  // Chỉ lấy logout từ AuthContext (KHÔNG còn isTokenValid)
  const { logout } = useAuth();

  const fetchAccounts = async () => {
    try {
      setLoading(true);
      setError(null);

      // ⛔ BỎ pre-check isTokenValid() ở đây
      const data = await accountApi.getAll();

      const transformed = (data || []).map((user, index) => {
        let role = user.role || "User";
        if (role === "ROLE_ADMIN") role = "Admin";
        if (role === "ROLE_TEACHER") role = "Teacher";
        if (role === "ROLE_STUDENT") role = "Student";

        return {
          stt: index + 1,
          tenDangNhap: user.username,
          vaiTro: role,
          ngayTao: user.createdDate || new Date().toISOString().split("T")[0],
          id: user.id,
        };
      });

      transformed.sort((a, b) => (b.id || 0) - (a.id || 0));
      const finalData = transformed.map((item, i) => ({ ...item, stt: i + 1 }));
      setAccounts(finalData);
      setFilteredAccounts(finalData);
    } catch (err) {
      const status = err?.response?.status;

      if (status === 401) {
        setError("Phiên đăng nhập không hợp lệ hoặc đã hết hạn.");
        // Nếu muốn đẩy về login ngay lập tức:
        // logout();
      } else if (status === 403) {
        setError("Bạn không có quyền truy cập trang 'Tài khoản'.");
      } else {
        setError(err?.response?.data?.message || err.message || "Đã xảy ra lỗi.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccounts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredAccounts(accounts);
    } else {
      const filtered = accounts.filter(
        (acc) =>
          acc.tenDangNhap?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          acc.vaiTro?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredAccounts(filtered);
    }
  }, [accounts, searchTerm]);

  const handleSearch = (e) => setSearchTerm(e.target.value);
  const handleAdd = () => { setEditingAccount(null); setShowForm(true); };
  const handleEdit = (acc) => { setEditingAccount(acc); setShowForm(true); };
  const handleView = (acc) => { setSelectedAccount(acc); setShowDetail(true); };
  const handleDelete = (acc) => { setDeletingAccount(acc); setShowDeleteModal(true); };

  const confirmDelete = async () => {
    try {
      setDeleteLoading(true);
      await accountApi.delete(deletingAccount.id);
      await fetchAccounts();
      setShowDeleteModal(false);
    } catch (err) {
      setError(err?.response?.data?.message || err.message || "Xóa thất bại.");
    } finally {
      setDeleteLoading(false);
    }
  };

  if (loading) {
    return <div className="container"><div>Đang tải dữ liệu...</div></div>;
  }

  return (
    <div className="container">
      {error && <div className="error-banner">{error}</div>}

      {showForm && (
        <AccountForm
          onClose={() => setShowForm(false)}
          onSuccess={async () => { await fetchAccounts(); setShowForm(false); }}
          editData={editingAccount}
        />
      )}

      {showDetail && (
        <AccountDetail
          account={selectedAccount}
          onClose={() => setShowDetail(false)}
        />
      )}

      <DeleteConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
        loading={deleteLoading}
        title="XÓA TÀI KHOẢN"
        message="Bạn có chắc chắn muốn xóa tài khoản này không?"
      />

      <div className="teacher-header">
        <button className="add-button" onClick={handleAdd}>Thêm tài khoản</button>
        <div className="search-container">
          <input
            type="text"
            placeholder="Tìm kiếm"
            className="search-input"
            value={searchTerm}
            onChange={handleSearch}
          />
          <FaSearch className="search-icon" />
        </div>
      </div>

      <table className="account-table">
        <thead>
          <tr>
            <th>STT</th>
            <th>Tên đăng nhập</th>
            <th>Vai trò</th>
            <th>Ngày tạo</th>
            <th className="text-center">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {filteredAccounts.map((item, index) => (
            <tr key={item.id || index}>
              <td>{index + 1}</td>
              <td>{item.tenDangNhap}</td>
              <td>{item.vaiTro}</td>
              <td>{item.ngayTao}</td>
              <td className="actions">
                <FaInfoCircle className="icon info" onClick={() => handleView(item)} />
                <FaEdit className="icon edit" onClick={() => handleEdit(item)} />
                <FaTrash className="icon delete" onClick={() => handleDelete(item)} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="footer">
        <div>
          Hiển thị {filteredAccounts.length} kết quả {searchTerm && `(lọc từ ${accounts.length} tài khoản)`}
        </div>
        <div className="pagination">
          <select>
            <option>10</option>
            <option>25</option>
            <option>50</option>
          </select>
          <span>Từ 1 đến {Math.min(10, filteredAccounts.length)} bản ghi</span>
          <button>&lt;</button>
          <button>&gt;</button>
        </div>
      </div>
    </div>
  );
};

export default AccountList;
