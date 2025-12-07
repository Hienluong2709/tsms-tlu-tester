// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './features/auth/LoginPage';
import AppLayout from './layouts/AppLayout';
import { useAuth } from './contexts/AuthContext';

function AppContent() {
  const { isLoggedIn } = useAuth();

  return (
    <Router>
      <Routes>
        <Route path="/login" element={isLoggedIn ? <Navigate to="/" /> : <LoginPage />} />
        {/* Mọi đường dẫn khác đều đẩy vào AppLayout để nó tự xử lý */}
        <Route path="/*" element={isLoggedIn ? <AppLayout /> : <Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default function App() { return <AppContent />; }