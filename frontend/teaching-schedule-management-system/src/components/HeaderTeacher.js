import React, { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faChevronDown,
  faBell,
  faUser,
  faCog,
  faSignOutAlt,
} from "@fortawesome/free-solid-svg-icons";
import "../styles/Header.css";
import avatar from "../assets/images/avt.jpg";
import { useAuth } from "../contexts/AuthContext";

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const getPageTitle = (pathname) => {
    switch (pathname) {
      case "/teacher-dashboard":
        return "TRANG CHỦ";
      case "/teacher-dashboard/schedule-management":
        return "QUẢN LÝ LỊCH DẠY";
      case "/teacher-dashboard/attendance":
        return "GHI NHẬN GIỜ DẠY";
      case "/teacher-dashboard/statistics":
        return "THỐNG KÊ GIỜ DẠY ";
      default:
        return "THỐNG KÊ GIỜ DẠY";
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Lấy ngày hiện tại
  const today = new Date();
  const formattedDate = today.toLocaleDateString("vi-VN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="header-container">
      <div className="header-bar">
        <div className="header-menu-btn">
          <button className="menu-btn-square">
            <FontAwesomeIcon icon={faBars} />
          </button>
        </div>

        <div className="header-title">
          <div className="page-title">{getPageTitle(location.pathname)}</div>

          <span
            className="page-date2"
            style={{ fontSize: "12px", color: "#999" }}
          >
            {formattedDate}
          </span>
        </div>

        <div className="header-right">
          <div className="header-bell">
            <FontAwesomeIcon icon={faBell} className="bell-icon" />
            <span className="notification-dot"></span>
          </div>

          <div className="header-user-wrapper" ref={dropdownRef}>
            <div
              className="header-user"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              <img src={avatar} alt="User Avatar" className="header-avatar" />
              <div className="header-user-info">
                <span className="header-user-name">Nguyễn Văn A</span>
                <span className="header-user-role">Giảng viên</span>
              </div>
              <FontAwesomeIcon
                icon={faChevronDown}
                className="dropdown-arrow"
              />
            </div>

            {dropdownOpen && (
              <div className="dropdown-menu">
                <div className="dropdown-item">
                  <FontAwesomeIcon icon={faUser} />
                  <span>Thông tin tài khoản</span>
                </div>
                <div className="dropdown-item">
                  <FontAwesomeIcon icon={faCog} />
                  <span>Cài đặt thông báo</span>
                </div>
                <div className="dropdown-item logout" onClick={handleLogout}>
                  <FontAwesomeIcon icon={faSignOutAlt} />
                  <span>Đăng xuất</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
