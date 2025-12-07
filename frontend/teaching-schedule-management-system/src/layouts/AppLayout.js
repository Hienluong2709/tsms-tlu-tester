import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import '../styles/AppLayout.css';

// --- Dashboard ---
import Dashboard from '../features/admin/dashboard/Dashboard';
import StudentDashboard from '../features/student/dashboard/StudentDashboard';
import TeacherLayout from "./TeacherLayout";

// --- Admin Features ---
import TeacherList from '../features/admin/teachers/TeacherList';
import AccountList from '../features/admin/accounts/AccountList';
import DepartmentList from '../features/admin/departments/DepartmentList';
import FacultyList from '../features/admin/faculties/FacultyList';
import SemesterList from '../features/admin/semesters/SemesterList';
import RoomList from '../features/admin/rooms/RoomList';
import SubjectList from '../features/admin/subjects/SubjectList';
import ClassSectionList from '../features/admin/class_sections/ClassSectionList';
import ScheduleChangeList from '../features/admin/schedulechanges/ScheduleChangeList';
import TeachingScheduleList from '../features/admin/teaching_schedules/TeachingScheduleList';
import MajorList from '../features/admin/majors/MajorList';
import StudentClassSectionList from '../features/admin/student-class-sections/StudentClassSectionList';
import StudentList from '../features/admin/students/StudentList';
import StatisticList from '../features/admin/statistics/StatisticList';
import NotificationsList from '../features/admin/notifications/NotificationList';

// --- NEW IMPORT (CHỨC NĂNG MỚI) ---
import InputGrade from '../features/admin/scores/InputGrade';
import ConductPoint from '../features/student/scores/ConductPoint';

function AppLayout() {
  return (
    <Routes>
      {/* Route riêng cho giáo viên (nếu có layout riêng) */}
      <Route path="/teacher-dashboard/*" element={<TeacherLayout />} />
      
      {/* Route chung cho Admin và Student (Dùng chung Sidebar/Header) */}
      <Route path="/*" element={
        <div className="app-layout" style={{ display: 'flex' }}>
          <Sidebar />

          <div className="main-content" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <Header />

            <div className="content-area" style={{ flex: 1, padding: '20px' }}>
              <Routes>
                {/* --- Dashboard --- */}
                <Route path="/" element={<Dashboard />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/student-dashboard" element={<StudentDashboard />} />

                {/* --- Admin Routes --- */}
                <Route path="/teachers" element={<TeacherList />} />
                <Route path="/accounts" element={<div><AccountList /></div>} />
                <Route path="/departments" element={<div><DepartmentList /></div>} />
                <Route path="/semesters" element={<div><SemesterList /></div>} />
                <Route path="/rooms" element={<div><RoomList /></div>} />
                <Route path="/faculties" element={<div><FacultyList /></div>} />
                <Route path="/subjects" element={<div><SubjectList /></div>} />
                <Route path="/class-sections" element={<div><ClassSectionList /></div>} />
                <Route path="/schedulechanges" element={<div><ScheduleChangeList /></div>} />
                <Route path="/teaching-schedules" element={<div><TeachingScheduleList /></div>} />
                <Route path="/majors" element={<div><MajorList /></div>} />
                <Route path="/student-class-sections" element={<div><StudentClassSectionList defaultStudentId={null} /></div>} />
                <Route path="/students" element={<div><StudentList /></div>} />
                <Route path="/statistics" element={<div><StatisticList /></div>} />
                <Route path="/notifications" element={<div><NotificationsList /></div>} />

                {/* --- NEW ROUTES (CHỨC NĂNG MỚI THÊM VÀO ĐÂY) --- */}
                <Route path="/admin/input-grade" element={<InputGrade />} />
                <Route path="/student/conduct-point" element={<ConductPoint />} />

                {/* Catch-all */}
                <Route path="*" element={<Dashboard />} />
              </Routes>
            </div>
          </div>
        </div>
      } />
    </Routes>
  );
}

export default AppLayout;