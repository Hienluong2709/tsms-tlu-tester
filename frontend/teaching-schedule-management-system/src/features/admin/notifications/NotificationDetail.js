import { useEffect, useMemo, useState } from "react";
import { accountApi } from "../../../api/AccountApi";
import "../../../styles/NotificationDetail.css";

function fmtDate(dt) {
  if (!dt) return "";
  try {
    const d = new Date(dt);
    const pad = (n) => String(n).padStart(2, "0");
    return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
  } catch {
    return String(dt);
  }
}

const TYPE_LABELS = { THAY_DOI_LICH: "Thay đổi lịch", HUY_LICH: "Hủy lịch" };
const toTypeLabel = (raw) => TYPE_LABELS[raw] || (raw || "");

const extractUserId = (rec) =>
  rec?.userId ?? rec?.user?.id ?? rec?.accountId ?? null;

const extractInlineName = (rec) =>
  rec?.user?.username ?? rec?.username ?? rec?.user?.fullName ?? rec?.fullName ?? rec?.name ?? null;

export default function NotificationDetail({ open, data, onClose }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === "Escape") onClose?.(); };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, onClose]);

  const recipients = useMemo(
    () => (Array.isArray(data?.recipients) ? data.recipients : []),
    [data?.recipients]
  );

  const unread = useMemo(
    () => recipients.filter((r) => !r.isRead).length,
    [recipients]
  );

  
  const [accountById, setAccountById] = useState({}); 
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;

    const ids = [
      ...new Set(
        recipients
          .map(extractUserId)
          .filter((id) => id !== null && id !== undefined && id !== "")
      ),
    ];

    if (ids.length === 0) {
      setAccountById({});
      return;
    }


    const needFetch = ids.filter((id) => !accountById[id]);
    if (needFetch.length === 0) return;

    let cancelled = false;
    setLoading(true);
    console.log("🔎 Fetch accounts by ids:", needFetch);

    (async () => {
      try {
        const results = await Promise.all(
          needFetch.map(async (uid) => {
            try {
              const acc = await accountApi.getById(uid); 
              return [uid, acc];
            } catch (e) {
              console.warn("⚠️ accountApi.getById failed:", uid, e?.response?.status || e);
              return [uid, null];
            }
          })
        );

        if (!cancelled) {
          setAccountById((prev) => {
            const next = { ...prev };
            results.forEach(([uid, acc]) => {
              if (acc) next[uid] = acc;
            });
            return next;
          });
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => { cancelled = true; };
    // accountById là cache; không muốn refetch trừ khi recipients thay đổi
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, recipients]);

  // Hiển thị username ưu tiên: Account.username → inline fallback → "User #id"
  const displayUser = (rec) => {
    const uid = extractUserId(rec);
    if (uid == null) return "—";

    const acc = accountById[uid];
    if (acc?.username) {
      console.log("➡️ Display username from Account", uid, ":", acc.username);
      return acc.username;
    }

    const inline = extractInlineName(rec);
    if (inline) {
      console.log("➡️ Display inline fallback for", uid, ":", inline);
      return inline;
    }

    console.log("➡️ Display fallback for", uid);
    return `User #${uid}`;
  };

  if (!open) return null;

  return (
    <div
      className="noti-modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-label="Chi tiết thông báo"
      onMouseDown={(e) => { if (e.target === e.currentTarget) onClose?.(); }}
    >
      <div className="noti-modal" onMouseDown={(e) => e.stopPropagation()}>
        <div className="noti-modal-header">
          <div>CHI TIẾT THÔNG BÁO</div>
          <button className="noti-close" onClick={onClose} aria-label="Đóng">×</button>
        </div>

        <div className="noti-modal-body">
          {!data ? (
            <div style={{ padding: 16 }}>Không có dữ liệu</div>
          ) : (
            <>
              <div className="noti-grid2">
                <div>
                  <label className="noti-label">Tiêu đề:</label>
                  <input className="noti-input" value={data.title || ""} readOnly />
                </div>
                <div>
                  <label className="noti-label">Loại:</label>
                  <input className="noti-input" value={toTypeLabel(data.type)} readOnly />
                </div>
                <div>
                  <label className="noti-label">Ngày tạo:</label>
                  <input className="noti-input" value={fmtDate(data.createdAt)} readOnly />
                </div>
                <div>
                  <label className="noti-label">Cập nhật:</label>
                  <input className="noti-input" value={fmtDate(data.updatedAt)} readOnly />
                </div>
              </div>

              <div style={{ marginTop: 16 }}>
                <div className="noti-subtitle">
                  Danh sách người nhận
                  {recipients.length > 0 && (
                    <span style={{ marginLeft: 8, color: "#6b7280", fontWeight: 400 }}>
                      (Tổng {recipients.length} — {recipients.length - unread} đã đọc{loading ? ", đang tải…" : ""})
                    </span>
                  )}
                </div>
                <table className="noti-table">
                  <thead>
                    <tr>
                      <th>STT</th>
                      <th>Username</th>
                      <th>Trạng thái</th>
                      <th>Thời điểm đọc</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recipients.length === 0 ? (
                      <tr><td colSpan={4} style={{ padding: 12 }}>Chưa có dữ liệu người nhận</td></tr>
                    ) : (
                      recipients.map((r, i) => (
                        <tr key={r.id ?? extractUserId(r) ?? i}>
                          <td>{i + 1}</td>
                          <td>{displayUser(r)}</td>
                          <td>{r.isRead ? "Đã đọc" : "Chưa đọc"}</td>
                          <td>{r.readAt ? fmtDate(r.readAt) : "—"}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>

        <div className="noti-modal-actions">
          <button className="noti-btn ghost" onClick={onClose}>Đóng</button>
        </div>
      </div>
    </div>
  );
}
