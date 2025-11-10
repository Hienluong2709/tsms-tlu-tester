// src/features/teacher/schedule/ScheduleManagement.js
import React, { useEffect, useState, useCallback } from "react";
import { FaCalendarAlt, FaClock, FaMapMarkerAlt } from "react-icons/fa";
import { getScheduleChanges } from "../../../api/TeachingScheduleChangeApi";
import RegisterLeaveModal from "./RegisterLeaveModal";
import RegisterMakeupModal from "./RegisterMakeupModal"; // <-- thêm import
import "../../../styles/ScheduleManagement.css";

const ScheduleManagement = () => {
  const [scheduleChanges, setScheduleChanges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [showMakeupModal, setShowMakeupModal] = useState(false); // <-- thêm state
  const [errMsg, setErrMsg] = useState("");

  // ===== Helpers =====
  const ts = (v) => {
    const d = v ? new Date(v) : null;
    return d && !isNaN(d) ? d.getTime() : Number.NEGATIVE_INFINITY;
  };

  const num = (v) => {
    const n = Number(v);
    return Number.isFinite(n) ? n : Number.NEGATIVE_INFINITY;
  };

  const sortByCreatedDesc = useCallback((arr) => {
    return [...(Array.isArray(arr) ? arr : [])].sort((a, b) => {
      const ca = ts(a?.createdAt);
      const cb = ts(b?.createdAt);
      if (cb !== ca) return cb - ca;

      const ua = ts(a?.updatedAt);
      const ub = ts(b?.updatedAt);
      if (ub !== ua) return ub - ua;

      return num(b?.id) - num(a?.id);
    });
  }, []);

  const formatDate = (tsOrIso) => {
    if (!tsOrIso) return "";
    const date = new Date(tsOrIso);
    return isNaN(date.getTime()) ? "" : date.toLocaleDateString("vi-VN");
  };

  const getStatusLabel = (status) => {
    if (!status) return { label: "Không xác định", className: "status-unknown" };
    switch (status) {
      case "DA_DUYET":
        return { label: "Đã duyệt", className: "status-approved" };
      case "CHO_DUYET":
      case "CHUA_DUYET":
        return { label: "Chờ duyệt", className: "status-pending" };
      case "TU_CHOI":
        return { label: "Từ chối", className: "status-rejected" };
      default:
        return { label: status, className: "" };
    }
  };

  const getTypeLabel = (type) => {
    if (!type) return "Không rõ";
    switch (type) {
      case "HUY_LICH":
        return "Nghỉ dạy";
      case "DAY_BU":
        return "Dạy bù";
      default:
        return type;
    }
  };

  // ===== Fetch & sort =====
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setErrMsg("");
      const data = await getScheduleChanges();
      setScheduleChanges(sortByCreatedDesc(data));
    } catch (err) {
      console.error("Không lấy được dữ liệu:", err);
      setErrMsg("Không lấy được dữ liệu.");
      setScheduleChanges([]);
    } finally {
      setLoading(false);
    }
  }, [sortByCreatedDesc]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // ===== Modal success handler =====
  const handleLeaveSuccess = useCallback(
    (newItem) => {
      if (newItem) {
        setScheduleChanges((prev) =>
          sortByCreatedDesc([newItem, ...prev.filter((x) => x?.id !== newItem?.id)])
        );
      } else {
        fetchData();
      }
      setShowLeaveModal(false);
    },
    [fetchData, sortByCreatedDesc]
  );

  // ===== Handler cho dạy bù =====
  const handleMakeupSuccess = useCallback(
    (newItem) => {
      if (newItem) {
        setScheduleChanges((prev) =>
          sortByCreatedDesc([newItem, ...prev.filter((x) => x?.id !== newItem?.id)])
        );
      } else {
        fetchData();
      }
      setShowMakeupModal(false);
    },
    [fetchData, sortByCreatedDesc]
  );

  // ===== Render =====
  return (
    <div className="schedule-management">
      <div className="schedule-header-top">
        <h2>Danh sách đăng ký nghỉ dạy & dạy bù</h2>
        <div className="action-buttons">
          <button className="btn-leave" onClick={() => setShowLeaveModal(true)}>
            + Đăng ký nghỉ dạy
          </button>
          <button className="btn-makeup" onClick={() => setShowMakeupModal(true)}>
            + Đăng ký dạy bù
          </button>
        </div>
      </div>

      {loading ? (
        <p>Đang tải dữ liệu...</p>
      ) : errMsg ? (
        <p>{errMsg}</p>
      ) : scheduleChanges.length === 0 ? (
        <p>Không có dữ liệu</p>
      ) : (
        <ul className="schedule-list">
          {scheduleChanges.map((item) => {
            const status = getStatusLabel(item?.status);
            const key =
              item?.id ??
              `${item?.type || "TYPE"}-${item?.classSection?.name || "CLS"}-${
                item?.details?.teachingDate || Math.random()
              }`;

            return (
              <li key={key} className="schedule-item">
                <div className="schedule-header">
                  <strong>
                    {getTypeLabel(item?.type)} - {item?.classSection?.subject?.name || "Không rõ"} (
                    {item?.classSection?.name || "N/A"})
                  </strong>
                  <span className={`status-badge ${status.className}`}>{status.label}</span>
                </div>

                <div className="schedule-info">
                  <p>
                    <FaCalendarAlt /> Ngày: {formatDate(item?.details?.teachingDate)}
                  </p>
                  <p>
                    <FaClock /> Tiết {item?.details?.periodStart ?? "?"} -{" "}
                    {item?.details?.periodEnd ?? "?"}
                  </p>
                  <p>
                    <FaMapMarkerAlt /> {item?.classSection?.room?.name || "Không rõ"}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {/* Modal đăng ký nghỉ dạy */}
      {showLeaveModal && (
        <RegisterLeaveModal
          isOpen={showLeaveModal}
          onClose={() => setShowLeaveModal(false)}
          onSuccess={handleLeaveSuccess}
        />
      )}

      {/* Modal đăng ký dạy bù */}
      {showMakeupModal && (
        <RegisterMakeupModal
          isOpen={showMakeupModal}   // <-- truyền isOpen
          onClose={() => setShowMakeupModal(false)}
          onSuccess={handleMakeupSuccess}
        />
      )}
    </div>
  );
};

export default ScheduleManagement;
