// src/components/SidebarTeacher.js
import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import '../styles/SidebarTeacher.css';
import logo from '../assets/images/logo.png';

const SidebarTeacher = () => {
  return (
    <div className="sidebar">
      <div className="sidebar-logo">
        <img src={logo} alt="TSMS Logo" className="logo-image" />
      </div>

      <ul className="sidebar-menu">
        {/* TRANG CHỦ */}
        <li>
          <NavLink to="/teacher-dashboard" className="menu-link-standalone" end>
            TRANG CHỦ
          </NavLink>
        </li>

        {/* QUẢN LÝ LỊCH DẠY */}
        <li>
          <NavLink to="/teacher-dashboard/schedule-management" className="menu-link-standalone">
            QUẢN LÝ LỊCH DẠY
          </NavLink>
        </li>

        {/* GHI NHẬN GIỜ DẠY */}
        <li>
          <NavLink to="/teacher-dashboard/attendance" className="menu-link-standalone">
            GHI NHẬN GIỜ DẠY
          </NavLink>
        </li>

        {/* THỐNG KÊ */}
        <li>
          <NavLink to="/teacher-dashboard/teaching-stats" className="menu-link-standalone">
            THỐNG KÊ GIỜ DẠY
          </NavLink>
        </li>
      </ul>
    </div>
  );
};

export default SidebarTeacher;
