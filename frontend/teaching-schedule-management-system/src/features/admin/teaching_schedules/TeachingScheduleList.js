import { useEffect, useMemo, useState, useRef } from "react";
import TeachingScheduleApi from "../../../api/TeachingScheduleApi";
import { FaSearch, FaInfoCircle, FaPen, FaTrash } from "react-icons/fa";
import "../../../styles/DepartmentList.css";
import "../../../styles/Toast.css"; 
import TeachingScheduleForm from "./TeachingScheduleForm";
import TeachingScheduleDetail from "./TeachingScheduleDetail";
import DeleteConfirmModal from "../../../components/DeleteConfirmModal";
import AppToast from "../../../components/AppToast"; 

export default function TeachingScheduleList() {
  const [rows, setRows] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);

  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [showDetail, setShowDetail] = useState(false);
  const [detailId, setDetailId] = useState(null);

  const [showDelete, setShowDelete] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const fetchedDetailIds = useRef(new Set());
  const toastRef = useRef(null);

  const load = async (abortSignal) => {
    setLoading(true);
    try {
      const res = await TeachingScheduleApi.fetchPage({
        page,
        size,
        search: search.trim(),
        sort: "id,asc",
      });
      if (abortSignal?.aborted) return;
      setRows(res?.content ?? []);
      setTotal(res?.totalElements ?? 0);
      setTotalPages(res?.totalPages ?? 0);
    } catch (err) {
      if (!abortSignal?.aborted) {
        console.error("[List] load error", err);
        setRows([]);
        setTotal(0);
        setTotalPages(0);
        toastRef.current?.error("Không thể tải danh sách lịch dạy");
      }
    } finally {
      if (!abortSignal?.aborted) setLoading(false);
    }
  };


  useEffect(() => {
    const ctrl = new AbortController();
    load(ctrl.signal);
    return () => ctrl.abort();
    
  }, [page, size, search]);

 
  useEffect(() => {
    const need = rows.filter(
      (r) => (r.sessions === 0 || r.sessions == null) && !fetchedDetailIds.current.has(r.id)
    );
    if (need.length === 0) return;

    let cancelled = false;
    (async () => {
      try {
        const arr = await Promise.all(
          need.map((r) =>
            TeachingScheduleApi.getTeachingScheduleById(r.id).catch(() => null)
          )
        );
        const map = {};
        arr.forEach((d) => {
          if (d && Array.isArray(d.details)) {
            map[d.id] = d.details.length;
            fetchedDetailIds.current.add(d.id);
          }
        });
        if (cancelled) return;
        setRows((prev) => prev.map((r) => (map[r.id] != null ? { ...r, sessions: map[r.id] } : r)));
      } catch (e) {
        if (!cancelled) {
          console.error("[List] fetch details error", e);
          toastRef.current?.error("Không thể tải chi tiết số buổi");
        }
      }
    })();
    return () => { cancelled = true; };
  }, [rows]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(0);
  };

  const promptDelete = (id) => {
    setDeleteId(id);
    setShowDelete(true);
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    setShowDelete(false);
    try {
      await TeachingScheduleApi.delete(deleteId);
      if (rows.length === 1 && page > 0) setPage((p) => p - 1);
      else load({});
      toastRef.current?.success("Đã xoá lịch dạy thành công");
    } catch (err) {
      console.error("[List] delete error", err);
      toastRef.current?.error("Xoá lịch dạy thất bại");
    }
  };

  const rangeText = useMemo(() => {
    const start = total === 0 ? 0 : page * size + 1;
    const end = Math.min(total, (page + 1) * size);
    return `Từ ${start} đến ${end} bản ghi`;
  }, [page, size, total]);

  return (
    <div className="container">
      <AppToast ref={toastRef} />

      {showForm && (
        <TeachingScheduleForm
          open={showForm}
          initialData={editing}
          onClose={() => setShowForm(false)}
          onSuccess={(_, mode) => {
            const isUpdate = mode ? mode === "update" : Boolean(editing?.id);
            toastRef.current?.success(isUpdate ? "Cập nhật lịch dạy thành công" : "Thêm lịch dạy thành công");
            setShowForm(false);
            load({});
          }}
        />
      )}

      {showDetail && (
        <TeachingScheduleDetail
          open={showDetail}
          id={detailId}
          onClose={() => setShowDetail(false)}
        />
      )}

      <DeleteConfirmModal
        isOpen={showDelete}
        onClose={() => setShowDelete(false)}
        onConfirm={confirmDelete}
        title="XÓA LỊCH DẠY"
        message="Bạn có chắc chắn muốn xóa lịch dạy này không?"
      />

      <div className="form-card compact">
        <button
          className="add-btn"
          onClick={() => {
            setEditing(null);
            setShowForm(true);
          }}
        >
          Thêm lịch dạy
        </button>

        <form className="search-container" onSubmit={handleSearch}>
          <input
            className="search-input"
            placeholder="Tìm kiếm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <FaSearch className="search-icon" onClick={handleSearch} />
        </form>
      </div>

      <table className="account-table">
        <thead>
          <tr>
            <th>STT</th>
            <th>Giảng viên</th>
            <th>Lớp</th>
            <th>Học phần</th>
            <th>Học kỳ</th>
            <th>Phòng</th>
            <th>Số buổi</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr><td colSpan={8} style={{ padding: 16 }}>Đang tải…</td></tr>
          ) : rows.length === 0 ? (
            <tr><td colSpan={8} style={{ padding: 16 }}>Không có dữ liệu</td></tr>
          ) : (
            rows.map((r, i) => (
              <tr key={r.id}>
                <td>{page * size + i + 1}</td>
                <td>{r.lecturerName}</td>
                <td>{r.classCode}</td>
                <td>{r.subjectName}</td>
                <td>{r.semester}</td>
                <td>{r.room}</td>
                <td>{r.sessions} buổi</td>
                <td>
                  <div className="actions">
                    <FaInfoCircle
                      className="icon info"
                      onClick={() => { setDetailId(r.id); setShowDetail(true); }}
                    />
                    <FaPen
                      className="icon edit"
                      onClick={() => { setEditing(r); setShowForm(true); }}
                    />
                    <FaTrash
                      className="icon delete"
                      onClick={() => promptDelete(r.id)}
                    />
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <div className="footer">
        <div>
          Hiển thị <b>{rows.length}</b> / {total} kết quả
        </div>
        <div className="pagination">
          <select
            value={size}
            onChange={(e) => {
              setPage(0);
              setSize(Number(e.target.value));
            }}
          >
            {[10, 20, 50, 100].map((n) => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
          <span>{rangeText}</span>
          <button disabled={page <= 0} onClick={() => setPage(page - 1)}>{"<"}</button>
          <button disabled={page + 1 >= totalPages} onClick={() => setPage(page + 1)}>{">"}</button>
        </div>
      </div>
    </div>
  );
}
