import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';

import AppLayout from './layouts/AppLayout';
import LoginPage from './features/auth/LoginPage';
import { useAuth } from './contexts/AuthContext';

function AppContent() {
  const { isLoggedIn, ready } = useAuth();

  // loading spinner khi AuthContext đang khởi tạo
  if (!ready) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        {/* Trang login: nếu đã đăng nhập thì đá về "/" */}
        <Route
          path="/login"
          element={isLoggedIn ? <Navigate to="/" replace /> : <LoginPage />}
        />

        {/* Root & các route còn lại: protected */}
        <Route
          path="/"
          element={isLoggedIn ? <AppLayout /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/*"
          element={isLoggedIn ? <AppLayout /> : <Navigate to="/login" replace />}
        />
      </Routes>
    </Router>
  );
}

export default function App() {
  return <AppContent />;
}
