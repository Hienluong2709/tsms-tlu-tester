import React, { useEffect, useMemo, useState } from "react";
import { FaTimes } from "react-icons/fa";
import TeachingScheduleApi from "../../../api/TeachingScheduleApi";
import "../../../styles/TeachingScheduleForm.css";

const WEEKDAY_VI = ["Chủ nhật","Thứ 2","Thứ 3","Thứ 4","Thứ 5","Thứ 6","Thứ 7"];

const pad = (n) => String(n).padStart(2, "0");
const toLocalYMD = (d) => `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;
const parseYMD = (ymd) => {
  const [y,m,d] = String(ymd).split("-").map(Number);
  return new Date(y, (m||1)-1, d||1, 0,0,0,0); // local
};

const ensureYMD = (val) => {
  if (!val) return "";
  const s = String(val);
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;
  const tIdx = s.indexOf("T");
  if (tIdx > 0) return s.slice(0, 10);
  const d = new Date(s);
  return isNaN(d) ? "" : toLocalYMD(d);
};

export default function TeachingScheduleDetail({ open, id, onClose }) {
  const [loading, setLoading] = useState(false);
  const [schedule, setSchedule] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!open || !id) return;
    let mounted = true;
    setLoading(true);
    setError(null);
    TeachingScheduleApi.getTeachingScheduleById(id)
      .then(data => { if (mounted) setSchedule(data); })
      .catch(err => {
        if (!mounted) return;
        console.error("[Detail] fetch error", err);
        setError("Không thể tải chi tiết");
      })
      .finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, [open, id]);

  const details = useMemo(() => {
    const arr = (schedule?.details ?? []).map(d => {
      const ymd = ensureYMD(d?.teachingDate);
      const dow = ymd ? parseYMD(ymd).getDay() : null;
      return {
        ...d,
        _ymd: ymd,
        _dow: dow
      };
    });
    return arr.sort((a,b) => (a._ymd || "").localeCompare(b._ymd || ""));
  }, [schedule]);

  if (!open) return null;

  return (
    <div className="tsf-overlay" onClick={onClose}>
      <div className="tsf-modal" onClick={e => e.stopPropagation()}>
        <div className="tsf-header">
          <h3>Chi tiết lịch giảng dạy</h3>
          <button className="tsf-close" onClick={onClose}><FaTimes/></button>
        </div>
        <div className="tsf-body">
          {loading && <p>Đang tải chi tiết…</p>}
          {error && <p className="error-text">{error}</p>}

          {schedule && !loading && !error && (
            <div>
              <div className="tsf-row" style={{ marginBottom: '1rem' }}>
                <div className="tsf-field">
                  <label>Giảng viên</label>
                  <input type="text" value={schedule?.classSection?.teacher?.fullName || ""} disabled />
                </div>
                <div className="tsf-field">
                  <label>Lớp học phần</label>
                  <input type="text" value={schedule?.classSection?.name || ""} disabled />
                </div>
              </div>

              <div className="tsf-row" style={{ marginBottom: '1rem' }}>
                <div className="tsf-field">
                  <label>Học phần</label>
                  <input type="text" value={schedule?.classSection?.subject?.name || ""} disabled />
                </div>
                <div className="tsf-field">
                  <label>Học kỳ</label>
                  <input type="text" value={schedule?.classSection?.semester?.academicYear || ""} disabled />
                </div>
              </div>

              <div className="tsf-row" style={{ marginBottom: '1rem' }}>
                <div className="tsf-field">
                  <label>Phòng</label>
                  <input type="text" value={schedule?.classSection?.room?.name || ""} disabled />
                </div>
                <div className="tsf-field">
                  <label>Số buổi</label>
                  <input type="text" value={(details?.length || 0) + " buổi"} disabled />
                </div>
              </div>

              <h4>Chi tiết buổi dạy</h4>
              <table className="account-table">
                <thead>
                  <tr>
                    <th>Thứ</th>
                    <th>Ngày</th>
                    <th>Tiết bắt đầu</th>
                    <th>Tiết kết thúc</th>
                    <th>Loại</th>
                  </tr>
                </thead>
                <tbody>
                  {details.map((d, i) => (
                    <tr key={i}>
                      <td>{d._dow != null ? WEEKDAY_VI[d._dow] : ""}</td>
                      <td>{d._ymd}</td>
                      <td>{Number(d?.periodStart)}</td>
                      <td>{Number(d?.periodEnd)}</td>
                      <td>{d?.type}</td>
                    </tr>
                  ))}
                  {(!details || details.length === 0) && (
                    <tr><td colSpan={5} style={{textAlign:"center"}}>Không có dữ liệu</td></tr>
                  )}
                </tbody>
              </table>

              {schedule?.note && (
                <div className="tsf-field" style={{ marginTop: '1rem' }}>
                  <label>Ghi chú</label>
                  <textarea value={schedule.note} disabled rows={3} />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
