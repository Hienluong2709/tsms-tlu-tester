// src/features/teacher/schedule/RegisterMakeupModal.js
import React, { useEffect, useMemo, useState } from "react";
import { getTeachingSchedule, createMakeupClass } from "../../../api/RegisterMakeupApi";
import { useAuth } from "../../../contexts/AuthContext";
import "../../../styles/RegisterMakeupModal.css";
import { getNewRooms } from "../../../api/NewRoomApi";

/* ===== Helpers ===== */
const pad2 = (n) => String(n).padStart(2, "0");
const dateKeyLocal = (ts) => {
  try {
    const d = new Date(ts);
    if (isNaN(d)) return "";
    return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
  } catch {
    return "";
  }
};
const toVNDate = (ts) => {
  try {
    const d = new Date(ts);
    return isNaN(d)
      ? ""
      : d.toLocaleDateString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" });
  } catch {
    return "";
  }
};
const classKeyOf = (cls) => {
  const raw =
    cls?.id ??
    cls?.classSectionId ??
    cls?.code ??
    cls?.name ??
    `${cls?.subject?.name || ""}|${cls?.name || ""}|${cls?.semester?.academicYear || ""}`;
  return String(raw);
};
const dedupeDetails = (details) => {
  const map = new Map();
  details.forEach((d) => {
    const day = dateKeyLocal(d?.teachingDate);
    const ps = Number(d?.periodStart);
    const pe = Number(d?.periodEnd);
    if (!day || !Number.isFinite(ps) || !Number.isFinite(pe)) return;
    const key = `${day}|${ps}|${pe}`;
    if (!map.has(key)) map.set(key, d);
  });
  return Array.from(map.values());
};
const isYmd = (s) => /^\d{4}-\d{2}-\d{2}$/.test(String(s));

