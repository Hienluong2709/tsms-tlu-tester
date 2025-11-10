import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import '../styles/Sidebar.css';
import { FaChevronDown } from 'react-icons/fa';
import logo from '../assets/images/logo.png';

const Sidebar = () => {
  const [openMenus, setOpenMenus] = useState({
    danhMuc: false,
    hocPhan: false,
    giangVien: false,
    lichHoc: false,
  });

  const toggleMenu = (menu) => {
    setOpenMenus((prev) => ({ ...prev, [menu]: !prev[menu] }));
  };

  return (
    <div className="sidebar">
      <div className="sidebar-logo">
        <img src={logo} alt="TSMS Logo" className="logo-image" />
      </div>
      <ul className="sidebar-menu">
        {/* TRANG CHỦ */}
        <li>
          <NavLink to="/" className="menu-link-standalone" end>TRANG CHỦ</NavLink>
        </li>

        {/* DANH MỤC */}
        <li className={openMenus.danhMuc ? 'open' : ''}>
          <div className="menu-item">
            <span>DANH MỤC</span>
            <span className={`arrow-icon ${openMenus.danhMuc ? 'rotate' : ''}`} onClick={() => toggleMenu('danhMuc')}>
              <FaChevronDown />
            </span>
          </div>
          <ul className={`submenu ${openMenus.danhMuc ? 'open' : ''}`}>
            <li><NavLink to="/faculties" className="submenu-link">KHOA</NavLink></li>
            <li><NavLink to="/departments" className="submenu-link">BỘ MÔN</NavLink></li>
            <li><NavLink to="/majors" className="submenu-link">NGÀNH HỌC</NavLink></li>
            <li><NavLink to="/rooms" className="submenu-link">PHÒNG HỌC</NavLink></li>           
          </ul>
        </li>

        {/* HỌC PHẦN */}
        <li className={openMenus.hocPhan ? 'open' : ''}>
          <div className="menu-item">
            <span>HỌC PHẦN</span>
            <span className={`arrow-icon ${openMenus.hocPhan ? 'rotate' : ''}`} onClick={() => toggleMenu('hocPhan')}>
              <FaChevronDown />
            </span>
          </div>
          <ul className={`submenu ${openMenus.hocPhan ? 'open' : ''}`}>
            <li><NavLink to="/subjects" className="submenu-link">MÔN HỌC</NavLink></li>
            <li><NavLink to="/class-sections" className="submenu-link">LỚP HỌC PHẦN</NavLink></li>
            <li><NavLink to="/student-class-sections" className="submenu-link">HỌC PHẦN ĐÃ ĐĂNG KÝ</NavLink></li>
          </ul>
        </li>

        {/* SINH VIÊN */}
        <li>
          <NavLink to="/students" className="menu-link-standalone">SINH VIÊN</NavLink>
        </li>


        {/* GIẢNG VIÊN */}
        <li className={openMenus.giangVien ? 'open' : ''}>
          <div className="menu-item">
            <span>GIẢNG VIÊN</span>
            <span className={`arrow-icon ${openMenus.giangVien ? 'rotate' : ''}`} onClick={() => toggleMenu('giangVien')}>
              <FaChevronDown />
            </span>
          </div>
          <ul className={`submenu ${openMenus.giangVien ? 'open' : ''}`}>
            <li><NavLink to="/teachers" className="submenu-link">DANH SÁCH GIẢNG VIÊN</NavLink></li>
            <li><NavLink to="/teaching-schedules" className="submenu-link">LỊCH GIẢNG DẠY</NavLink></li>
          </ul>
        </li>

        {/* LỊCH HỌC */}
        <li className={openMenus.lichHoc ? 'open' : ''}>
          <div className="menu-item">
            <span>LỊCH HỌC</span>
            <span className={`arrow-icon ${openMenus.lichHoc ? 'rotate' : ''}`} onClick={() => toggleMenu('lichHoc')}>
              <FaChevronDown />
            </span>
          </div>
          <ul className={`submenu ${openMenus.lichHoc ? 'open' : ''}`}>
            <li><NavLink to="/schedulechanges" className="submenu-link">LỊCH THAY ĐỔI</NavLink></li>
            <li><NavLink to="/semesters" className="submenu-link">HỌC KỲ</NavLink></li>
          </ul>
        </li>

        {/* THỐNG KÊ */}
        <li>
          <NavLink to="/statistics" className="menu-link-standalone">THỐNG KÊ - BÁO CÁO</NavLink>
        </li>
        <li>
          <NavLink to="/notifications" className="menu-link-standalone">THÔNG BÁO</NavLink>
        </li>


        {/* TÀI KHOẢN */}
        <li>
          <NavLink to="/accounts" className="menu-link-standalone">TÀI KHOẢN</NavLink>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
