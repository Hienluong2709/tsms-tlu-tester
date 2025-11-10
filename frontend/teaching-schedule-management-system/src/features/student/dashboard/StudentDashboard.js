import React from 'react';
import { useAuth } from '../../../contexts/AuthContext';

const StudentDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="container-fluid">
      <div className="row justify-content-center">
        <div className="col-12 col-md-10 col-lg-8">
          <div className="card">
            <div className="card-header bg-success text-white text-center">
              <h2 className="mb-0">
                <i className="fas fa-graduation-cap me-2"></i>
                Trang Sinh Viên
              </h2>
            </div>
            <div className="card-body">
              <div className="row mb-4">
                <div className="col-12">
                  <div className="alert alert-success text-center">
                    <h5 className="alert-heading">
                      <i className="fas fa-user-graduate me-2"></i>
                      Xin chào, {user?.name || user?.username}!
                    </h5>
                    <p className="mb-0">Chào mừng bạn đến với hệ thống quản lý lịch học - Giao diện Sinh viên</p>
                  </div>
                </div>
              </div>

              <div className="row">
                {/* Lịch học hôm nay */}
                <div className="col-md-6 col-lg-4 mb-4">
                  <div className="card border-primary">
                    <div className="card-body text-center">
                      <i className="fas fa-calendar-day fa-3x text-primary mb-3"></i>
                      <h5 className="card-title">Lịch hôm nay</h5>
                      <p className="card-text text-muted">Xem lịch học hôm nay</p>
                      <button className="btn btn-primary">
                        <i className="fas fa-eye me-1"></i>
                        Xem lịch
                      </button>
                    </div>
                  </div>
                </div>

                {/* Lịch tuần này */}
                <div className="col-md-6 col-lg-4 mb-4">
                  <div className="card border-success">
                    <div className="card-body text-center">
                      <i className="fas fa-calendar-week fa-3x text-success mb-3"></i>
                      <h5 className="card-title">Lịch tuần</h5>
                      <p className="card-text text-muted">Xem lịch học tuần này</p>
                      <button className="btn btn-success">
                        <i className="fas fa-calendar me-1"></i>
                        Xem lịch tuần
                      </button>
                    </div>
                  </div>
                </div>

                {/* Môn học */}
                <div className="col-md-6 col-lg-4 mb-4">
                  <div className="card border-warning">
                    <div className="card-body text-center">
                      <i className="fas fa-book fa-3x text-warning mb-3"></i>
                      <h5 className="card-title">Môn học</h5>
                      <p className="card-text text-muted">Xem các môn học đang theo</p>
                      <button className="btn btn-warning">
                        <i className="fas fa-list me-1"></i>
                        Xem môn học
                      </button>
                    </div>
                  </div>
                </div>

                {/* Điểm danh */}
                <div className="col-md-6 col-lg-4 mb-4">
                  <div className="card border-info">
                    <div className="card-body text-center">
                      <i className="fas fa-user-check fa-3x text-info mb-3"></i>
                      <h5 className="card-title">Điểm danh</h5>
                      <p className="card-text text-muted">Xem lịch sử điểm danh</p>
                      <button className="btn btn-info">
                        <i className="fas fa-check me-1"></i>
                        Xem điểm danh
                      </button>
                    </div>
                  </div>
                </div>

                {/* Thông báo */}
                <div className="col-md-6 col-lg-4 mb-4">
                  <div className="card border-danger">
                    <div className="card-body text-center">
                      <i className="fas fa-bell fa-3x text-danger mb-3"></i>
                      <h5 className="card-title">Thông báo</h5>
                      <p className="card-text text-muted">Xem thông báo từ nhà trường</p>
                      <button className="btn btn-danger">
                        <i className="fas fa-envelope me-1"></i>
                        Xem thông báo
                      </button>
                    </div>
                  </div>
                </div>

                {/* Hồ sơ cá nhân */}
                <div className="col-md-6 col-lg-4 mb-4">
                  <div className="card border-secondary">
                    <div className="card-body text-center">
                      <i className="fas fa-user-edit fa-3x text-secondary mb-3"></i>
                      <h5 className="card-title">Hồ sơ</h5>
                      <p className="card-text text-muted">Cập nhật thông tin cá nhân</p>
                      <button className="btn btn-secondary">
                        <i className="fas fa-user me-1"></i>
                        Chỉnh sửa
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Thống kê nhanh */}
              <div className="row mt-4">
                <div className="col-12">
                  <h5 className="mb-3">
                    <i className="fas fa-chart-pie me-2"></i>
                    Thống kê nhanh
                  </h5>
                </div>
                <div className="col-md-3 mb-3">
                  <div className="card bg-primary text-white">
                    <div className="card-body">
                      <div className="d-flex align-items-center">
                        <i className="fas fa-calendar fa-2x me-3"></i>
                        <div>
                          <h4 className="mb-0">3</h4>
                          <small>Lớp hôm nay</small>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-3 mb-3">
                  <div className="card bg-success text-white">
                    <div className="card-body">
                      <div className="d-flex align-items-center">
                        <i className="fas fa-book fa-2x me-3"></i>
                        <div>
                          <h4 className="mb-0">8</h4>
                          <small>Môn học</small>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-3 mb-3">
                  <div className="card bg-warning text-white">
                    <div className="card-body">
                      <div className="d-flex align-items-center">
                        <i className="fas fa-percentage fa-2x me-3"></i>
                        <div>
                          <h4 className="mb-0">95%</h4>
                          <small>Điểm danh</small>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-3 mb-3">
                  <div className="card bg-info text-white">
                    <div className="card-body">
                      <div className="d-flex align-items-center">
                        <i className="fas fa-clock fa-2x me-3"></i>
                        <div>
                          <h4 className="mb-0">24</h4>
                          <small>Giờ/tuần</small>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Lịch học sắp tới */}
              <div className="row mt-4">
                <div className="col-12">
                  <h5 className="mb-3">
                    <i className="fas fa-clock me-2"></i>
                    Lịch học sắp tới
                  </h5>
                  <div className="card">
                    <div className="card-body">
                      <div className="table-responsive">
                        <table className="table table-striped">
                          <thead>
                            <tr>
                              <th>Thời gian</th>
                              <th>Môn học</th>
                              <th>Giảng viên</th>
                              <th>Phòng</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td>8:00 - 9:30</td>
                              <td>Lập trình Java</td>
                              <td>ThS. Nguyễn Văn A</td>
                              <td>A101</td>
                            </tr>
                            <tr>
                              <td>10:00 - 11:30</td>
                              <td>Cơ sở dữ liệu</td>
                              <td>TS. Trần Thị B</td>
                              <td>B205</td>
                            </tr>
                            <tr>
                              <td>14:00 - 15:30</td>
                              <td>Mạng máy tính</td>
                              <td>ThS. Lê Văn C</td>
                              <td>C301</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
