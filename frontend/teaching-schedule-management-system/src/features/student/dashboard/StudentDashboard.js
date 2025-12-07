import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext'; // Đảm bảo đường dẫn đúng
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

const StudentDashboard = () => {
    const { user } = useAuth();

    return (
        <div className="container-fluid p-4">
            {/* Header Chào mừng */}
            <div className="alert alert-success mb-4 shadow-sm" role="alert">
                <h4 className="alert-heading"><i className="fas fa-user-graduate me-2"></i>Xin chào, {user?.username || "Sinh viên"}!</h4>
                <p className="mb-0">Chào mừng bạn đến với hệ thống quản lý lịch học - Giao diện Sinh viên</p>
            </div>

            {/* Grid Menu */}
            <div className="row g-4">
                {/* 1. Lịch hôm nay */}
                <div className="col-md-4">
                    <div className="card h-100 text-center p-3 shadow-sm border-primary">
                        <div className="card-body">
                            <i className="fas fa-calendar-day fa-3x text-primary mb-3"></i>
                            <h5 className="card-title">Lịch hôm nay</h5>
                            <p className="card-text text-muted">Xem lịch học hôm nay</p>
                            <Link to="/student/schedule-today" className="btn btn-primary w-100">
                                <i className="fas fa-eye me-2"></i>Xem lịch
                            </Link>
                        </div>
                    </div>
                </div>

                {/* 2. Lịch tuần */}
                <div className="col-md-4">
                    <div className="card h-100 text-center p-3 shadow-sm border-success">
                        <div className="card-body">
                            <i className="fas fa-calendar-alt fa-3x text-success mb-3"></i>
                            <h5 className="card-title">Lịch tuần</h5>
                            <p className="card-text text-muted">Xem lịch học tuần này</p>
                            <Link to="/student/schedule-week" className="btn btn-success w-100">
                                <i className="fas fa-calendar-week me-2"></i>Xem lịch tuần
                            </Link>
                        </div>
                    </div>
                </div>

                {/* 3. Môn học */}
                <div className="col-md-4">
                    <div className="card h-100 text-center p-3 shadow-sm border-warning">
                        <div className="card-body">
                            <i className="fas fa-book fa-3x text-warning mb-3"></i>
                            <h5 className="card-title">Môn học</h5>
                            <p className="card-text text-muted">Xem các môn học đang theo</p>
                            <Link to="/student/subjects" className="btn btn-warning w-100 text-white">
                                <i className="fas fa-list me-2"></i>Xem môn học
                            </Link>
                        </div>
                    </div>
                </div>

                {/* 4. Điểm danh */}
                <div className="col-md-4">
                    <div className="card h-100 text-center p-3 shadow-sm border-info">
                        <div className="card-body">
                            <i className="fas fa-user-check fa-3x text-info mb-3"></i>
                            <h5 className="card-title">Điểm danh</h5>
                            <p className="card-text text-muted">Xem lịch sử điểm danh</p>
                            <button className="btn btn-info w-100 text-white">
                                <i className="fas fa-check me-2"></i>Xem điểm danh
                            </button>
                        </div>
                    </div>
                </div>

                {/* 5. Thông báo */}
                <div className="col-md-4">
                    <div className="card h-100 text-center p-3 shadow-sm border-danger">
                        <div className="card-body">
                            <i className="fas fa-bell fa-3x text-danger mb-3"></i>
                            <h5 className="card-title">Thông báo</h5>
                            <p className="card-text text-muted">Xem thông báo từ nhà trường</p>
                            <Link to="/student/notifications" className="btn btn-danger w-100">
                                <i className="fas fa-envelope me-2"></i>Xem thông báo
                            </Link>
                        </div>
                    </div>
                </div>

                {/* 6. Hồ sơ */}
                <div className="col-md-4">
                    <div className="card h-100 text-center p-3 shadow-sm border-secondary">
                        <div className="card-body">
                            <i className="fas fa-user-edit fa-3x text-secondary mb-3"></i>
                            <h5 className="card-title">Hồ sơ</h5>
                            <p className="card-text text-muted">Cập nhật thông tin cá nhân</p>
                            <Link to="/student/profile" className="btn btn-secondary w-100">
                                <i className="fas fa-user me-2"></i>Chỉnh sửa
                            </Link>
                        </div>
                    </div>
                </div>

                {/* --- 7. (MỚI) ĐIỂM RÈN LUYỆN --- */}
                <div className="col-md-4">
                    <div className="card h-100 text-center p-3 shadow-sm" style={{ borderColor: '#6f42c1' }}>
                        <div className="card-body">
                            <i className="fas fa-medal fa-3x mb-3" style={{ color: '#6f42c1' }}></i>
                            <h5 className="card-title">Điểm rèn luyện</h5>
                            <p className="card-text text-muted">Tự đánh giá điểm rèn luyện</p>
                            
                            {/* Nút bấm dẫn tới trang chấm điểm */}
                            <Link to="/student/conduct-point" className="btn w-100 text-white" style={{ backgroundColor: '#6f42c1' }}>
                                <i className="fas fa-star me-2"></i>Chấm điểm ngay
                            </Link>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default StudentDashboard;