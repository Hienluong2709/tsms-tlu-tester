import React, { useEffect, useState } from "react";
import { FaInfoCircle, FaSearch } from 'react-icons/fa';
import { getAllStatistic } from "../../../api/StatisticApi";
import { getFaculties, getSemesters } from "../../../api/ApiDropdown";
import '../../../styles/StatisticList.css';
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const StatisticsReport = () => {
  const [filters, setFilters] = useState({
    period: "Tháng",
    semester: "",
    faculty: "",
    status: "Đang làm việc",
    search: "",
  });

  const [statistics, setStatistics] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [faculties, setFaculties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const data = await getAllStatistic();
        setStatistics(data);
      } catch (error) {
        console.error("Không thể tải thống kê:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        const semestersData = await getSemesters();
        const facultiesData = await getFaculties();
        setSemesters(semestersData);
        setFaculties(facultiesData);

        if (semestersData.length > 0) {
          setFilters((prev) => ({ ...prev, semester: "Tất cả" }));
        }

        if (facultiesData.length > 0 && !filters.faculty) {
          setFilters((prev) => ({ ...prev, faculty: "Tất cả khoa" }));
        }
      } catch (error) {
        console.error("Lỗi khi tải dropdown:", error);
      }
    };
    fetchDropdownData();
  }, []);


  const filteredStatistics = statistics.filter(item => {
    const matchSemester = filters.semester === "Tất cả" || !filters.semester ? true : item.semesterName === filters.semester;
    const matchSearch = filters.search ? item.teacherName.toLowerCase().includes(filters.search.toLowerCase()) : true;

    // Nếu thêm lọc theo khoa hoặc trạng thái thì mở rộng ở đây

    return matchSemester && matchSearch;
  });



  const exportToExcel = () => {
    if (filteredStatistics.length === 0) {
      alert("Không có dữ liệu để xuất báo cáo");
      return;
    }

    const dataForExcel = filteredStatistics.map((item, index) => ({
      'STT': index + 1,
      'Giảng viên': item.teacherName,
      'Học kỳ': item.semesterName,
      'Giờ đã dạy': item.taughtHours,
      'Giờ chưa dạy': item.notTaughtHours,
      'Giờ dạy bù': item.makeUpHours,
      'Tổng giờ': item.totalHours,
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataForExcel);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Báo cáo giảng dạy');
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(blob, `Bao_cao_gio_day_${new Date().toISOString().slice(0,10)}.xlsx`);
  };

  return (
    <div className="statistic-container">
      <div className="statistic-header">
        <button className="add-button" onClick={exportToExcel}>
          In báo cáo
        </button>
        <div className="search-container">
          <input
            type="text"
            placeholder="Tìm kiếm giảng viên"
            className="search-box"
            value={filters.search}
            onChange={(e) =>
              setFilters({ ...filters, search: e.target.value })
            }
          />
          <FaSearch className="search-icon" />
        </div>
      </div>

      <div className="filter-bar-statistics">
        <div className="filter-items-group-statistics">
          <div className="filter-item-statistics">
            <label>Thống kê theo</label>
            <select
              value={filters.period}
              onChange={(e) => setFilters({ ...filters, period: e.target.value })}
            >
              <option>Tháng</option>
              <option>Quý</option>
              <option>Năm</option>
            </select>
          </div>

          <div className="filter-item-statistics">
            <label>Học kỳ</label>
            <select
              value={filters.semester}
              onChange={(e) =>
                setFilters({ ...filters, semester: e.target.value })
              }
            >
              <option value="Tất cả">Tất cả</option>
              {semesters.map((s) => (
                <option key={s.id} value={s.name}>{s.name}</option>
              ))}
            </select>

          </div>

          <div className="filter-item-statistics">
            <label>Khoa/bộ môn</label>
            <select
              value={filters.faculty}
              onChange={(e) =>
                setFilters({ ...filters, faculty: e.target.value })
              }
            >
              <option value="Tất cả khoa">Tất cả khoa</option>
              {faculties.map((f) => (
                <option key={f.id} value={f.name}>{f.name}</option>
              ))}
            </select>
          </div>

          <div className="filter-item-statistics">
            <label>Trạng thái</label>
            <select
              value={filters.status}
              onChange={(e) =>
                setFilters({ ...filters, status: e.target.value })
              }
            >
              <option>Đang làm việc</option>
              <option>Nghỉ phép</option>
            </select>
          </div>
        </div>
      </div>

      <table className="statistic-table">
        <thead>
          <tr>
            <th>STT</th>
            <th>Giảng viên</th>
            <th>Học kỳ</th>
            <th>Giờ đã dạy</th>
            <th>Giờ chưa dạy</th>
            <th>Giờ dạy bù</th>
            <th>Tổng giờ</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan="8" style={{ textAlign: "center", padding: "12px" }}>
                Đang tải dữ liệu...
              </td>
            </tr>
          ) : filteredStatistics.length > 0 ? (
            filteredStatistics.map((item, index) => (
              <tr key={item.teacherId}>
                <td>{index + 1}</td>
                <td>{item.teacherName}</td>
                <td>{item.semesterName}</td>
                <td>{item.taughtHours}</td>
                <td>{item.notTaughtHours}</td>
                <td>{item.makeUpHours}</td>
                <td>{item.totalHours}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8" style={{ textAlign: "center", padding: "12px" }}>
                Không có dữ liệu
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <div className="footer">
        <div>Hiển thị {filteredStatistics.length} kết quả</div>
        <div className="pagination">
          <select>
            <option>10</option>
            <option>25</option>
            <option>50</option>
          </select>
          <span>Từ 1 đến {filteredStatistics.length} bản ghi</span>
          <button>&lt;</button>
          <button>&gt;</button>
        </div>
      </div>
    </div>
  );
};

export default StatisticsReport;
