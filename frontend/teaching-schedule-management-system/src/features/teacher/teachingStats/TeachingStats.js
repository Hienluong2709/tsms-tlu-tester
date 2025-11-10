// src/features/teacher/statistics/TeachingStats.js
import React, { useEffect, useState } from "react";
import TeachingStatsApi from "../../../api/TeachingStatsApi";
import "../../../styles/TeachingStats.css";

const TeachingStats = () => {
  const [stats, setStats] = useState([]);
  const [selectedSemester, setSelectedSemester] = useState(""); // học kỳ được chọn
  const [selectedYear, setSelectedYear] = useState("2024-2025"); // năm học được chọn

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await TeachingStatsApi.getMyStats();
        setStats(data);
        if (data.length > 0) {
          setSelectedSemester(data[0].semesterId); // mặc định chọn học kỳ đầu tiên
        }
      } catch (error) {
        console.error("Không thể load dữ liệu thống kê");
      }
    };
    fetchData();
  }, []);

  // lọc dữ liệu theo học kỳ được chọn (hiện tại chỉ lọc theo học kỳ)
  const filteredStats = stats.filter(
    (item) => item.semesterId === selectedSemester
  );

  return (
    <div className="teaching-stats-container">
      <div className="stats-header">
        <div className="filters">
          <label className="filter-label">Chọn học kỳ thống kê:</label>
          <select
            value={selectedSemester}
            onChange={(e) => setSelectedSemester(Number(e.target.value))}
            className="semester-select"
          >
            {stats.map((item) => (
              <option key={item.semesterId} value={item.semesterId}>
                Học kỳ {item.semesterName}
              </option>
            ))}
          </select>

          <label className="filter-label">Chọn năm học:</label>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="year-select"
          >
            <option value="2024-2025">2024-2025</option>
            <option value="2023-2024">2023-2024</option>
            <option value="2022-2023">2022-2023</option>
          </select>
        </div>
      </div>

      {filteredStats.map((item) => {
        const completionRate =
          item.totalHours > 0
            ? ((item.taughtHours + item.makeUpHours) / item.totalHours) * 100
            : 0;

        return (
          <div key={item.semesterId} className="stats-card">
            <h3>Học kỳ: {item.semesterName} - Năm học {selectedYear}</h3>
            <div className="stats-summary">
              <div className="stat-box">
                <span className="stat-value">{item.taughtHours}</span>
                <span className="stat-label">Giờ đã dạy</span>
              </div>
              <div className="stat-box">
                <span className="stat-value">{item.makeUpHours}</span>
                <span className="stat-label">Giờ dạy bù</span>
              </div>
              <div className="stat-box">
                <span className="stat-value">{item.notTaughtHours}</span>
                <span className="stat-label">Giờ nghỉ</span>
              </div>
              <div className="stat-box">
                <span className="stat-value">
                  {completionRate.toFixed(0)}%
                </span>
                <span className="stat-label">Tỷ lệ hoàn thành</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default TeachingStats;
