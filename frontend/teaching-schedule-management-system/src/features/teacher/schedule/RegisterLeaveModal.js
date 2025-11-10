import React, { useEffect, useMemo, useState } from "react";
import { getLeaveCandidates, createLeaveRequest } from "../../../api/RegisterLeaveApi";
import { useAuth } from "../../../contexts/AuthContext";
import "../../../styles/RegisterLeaveModal.css";

/* ======================= Helpers ======================= */
const pad2 = (n) => String(n).padStart(2, "0");

// YYYY-MM-DD theo LOCAL TIME
const dateKeyLocal = (ts) => {
  try {
    const d = new Date(ts);
    if (isNaN(d)) return "";
    return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
  } catch {
    return "";
  }
};

// Hiển thị ngày theo vi-VN
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

// Khóa ổn định cho classSection
const classKeyOf = (cls) => {
  const raw =
    cls?.id ??
    cls?.classSectionId ??
    cls?.code ??
    cls?.name ??
    `${cls?.subject?.name || ""}|${cls?.name || ""}|${cls?.semester?.academicYear || ""}`;
  return String(raw);
};

// Khử trùng lặp buổi dạy
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

const RegisterLeaveModal = ({ isOpen, onClose, onSuccess }) => {
  const { user } = useAuth();

  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errMsg, setErrMsg] = useState("");

  const [selectedClassId, setSelectedClassId] = useState("");
  const [selectedDetailId, setSelectedDetailId] = useState("");
  const [selectedDateKey, setSelectedDateKey] = useState("");
  const [selectedPeriodStart, setSelectedPeriodStart] = useState("");
  const [selectedPeriodEnd, setSelectedPeriodEnd] = useState("");

  const [reason, setReason] = useState("");
  const [fileObj, setFileObj] = useState(null);

  useEffect(() => {
    if (!isOpen) return;
    if (!user?.teacherId) {
      setErrMsg("Không tìm thấy teacherId. Vui lòng đăng nhập lại.");
      return;
    }
    setLoading(true);
    setErrMsg("");
    (async () => {
      const list = await getLeaveCandidates(user.teacherId);
      setCandidates(Array.isArray(list) ? list : []);
      setLoading(false);
    })();
  }, [isOpen, user]);

  const classMap = useMemo(() => {
    const map = {};
    candidates.forEach((it) => {
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
        return Boolean(k) && Number.isFinite(Number(d?.periodStart)) && Number.isFinite(Number(d?.periodEnd));
      });
      if (!map[key]) map[key] = { cls, details: [] };
      map[key].details.push(...valid);
    });
    Object.keys(map).forEach((k) => {
      map[k].details = dedupeDetails(map[k].details);
    });
    return map;
  }, [candidates]);

  const selectedClass = selectedClassId ? classMap[selectedClassId]?.cls : null;
  const availableDetailsRaw = selectedClassId ? (classMap[selectedClassId]?.details || []) : [];
  const todayKey = dateKeyLocal(new Date());

  const futureDetails = useMemo(() => {
    return availableDetailsRaw.filter((d) => {
      const k = dateKeyLocal(d?.teachingDate);
      return k && k >= todayKey;
    });
  }, [availableDetailsRaw, todayKey]);

  const availableDateOptions = useMemo(() => {
    const seen = new Set();
    const out = [];
    futureDetails.forEach((d) => {
      const key = dateKeyLocal(d?.teachingDate);
      if (key && !seen.has(key)) {
        seen.add(key);
        out.push({ key, label: toVNDate(d?.teachingDate) });
      }
    });
    out.sort((a, b) => (a.key < b.key ? -1 : a.key > b.key ? 1 : 0));
    return out;
  }, [futureDetails]);

  const periodChoices = useMemo(() => {
    if (!selectedDateKey) return [];
    const map = new Map();
    futureDetails.forEach((d) => {
      if (dateKeyLocal(d?.teachingDate) !== selectedDateKey) return;
      const ps = Number(d?.periodStart);
      const pe = Number(d?.periodEnd);
      if (!Number.isFinite(ps) || !Number.isFinite(pe)) return;
      const key = `${ps}-${pe}`;
      if (!map.has(key)) map.set(key, { id: d?.id, ps, pe, label: `Tiết ${ps} → ${pe}` });
    });
    return Array.from(map.values()).sort((a, b) => a.ps - b.ps || a.pe - b.pe);
  }, [futureDetails, selectedDateKey]);

  useEffect(() => {
    setSelectedPeriodStart("");
    setSelectedPeriodEnd("");
    setSelectedDetailId("");
    if (!selectedDateKey) return;
    if (periodChoices.length === 1) {
      const only = periodChoices[0];
      setSelectedPeriodStart(String(only.ps));
      setSelectedPeriodEnd(String(only.pe));
      setSelectedDetailId(only.id ? String(only.id) : "");
    }
  }, [selectedDateKey, periodChoices]);

  const handleChangePeriodChoice = (key) => {
    const found = periodChoices.find((p) => `${p.ps}-${p.pe}` === key);
    if (!found) return;
    setSelectedPeriodStart(String(found.ps));
    setSelectedPeriodEnd(String(found.pe));
    setSelectedDetailId(found.id ? String(found.id) : "");
  };

  useEffect(() => {
    if (!isOpen) return;
    const onEsc = (e) => e.key === "Escape" && onClose?.();
    window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, [isOpen, onClose]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedDetailId) {
      setErrMsg("Vui lòng chọn Ngày giảng hợp lệ (và ca dạy nếu có nhiều ca).");
      return;
    }
    if (!reason.trim()) {
      setErrMsg("Vui lòng nhập lý do nghỉ dạy.");
      return;
    }
    try {
      setErrMsg("");
      const payload = {
        teachingScheduleDetailId: selectedDetailId,
        reason: reason.trim(),
        file: fileObj || undefined, // gửi file object nếu cần
      };
      await createLeaveRequest(payload);
      onSuccess?.();
      onClose?.();
    } catch (err) {
      console.error(err);
      setErrMsg("Gửi đăng ký thất bại. Vui lòng thử lại.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="rl-overlay" onClick={onClose}>
      <div className="rl-modal" onClick={(e) => e.stopPropagation()}>
        <div className="rl-header">
          <div className="rl-title">ĐĂNG KÝ NGHỈ DẠY</div>
          <button className="rl-close" onClick={onClose} aria-label="Đóng">✕</button>
        </div>

        <form className="rl-body" onSubmit={handleSubmit}>
          {errMsg && <div className="rl-alert">{errMsg}</div>}
          {loading ? (
            <div className="rl-loading">Đang tải dữ liệu...</div>
          ) : (
            <>
              {/* Lớp học phần */}
              <div className="rl-field rl-col-2">
                <label>Lớp học phần: <span className="rl-required">*</span></label>
                <select
                  value={selectedClassId}
                  onChange={(e) => {
                    const val = e.target.value;
                    setSelectedClassId(val);
                    setSelectedDateKey("");
                    setSelectedPeriodStart("");
                    setSelectedPeriodEnd("");
                    setSelectedDetailId("");
                  }}
                  required
                >
                  <option value="">-- Chọn học phần --</option>
                  {Object.entries(classMap).map(([key, { cls }]) => {
                    const label = `${cls?.subject?.name || "Môn"} (${cls?.name || "Lớp"})`;
                    return (
                      <option key={key} value={key}>{label}</option>
                    );
                  })}
                </select>
              </div>

              {/* Khoa - Bộ môn */}
              <div className="rl-row-2">
                <div className="rl-field">
                  <label>Khoa quản lý:</label>
                  <input type="text" value={selectedClass?.faculty?.name || ""} readOnly />
                </div>
                <div className="rl-field">
                  <label>Bộ môn quản lý:</label>
                  <input type="text" value={selectedClass?.department?.name || ""} readOnly />
                </div>
              </div>

              {/* Ngày giảng - Phòng */}
              <div className="rl-row-2">
                <div className="rl-field">
                  <label>Ngày giảng: <span className="rl-required">*</span></label>
                  <select
                    value={selectedDateKey}
                    onChange={(e) => setSelectedDateKey(e.target.value)}
                    disabled={!selectedClassId}
                    required
                  >
                    {availableDateOptions.length === 0 ? (
                      <option value="">(Không có ngày giảng từ hôm nay trở đi)</option>
                    ) : (
                      <>
                        <option value="">-- Chọn ngày giảng --</option>
                        {availableDateOptions.map((d) => (
                          <option key={d.key} value={d.key}>{d.label}</option>
                        ))}
                      </>
                    )}
                  </select>
                </div>
                <div className="rl-field">
                  <label>Phòng học:</label>
                  <input type="text" value={selectedClass?.room?.name || ""} readOnly />
                </div>
              </div>

              {/* Chọn ca nếu nhiều */}
              {selectedDateKey && periodChoices.length > 1 && (
                <div className="rl-field rl-col-2">
                  <label>Chọn ca trong ngày:</label>
                  <div className="rl-radio-group">
                    {periodChoices.map((p) => {
                      const key = `${p.ps}-${p.pe}`;
                      const checked = String(p.ps) === selectedPeriodStart && String(p.pe) === selectedPeriodEnd;
                      return (
                        <label key={key} className="rl-radio">
                          <input
                            type="radio"
                            name="periodChoice"
                            value={key}
                            checked={checked}
                            onChange={(e) => handleChangePeriodChoice(e.target.value)}
                          />
                          <span>{p.label}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Tiết bắt đầu - kết thúc */}
              <div className="rl-row-2">
                <div className="rl-field">
                  <label>Tiết bắt đầu:</label>
                  <input type="text" value={selectedPeriodStart} placeholder="—" readOnly />
                </div>
                <div className="rl-field">
                  <label>Tiết kết thúc:</label>
                  <input type="text" value={selectedPeriodEnd} placeholder="—" readOnly />
                </div>
              </div>

              {/* Lý do */}
              <div className="rl-field rl-col-2">
                <label>Lí do đăng ký nghỉ dạy: <span className="rl-required">*</span></label>
                <textarea
                  rows={3}
                  placeholder="Nhập lý do..."
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  required
                />
              </div>

              {/* Minh chứng */}
              <div className="rl-field rl-col-2">
                <label>Minh chứng (PDF):</label>
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    setFileObj(f || null);
                  }}
                />
              </div>

              {/* Actions */}
              <div className="rl-actions">
                <button type="submit" className="rl-primary">Xác nhận</button>
                <button type="button" className="rl-secondary" onClick={onClose}>Hủy bỏ</button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
};

export default RegisterLeaveModal;