const RegisterMakeupModal = ({ isOpen, onClose, onSuccess }) => {
  const { user } = useAuth();

  // Data
  const [schedule, setSchedule] = useState([]);
  const [rooms, setRooms] = useState([]);

  // UI states
  const [loading, setLoading] = useState(false);
  const [roomsLoading, setRoomsLoading] = useState(false);
  const [errMsg, setErrMsg] = useState("");

  // Selections
  const [selectedClassId, setSelectedClassId] = useState("");
  const [selectedDetailId, setSelectedDetailId] = useState("");

  // Old periods (readonly)
  const [oldPeriodStart, setOldPeriodStart] = useState("");
  const [oldPeriodEnd, setOldPeriodEnd] = useState("");

  // New schedule info
  const [newDate, setNewDate] = useState("");
  const [newPeriodStart, setNewPeriodStart] = useState("");
  const [newPeriodEnd, setNewPeriodEnd] = useState("");
  const [newRoom, setNewRoom] = useState("");

  // Other fields
  const [lectureContent, setLectureContent] = useState("");
  const [reason, setReason] = useState("");
  const [fileUrl, setFileUrl] = useState(""); // chỉ nhập URL minh chứng

  /* ===== Load API lịch giảng + phòng học mới ===== */
  useEffect(() => {
    if (!isOpen) return;
    if (!user?.teacherId) {
      setErrMsg("Không tìm thấy teacherId. Vui lòng đăng nhập lại.");
      return;
    }

    let mounted = true;
    (async () => {
      try {
        setErrMsg("");
        setLoading(true);
        const list = await getTeachingSchedule(user.teacherId);
        if (mounted) setSchedule(Array.isArray(list) ? list : []);
      } catch (e) {
        if (mounted) setErrMsg("Không tải được lịch giảng. Vui lòng thử lại.");
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    (async () => {
      try {
        setRoomsLoading(true);
        const list = await getNewRooms();
        setRooms(Array.isArray(list) ? list : []);
      } catch (e) {
        console.error("Lỗi tải danh sách phòng:", e);
        setErrMsg((prev) => prev || "Không tải được danh sách phòng học.");
      } finally {
        setRoomsLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [isOpen, user]);

  /* ===== Gom nhóm theo lớp ===== */
  const classMap = useMemo(() => {
    const map = {};
    schedule.forEach((it) => {
      const cls = it?.classSection;
      if (!cls) return;
      const key = classKeyOf(cls);
      const detsSource = it?.details;
      const dets = Array.isArray(detsSource)
        ? detsSource
        : detsSource
        ? [detsSource]
        : [];
      const valid = dets.filter((d) => {
        const k = dateKeyLocal(d?.teachingDate);
        return (
          Boolean(k) &&
          Number.isFinite(Number(d?.periodStart)) &&
          Number.isFinite(Number(d?.periodEnd))
        );
      });
      if (!map[key]) map[key] = { cls, details: [] };
      map[key].details.push(...valid);
    });
    Object.keys(map).forEach((k) => {
      map[k].details = dedupeDetails(map[k].details);
    });
    return map;
  }, [schedule]);

  const selectedClass = selectedClassId ? classMap[selectedClassId]?.cls : null;
  const availableDetails = selectedClassId
    ? classMap[selectedClassId]?.details || []
    : [];

  const dateOptions = useMemo(() => {
    const out = [];
    const seen = new Set();
    availableDetails.forEach((d) => {
      const k = dateKeyLocal(d?.teachingDate);
      if (k && !seen.has(k)) {
        seen.add(k);
        out.push({
          key: k,
          id: d.id,
          label: toVNDate(d?.teachingDate),
          ps: d.periodStart,
          pe: d.periodEnd,
        });
      }
    });
    out.sort((a, b) => (a.key < b.key ? -1 : 1));
    return out;
  }, [availableDetails]);

  /* ===== Khi chọn detail, hiện tiết cũ ===== */
  useEffect(() => {
    if (!selectedDetailId) {
      setOldPeriodStart("");
      setOldPeriodEnd("");
      return;
    }
    const found = availableDetails.find((d) => String(d.id) === selectedDetailId);
    if (found) {
      setOldPeriodStart(String(found.periodStart));
      setOldPeriodEnd(String(found.periodEnd));
    }
  }, [selectedDetailId, availableDetails]);

  /* ===== Submit ===== */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !selectedDetailId ||
      !newDate ||
      !newPeriodStart ||
      !newPeriodEnd ||
      !newRoom
    ) {
      setErrMsg("Vui lòng nhập đủ các trường bắt buộc.");
      return;
    }
    if (!isYmd(newDate)) {
      setErrMsg("Ngày mới phải theo định dạng YYYY-MM-DD.");
      return;
    }

    const nDetail = Number(selectedDetailId);
    const nStart = Number(newPeriodStart);
    const nEnd = Number(newPeriodEnd);
    const nRoom = Number(newRoom);

    if (!Number.isFinite(nDetail)) {
      setErrMsg("Chi tiết lịch dạy không hợp lệ.");
      return;
    }
    if (
      !Number.isFinite(nStart) ||
      !Number.isFinite(nEnd) ||
      nStart <= 0 ||
      nEnd <= 0 ||
      nStart > nEnd
    ) {
      setErrMsg(
        "Tiết học không hợp lệ (bắt đầu/kết thúc và bắt đầu ≤ kết thúc)."
      );
      return;
    }
    if (!Number.isFinite(nRoom) || nRoom <= 0) {
      setErrMsg("Phòng học mới không hợp lệ.");
      return;
    }

    const payload = {
      teachingScheduleDetailId: nDetail,
      newPeriodStart: nStart,
      newPeriodEnd: nEnd,
      newDate,
      newRoomId: nRoom,
      lectureContent: lectureContent?.trim() || null,
      reason: reason?.trim() || null,
      fileUrl: fileUrl?.trim() || null, // URL minh chứng
    };

    try {
      setErrMsg("");
      await createMakeupClass(payload);
      onSuccess?.();
      onClose?.();
    } catch (err) {
      const status = err?.response?.status;
      const data = err?.response?.data;
      console.group("❌ API ERROR createMakeupClass");
      console.error("status:", status);
      console.error("data:", data);
      console.error("full error:", err);
      console.groupEnd();

      const serverMsg =
        (typeof data === "string" && data) ||
        data?.message ||
        data?.error ||
        "Gửi đăng ký thất bại. Vui lòng kiểm tra dữ liệu và thử lại.";
      setErrMsg(serverMsg);
    }
  };

  if (!isOpen) return null;

  const disableSubmit = loading || roomsLoading;

  return (
    <div className="rm-overlay" onClick={onClose}>
      <div className="rm-modal" onClick={(e) => e.stopPropagation()}>
        <div className="rm-header">
          <div className="rm-title">ĐĂNG KÝ DẠY BÙ</div>
          <button className="rm-close" onClick={onClose}>
            ✕
          </button>
        </div>

        <form className="rm-body" onSubmit={handleSubmit}>
          {errMsg && <div className="rm-alert">{errMsg}</div>}

          {loading ? (
            <div className="rm-loading">Đang tải dữ liệu lịch giảng...</div>
          ) : (
            <>
              {/* Lớp học phần */}
              <div className="rm-field rm-col-2">
                <label>
                  Lớp học phần: <span className="rm-required">*</span>
                </label>
                <select
                  value={selectedClassId}
                  onChange={(e) => {
                    setSelectedClassId(e.target.value);
                    setSelectedDetailId("");
                    setOldPeriodStart("");
                    setOldPeriodEnd("");
                  }}
                  required
                >
                  <option value="">-- Chọn học phần --</option>
                  {Object.entries(classMap).map(([key, { cls }]) => {
                    const label = `${cls?.subject?.name || "Môn"} (${
                      cls?.name || "Lớp"
                    })`;
                    return (
                      <option key={key} value={key}>
                        {label}
                      </option>
                    );
                  })}
                </select>
              </div>

              {/* Khoa - Bộ môn */}
              <div className="rm-row-2">
                <div className="rm-field">
                  <label>
                    Khoa quản lý: <span className="rm-required">*</span>
                  </label>
                  <input
                    type="text"
                    value={selectedClass?.faculty?.name || ""}
                    readOnly
                  />
                </div>
                <div className="rm-field">
                  <label>
                    Bộ môn quản lý: <span className="rm-required">*</span>
                  </label>
                  <input
                    type="text"
                    value={selectedClass?.department?.name || ""}
                    readOnly
                  />
                </div>
              </div>

              {/* Ngày giảng cũ - Ngày giảng mới */}
              <div className="rm-row-2">
                <div className="rm-field">
                  <label>
                    Ngày giảng cũ: <span className="rm-required">*</span>
                  </label>
                  <select
                    value={selectedDetailId}
                    onChange={(e) => setSelectedDetailId(e.target.value)}
                    disabled={!selectedClassId}
                    required
                  >
                    <option value="">-- Chọn ngày giảng --</option>
                    {dateOptions.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="rm-field">
                  <label>
                    Ngày giảng mới: <span className="rm-required">*</span>
                  </label>
                  <input
                    type="date"
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    required
                  />
                </div>
              </div>

             
              {/* Tiết học mới */}
              <div className="rm-row-2">
                <div className="rm-field">
                  <label>
                    Tiết bắt đầu (mới): <span className="rm-required">*</span>
                  </label>
                  <input
                    type="number"
                    value={newPeriodStart}
                    onChange={(e) => setNewPeriodStart(e.target.value)}
                    required
                    min={1}
                  />
                </div>
                <div className="rm-field">
                  <label>
                    Tiết kết thúc (mới): <span className="rm-required">*</span>
                  </label>
                  <input
                    type="number"
                    value={newPeriodEnd}
                    onChange={(e) => setNewPeriodEnd(e.target.value)}
                    required
                    min={1}
                  />
                </div>
              </div>

              {/* Phòng học */}
              <div className="rm-row-2">
                <div className="rm-field">
                  <label>Phòng học cũ:</label>
                  <input
                    type="text"
                    value={selectedClass?.room?.name || ""}
                    readOnly
                  />
                </div>
                <div className="rm-field">
                  <label>
                    Phòng học mới: <span className="rm-required">*</span>
                  </label>
                  {roomsLoading ? (
                    <div className="rm-loading">Đang tải danh sách phòng...</div>
                  ) : (
                    <select
                      value={newRoom}
                      onChange={(e) => setNewRoom(e.target.value)}
                      required
                    >
                      <option value="">-- Chọn phòng học --</option>
                      {rooms.map((room) => (
                        <option key={room.id} value={room.id}>
                          {room.building ?? "—"}-{room.name ?? room.code ?? "?"}
                          {room.capacity ? ` (Sức chứa ${room.capacity})` : ""}
                          {room.type ? ` • ${room.type}` : ""}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              </div>

              {/* Nội dung bài giảng */}
              <div className="rm-field rm-col-2">
                <label>Nội dung bài giảng:</label>
                <input
                  type="text"
                  value={lectureContent}
                  onChange={(e) => setLectureContent(e.target.value)}
                  placeholder="Nhập nội dung bài giảng"
                />
              </div>

              {/* Lý do */}
              <div className="rm-field rm-col-2">
                <label>Lý do:</label>
                <input
                  type="text"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Nhập lý do"
                />
              </div>

              {/* Tài liệu (URL) */}
              <div className="rm-field rm-col-2">
                <label>Tài liệu (URL):</label>
                <input
                  type="url"
                  value={fileUrl}
                  onChange={(e) => setFileUrl(e.target.value)}
                  placeholder="https://example.com/tailieu.pdf"
                />
              </div>

              {/* Actions */}
              <div className="rm-actions">
                <button
                  type="submit"
                  className="rm-primary"
                  disabled={disableSubmit}
                >
                  {disableSubmit ? "Đang xử lý..." : "Xác nhận"}
                </button>
                <button
                  type="button"
                  className="rm-secondary"
                  onClick={onClose}
                >
                  Hủy bỏ
                </button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
};

export default RegisterMakeupModal;
