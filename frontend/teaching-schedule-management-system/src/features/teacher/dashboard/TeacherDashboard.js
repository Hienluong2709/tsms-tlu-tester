import React, { useEffect, useMemo, useState } from "react";  
import "../../../styles/TeacherDashboard.css";
import ViewScheduleModal from "../schedule/ViewScheduleModal";
import {
  FaChalkboardTeacher,
  FaClock,
  FaBook,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaInfoCircle,
} from "react-icons/fa";
import { useAuth } from "../../../contexts/AuthContext";
import TeacherScheduleApi from "../../../api/TeacherScheduleApi";

// ================= Helpers =================
function formatYMD(d = new Date()) {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

// Hàm chỉ lấy yyyy/mm/dd
function formatDateOnly(dateStr) {
  if (!dateStr) return "—";
  try {
    const d = new Date(dateStr);
    if (isNaN(d)) return dateStr;
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}/${mm}/${dd}`;
  } catch {
    return dateStr;
  }
}

// Lấy tên môn học
function getSubjectName(parent) {
  return (
    parent?.classSection?.subject?.name ||
    parent?.subject?.name ||
    "Môn học"
  );
}

// Lấy lớp học phần (ưu tiên code trước, rồi đến name)
function getClassSectionName(parent) {
  return (
    parent?.classSection?.code ||
    parent?.classSection?.classCode ||
    parent?.classSection?.name ||
    parent?.className ||
    ""
  );
}

// Lấy phòng học
function getRoom(parent, detail) {
  return (
    detail?.room?.name ||
    detail?.room ||
    parent?.classSection?.room?.name ||
    parent?.room?.name ||
    parent?.room ||
    parent?.classroom ||
    "—"
  );
}

// Chuỗi “tiết học”
function getPeriod(parent, detail) {
  if (detail?.periodStart || detail?.periodEnd) {
    const p1 = detail?.periodStart || "";
    const p2 = detail?.periodEnd || "";
    return p1 && p2 ? `${p1} - ${p2}` : (p1 || p2 || "—");
  }
  if (parent?.periodText) return parent.periodText;

  const startStr = detail?.startTime || parent?.startTime;
  const endStr = detail?.endTime || parent?.endTime;
  if (startStr && endStr) {
    const s = String(startStr).slice(11, 16);
    const e = String(endStr).slice(11, 16);
    return `${s} - ${e}`;
  }
  return "—";
}

// Chuẩn hoá 1 detail => 1 card item
function normalizeDetail(parent, detail, idx, didx) {
  const dayRaw =
    detail?.teachingDate ||
    detail?.date ||
    parent?.teachingDate ||
    parent?.date ||
    "—";

  return {
    id: `${parent?.id ?? idx}-${didx}`,
    subject: getSubjectName(parent),
    classSection: getClassSectionName(parent),
    type: detail?.type || parent?.type || "Lý thuyết",
    day: formatDateOnly(dayRaw),
    room: getRoom(parent, detail),
    period: getPeriod(parent, detail),
    department: parent?.classSection?.department?.name || parent?.department?.name || "",
    faculty: parent?.classSection?.faculty?.name || parent?.faculty?.name || "",
    raw: { parent, detail },
  };
}

// Fallback khi không có details
function normalizeParentFallback(parent, idx) {
  const dayRaw =
    parent?.teachingDate ||
    parent?.date ||
    (parent?.startTime ? String(parent.startTime).slice(0, 10) : "—");

  return {
    id: parent?.id ?? idx,
    subject: getSubjectName(parent),
    classSection: getClassSectionName(parent),
    type: parent?.type || "Lý thuyết",
    day: formatDateOnly(dayRaw),
    room: getRoom(parent, null),
    period: getPeriod(parent, null),
    department: parent?.classSection?.department?.name || parent?.department?.name || "",
    faculty: parent?.classSection?.faculty?.name || parent?.faculty?.name || "",
    raw: { parent },
  };
}

// ================= Component =================
const TeacherDashboard = () => {
  const { user, isLoggedIn, ready } = useAuth();

  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState(null);

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  const dashboardStats = useMemo(
    () => [
      { id: 1, title: "45h đã dạy", icon: FaClock, color: "blue" },
      { id: 2, title: "15h sắp dạy", icon: FaCalendarAlt, color: "green" },
      { id: 3, title: "5h dạy bù", icon: FaBook, color: "orange" },
      { id: 4, title: "2 lớp đang dạy", icon: FaChalkboardTeacher, color: "purple" },
    ],
    []
  );

  useEffect(() => {
    let mounted = true;

    (async () => {
      if (!ready) return;

      try {
        setLoading(true);
        setErr(null);

        if (!isLoggedIn || !user) {
          if (!mounted) return;
          setItems([]);
          setErr("Bạn chưa đăng nhập.");
          return;
        }

        const teacherId = user?.teacherId;
        if (!teacherId) throw new Error("Không tìm thấy teacherId từ tài khoản đăng nhập.");

        const todayStr = formatYMD();
        const raw = await TeacherScheduleApi.getByTeacherId(teacherId, { date: todayStr });

        let flattened = [];
        (raw || []).forEach((parent, idx) => {
          if (Array.isArray(parent?.details) && parent.details.length > 0) {
            const detailsToday = parent.details.filter(
              (d) => String(d?.teachingDate).slice(0, 10) === todayStr
            );
            const chosen = detailsToday.length > 0 ? detailsToday : parent.details;
            chosen.forEach((d, didx) => flattened.push(normalizeDetail(parent, d, idx, didx)));
          } else {
            const one = normalizeParentFallback(parent, idx);
            if (String(one.day).slice(0, 10) === todayStr) flattened.push(one);
          }
        });

        if (!mounted) return;
        setItems(flattened);
      } catch (e) {
        if (!mounted) return;
        setErr(e?.response?.data?.message || e?.message || "Không thể lấy lịch dạy của giáo viên.");
        setItems([]);
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => { mounted = false; };
  }, [ready, isLoggedIn, user]);

  const handleViewDetails = (schedule) => {
    setSelectedSchedule(schedule);
    setIsViewModalOpen(true);
  };

  if (!ready) return <div className="teaching-dashboard">Đang khởi tạo...</div>;
  if (loading) return <div className="teaching-dashboard">Đang tải dữ liệu...</div>;

  return (
    <>
      <div className="teaching-dashboard">
        <div className="stats-grid">
          {dashboardStats.map((stat) => (
            <div key={stat.id} className={`stat-card stat-card-${stat.color}`}>
              <div className="stat-icon"><stat.icon /></div>
              <div className="stat-content"><p className="stat-title">{stat.title}</p></div>
            </div>
          ))}
        </div>

        <div className="upcoming-section">
          <div className="schedule-content-wrapper">
            <div className="schedule-content">
              <div className="section-header">
                <h2>
                  Lịch dạy sắp tới{user?.fullName ? ` - ${user.fullName}` : ""}
                </h2>
                {err && (
                  <div style={{ color: "#c00", fontSize: 14, marginTop: 8 }}>
                    Lỗi: {err}
                  </div>
                )}
              </div>

              {/* danh sách có thanh cuộn */}
              <div className="classes-list scrollable">
                {items.length === 0 && !err && (
                  <div style={{ padding: 16 }}>Hôm nay không có lịch dạy.</div>
                )}

                {items.map((item) => (
                  <div key={item.id} className="class-card">
                    <div className="card-left-accent" />
                    <div className="card-content">
                      <div className="class-header">
                        <div className="class-title">
                          {/* Môn học + lớp học phần trong ngoặc */}
                          <h3>
                            {item.subject} {item.classSection ? `(${item.classSection})` : ""}
                          </h3>
                        </div>
                        <div className="class-actions">
                          <button
                            className="action-btn"
                            title="Xem chi tiết"
                            onClick={() => handleViewDetails(item)}
                          >
                            <FaInfoCircle />
                          </button>
                        </div>
                      </div>

                      <div className="class-info">
                        <div className="info-row">
                          <FaCalendarAlt className="info-icon" />
                          <span>{item.day || "—"}</span>
                        </div>

                        <div className="info-row">
                          <FaBook className="info-icon" />
                          <span>{item.type || "—"}</span>
                          <FaMapMarkerAlt className="info-icon" style={{ marginLeft: 12 }} />
                          <span>{item.room || "—"}</span>
                        </div>

                        <div className="info-row">
                          <FaClock className="info-icon" />
                          <span>{item.period || "—"}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          </div>
        </div>
      </div>

      <ViewScheduleModal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        scheduleData={selectedSchedule}
      />
    </>
  );
};

export default TeacherDashboard;
