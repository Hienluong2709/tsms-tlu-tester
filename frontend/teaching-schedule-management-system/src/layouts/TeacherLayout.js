import React from "react";
import { Routes, Route } from "react-router-dom";
import SidebarTeacher from "../components/SidebarTeacher";
import HeaderTeacher from "../components/HeaderTeacher";
import TeacherDashboard from "../features/teacher/dashboard/TeacherDashboard";
import ScheduleManagement from "../features/teacher/schedule/ScheduleManagement";
import TeachingHoursTracking from "../features/teacher/teachingHours/TeachingHoursTracking";
import TeachingStats from "../features/teacher/teachingStats/TeachingStats";

import "../styles/TeacherLayout.css";

function TeacherLayout() {
  return (
    <div className="teacher-layout">
      <SidebarTeacher />

      <div className="teacher-main-content">
        <HeaderTeacher />

        <div className="teacher-content-area">
          <Routes>
            <Route path="/" element={<TeacherDashboard />} />
            <Route path="/schedule-management" element={<ScheduleManagement />} />
            <Route path="/attendance" element={<TeachingHoursTracking />} />
            <Route path="/teaching-stats" element={<TeachingStats />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default TeacherLayout;
