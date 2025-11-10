import { useEffect, useMemo, useRef, useState } from "react";
import { FaSearch, FaInfoCircle, FaPaperPlane } from "react-icons/fa";
import NotificationApi from "../../../api/NotificationApi";
import "../../../styles/NotificationsList.css";
import "../../../styles/Toast.css";
import AppToast from "../../../components/AppToast";
import NotificationDetail from "./NotificationDetail";

function fmtDate(dt) {
  if (!dt) return "";
  try {
    const d = new Date(dt);
    const pad = (n) => String(n).padStart(2, "0");
    return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} ${pad(
      d.getHours()
    )}:${pad(d.getMinutes())}`;
  } catch {
    return String(dt);
  }
}

const TYPE_LABELS = { THAY_DOI_LICH: "Thay đổi lịch", HUY_LICH: "Hủy lịch" };
const toTypeLabel = (raw) => TYPE_LABELS[raw] || (raw || "");

export default function NotificationsList() {
  const [rows, setRows] = useState([]);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("ALL");

  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);

  // Modal xem chi tiết: chỉ giữ object từ list
  const [showDetail, setShowDetail] = useState(false);
  const [detailItem, setDetailItem] = useState(null);

  const toastRef = useRef(null);

  const load = async (signal) => {
    setLoading(true);
    try {
      const res = await NotificationApi.fetchPage({
        page,
        size,
        search: search.trim(),
        sort: "createdAt,desc",
      });
      if (signal?.aborted) return;

      if (Array.isArray(res)) {
        const q = search.trim().toLowerCase();
        let filtered = res;
        if (q) {
          filtered = filtered.filter(
            (n) =>
              (n.title || "").toLowerCase().includes(q) ||
              (n.content || "").toLowerCase().includes(q) ||
              (n.type || "").toLowerCase().includes(q)
          );
        }
        if (typeFilter !== "ALL")
          filtered = filtered.filter((n) => (n.type || "") === typeFilter);

        const sorted = [...filtered].sort(
          (a, b) =>
            (Date.parse(b.createdAt || "") || 0) -
            (Date.parse(a.createdAt || "") || 0)
        );
        const totalAll = sorted.length;
        const start = page * size;
        const end = start + size;

        setRows(sorted.slice(start, end));
        setTotal(totalAll);
        setTotalPages(Math.max(1, Math.ceil(totalAll / size)));
      } else {
        let pageData = res?.content || [];
        if (typeFilter !== "ALL")
          pageData = pageData.filter((n) => (n.type || "") === typeFilter);
        setRows(pageData);
        setTotal(res?.totalElements || pageData.length || 0);
        setTotalPages(res?.totalPages || 0);
      }
    } catch (err) {
      if (!signal?.aborted) {
        console.error("[Notifications] load error", err);
        setRows([]);
        setTotal(0);
        setTotalPages(0);
        toastRef.current?.error("Không thể tải danh sách thông báo");
      }
    } finally {
      if (!signal?.aborted) setLoading(false);
    }
  };

  useEffect(() => {
    const ctrl = new AbortController();
    load(ctrl.signal);
    return () => ctrl.abort();
  }, [page, size, search, typeFilter]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(0);
  };

  const rangeText = useMemo(() => {
    const start = total === 0 ? 0 : page * size + 1;
    const end = Math.min(total, (page + 1) * size);
    return `Từ ${start} đến ${end} bản ghi`;
  }, [page, size, total]);

  const renderRow = (n, i) => {
    const id = n.id ?? `noti-${i}`;
    const recipients = Array.isArray(n.recipients) ? n.recipients : [];
    const unread = recipients.filter((r) => !r.isRead).length;
    const receiversCount = recipients.length;
    const status =
      receiversCount === 0 ? "Chưa gửi" : unread > 0 ? "Đã gửi" : "Đã đọc hết";
    const canPublish = receiversCount === 0;

    return (
      <tr key={id}>
        <td>{page * size + i + 1}</td>
        <td className="noti-title-cell">
          <div className="noti-title-text">{n.title || ""}</div>
          <div className="noti-subtext">{n.content || ""}</div>
        </td>
        <td>{toTypeLabel(n.type)}</td>
        <td>{fmtDate(n.createdAt)}</td>
        <td>
          {receiversCount}{" "}
          {receiversCount > 0 && (
            <span className="noti-subtext">
              ({receiversCount - unread} đã đọc)
            </span>
          )}
        </td>
        <td>{status}</td>
        <td>
          <div className="noti-actions">
            {canPublish && (
              <button
                type="button"
                className="noti-btn primary"
                title="Gửi thông báo"
                onClick={async () => {
                  try {
                    await NotificationApi.publish(n.id);
                    toastRef.current?.success("Đã gửi thông báo");
                    const ctrl = new AbortController();
                    await load(ctrl.signal);
                  } catch (e) {
                    console.error(e);
                    toastRef.current?.error(
                      "Không thể gửi. Kiểm tra endpoint /{id}/publish."
                    );
                  }
                }}
              >
                <FaPaperPlane style={{ marginRight: 6 }} />
                Gửi
              </button>
            )}

            {/* Xem chi tiết: chỉ mở modal với dữ liệu từ list */}
            <FaInfoCircle
              className="noti-detail-icon"
              title="Chi tiết"
              onClick={() => {
                setDetailItem(n);
                setShowDetail(true);
              }}
            />
          </div>
        </td>
      </tr>
    );
  };

  return (
    <div className="noti-container">
      <AppToast ref={toastRef} />

      {showDetail && (
        <>
          {/* chỉ truyền object từ list */}
          <NotificationDetail
            open={showDetail}
            data={detailItem}
            onClose={() => {
              setShowDetail(false);
              setDetailItem(null);
            }}
          />
        </>
      )}

      {/* HEADER: Loại (trái) / Tìm kiếm (phải) */}
      <div className="noti-header">
        <div className="noti-header-left">
          <label className="noti-filter-label" htmlFor="typeFilter">
            Loại
          </label>
        <select
            id="typeFilter"
            className="noti-filter-select"
            value={typeFilter}
            onChange={(e) => {
              setTypeFilter(e.target.value);
              setPage(0);
            }}
          >
            <option value="ALL">Tất cả</option>
            <option value="THAY_DOI_LICH">Thay đổi lịch</option>
            <option value="HUY_LICH">Hủy lịch</option>
          </select>
        </div>

        <form className="noti-search" onSubmit={handleSearch}>
          <input
            className="noti-search-input"
            placeholder="Tìm theo tiêu đề/nội dung"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <FaSearch className="noti-search-icon" onClick={handleSearch} />
        </form>
      </div>

      {/* TABLE */}
      <table className="noti-table">
        <thead>
          <tr>
            <th>STT</th>
            <th>Tiêu đề / Nội dung</th>
            <th>Loại</th>
            <th>Ngày tạo</th>
            <th>Số người nhận</th>
            <th>Trạng thái</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={7} style={{ padding: 16 }}>
                Đang tải…
              </td>
            </tr>
          ) : rows.length === 0 ? (
            <tr>
              <td colSpan={7} style={{ padding: 16 }}>
                Không có dữ liệu
              </td>
            </tr>
          ) : (
            rows.map(renderRow)
          )}
        </tbody>
      </table>

      {/* FOOTER / PAGINATION */}
      <div className="footer">
        <div>
          Hiển thị {rows.length} kết quả
          {search && ` (lọc từ ${total})`}
        </div>
        <div className="pagination">
          <select
            value={size}
            onChange={(e) => {
              setPage(0);
              setSize(Number(e.target.value));
            }}
          >
            <option value="10">10</option>
            <option value="25">25</option>
            <option value="50">50</option>
          </select>
          <span>{rangeText}</span>
          <button disabled={page <= 0} onClick={() => setPage(page - 1)}>
            &lt;
          </button>
          <button
            disabled={page + 1 >= totalPages}
            onClick={() => setPage(page + 1)}
          >
            &gt;
          </button>
        </div>
      </div>
    </div>
  );
}
