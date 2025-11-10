// src/components/Header.js
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBars,
  faChevronDown,
  faBell,
  faUser,
  faCog,
  faSignOutAlt,
} from '@fortawesome/free-solid-svg-icons';
import '../styles/Header.css';
import avatar from '../assets/images/avt.jpg';
import { useAuth } from '../contexts/AuthContext';
import axiosInstance from '../api/axiosInstance';

const fmtDate = (dt) => {
  if (!dt) return '';
  try {
    const d = new Date(dt);
    const pad = (n) => String(n).padStart(2, '0');
    return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} ${pad(
      d.getHours()
    )}:${pad(d.getMinutes())}`;
  } catch {
    return String(dt);
  }
};

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [userOpen, setUserOpen] = useState(false);
  const userRef = useRef(null);

  const [notis, setNotis] = useState([]);
  const [loadingNoti, setLoadingNoti] = useState(false);
  const [errNoti, setErrNoti] = useState('');

  const getPageTitle = (pathname) => {
    switch (pathname) {
      case '/':
      case '/dashboard':
        return 'TRANG CHỦ';
      case '/teachers':
        return 'QUẢN LÝ GIẢNG VIÊN';
      case '/semesters':
        return 'QUẢN LÝ HỌC KỲ';
      case '/rooms':
        return 'QUẢN LÝ PHÒNG HỌC';
      case '/subjects':
        return 'QUẢN LÝ MÔN HỌC';
      case '/schedulechanges':
        return 'QUẢN LÝ LỊCH THAY ĐỔI';
      case '/class-sections':
        return 'QUẢN LÝ LỚP HỌC PHẦN';
      case '/majors':
        return 'QUẢN LÝ NGÀNH HỌC';
      case '/faculties':
        return 'QUẢN LÝ KHOA';
      case '/departments':
        return 'QUẢN LÝ BỘ MÔN';
      case '/student-class-sections':
        return 'QUẢN LÝ HỌC PHẦN ĐÃ ĐĂNG KÝ';
      case '/accounts':
        return 'QUẢN LÝ TÀI KHOẢN';
      case '/teaching-schedules':
        return 'QUẢN LÝ LỊCH GIẢNG DẠY';
      case '/students':
        return 'QUẢN LÝ SINH VIÊN';
      case '/statistics':
        return 'THỐNG KÊ - BÁO CÁO';
      case '/notifications':
        return 'QUẢN LÝ THÔNG BÁO';
      default:
        return 'QUẢN LÝ HỆ THỐNG';
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userRef.current && !userRef.current.contains(e.target)) {
        setUserOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);


  const fetchNotifications = async () => {
    try {
      setLoadingNoti(true);
      setErrNoti('');
      const { data } = await axiosInstance.get('/admin/notifications', {
        params: { size: 10, sort: 'createdAt,desc' },
      });
      const list = Array.isArray(data) ? data : data?.content || [];
      setNotis(list);
    } catch (err) {
      setErrNoti('Không tải được thông báo');
    } finally {
      setLoadingNoti(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const unreadCount = useMemo(() => {
    const n = notis.filter((x) => !x?.read && x?.status !== 'READ').length;
    return n > 99 ? '99+' : n || '';
  }, [notis]);

  const toggleUserMenu = () => setUserOpen((v) => !v);

  return (
    <div className="header-container">
      <div className="header-bar">
        <div className="header-menu-btn">
          <button className="menu-btn-square">
            <FontAwesomeIcon icon={faBars} />
          </button>
        </div>

        <span className="header-title">{getPageTitle(location.pathname)}</span>

        <div className="header-right">
          <div className="header-bell">
            <button
              className="bell-btn"
              type="button"
              onClick={() => navigate('/notifications')}
              title="Thông báo"
            >
              <FontAwesomeIcon icon={faBell} className="bell-icon" />
              {unreadCount !== '' && (
                <span
                  className="notification-count"
                  aria-label={`${unreadCount} thông báo chưa đọc`}
                >
                  {unreadCount}
                </span>
              )}
            </button>
          </div>

          <div className="header-user-wrapper" ref={userRef}>
            <div
              className="header-user"
              onClick={toggleUserMenu}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') toggleUserMenu();
              }}
              aria-haspopup="menu"
              aria-expanded={userOpen}
            >
              <img src={avatar} alt="User Avatar" className="header-avatar" />
              <div className="header-user-info">
                <span className="header-user-name">{user?.username || 'User'}</span>
                <span className="header-user-role">Quản trị viên</span>
              </div>
              <FontAwesomeIcon icon={faChevronDown} className="dropdown-arrow" />
            </div>

            {userOpen && (
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
