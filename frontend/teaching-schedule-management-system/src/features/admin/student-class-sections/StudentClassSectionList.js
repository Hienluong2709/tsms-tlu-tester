import { useEffect, useMemo, useRef, useState } from "react";
import { FaSearch, FaInfoCircle, FaPen, FaTrash } from "react-icons/fa";
import StudentClassSectionApi from "../../../api/StudentClassSectionApi";
import "../../../styles/StudentClassSectionList.css";
import "../../../styles/Toast.css";
import AppToast from "../../../components/AppToast";
import DeleteConfirmModal from "../../../components/DeleteConfirmModal";
import StudentClassSectionForm from "./StudentClassSectionForm";
import StudentClassSectionDetail from "./StudentClassSectionDetail";

export default function StudentClassSectionList({ defaultStudentId }) {
  const [rows, setRows] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);

  // Form
  const [showForm, setShowForm] = useState(false);
  const [editingSection, setEditingSection] = useState(null);

  // Detail
  const [showDetail, setShowDetail] = useState(false);
  const [detailSectionId, setDetailSectionId] = useState(null);
  const [detailSectionName, setDetailSectionName] = useState("");

  // Delete
  const [showDelete, setShowDelete] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const toastRef = useRef(null);

  const load = async (signal) => {
    setLoading(true);
    try {
      const res = await StudentClassSectionApi.fetchPage({
        page,
        size,
        search: search.trim(),
        sort: "createdAt,desc",
        studentId: defaultStudentId,
      });
      if (signal?.aborted) return;

      if (Array.isArray(res)) {
        const totalAll = res.length;
        const start = page * size;
        const end = start + size;
        setRows(res.slice(start, end));
        setTotal(totalAll);
        setTotalPages(Math.max(1, Math.ceil(totalAll / size)));
      } else {
        setRows(res?.content || []);
        setTotal(res?.totalElements || 0);
        setTotalPages(res?.totalPages || 0);
      }
    } catch (err) {
      if (!signal?.aborted) {
        console.error("[SCS-List] load error", err);
        setRows([]);
        setTotal(0);
        setTotalPages(0);
        toastRef.current?.error("Không thể tải danh sách đăng ký");
      }
    } finally {
      if (!signal?.aborted) setLoading(false);
    }
  };

  useEffect(() => {
    const ctrl = new AbortController();
    load(ctrl);
    return () => ctrl.abort();
  }, [page, size, search, defaultStudentId]);

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
      await StudentClassSectionApi.delete(deleteId);
      if (rows.length === 1 && page > 0) setPage((p) => p - 1);
      else load({});
      toastRef.current?.success("Xoá đăng ký thành công");
    } catch (err) {
      console.error("[SCS-List] delete error", err);
      toastRef.current?.error("Xoá đăng ký thất bại");
    }
  };

  const rangeText = useMemo(() => {
    const start = total === 0 ? 0 : page * size + 1;
    const end = Math.min(total, (page + 1) * size);
    return `Từ ${start} đến ${end} bản ghi`;
  }, [page, size, total]);

  const renderRow = (r, i) => {
    const cs = r.classSection || {};
    const subject = cs.subject || {};
    const teacher = cs.teacher || {};
    const semester = cs.semester || {};
    const idForActions = r.id ?? cs.id ?? `${cs.name || "row"}-${i}`;

    const classSectionIdForEdit =
      cs?.id ?? r?.classSectionId ?? r?.class_section_id ?? r?.sectionId ?? null;

    const studentIdForEdit =
      r?.studentId ?? r?.student?.id ?? defaultStudentId ?? null;

    return (
      <tr key={idForActions}>
        <td>{page * size + i + 1}</td>
        <td>{cs.name || ""}</td>
        <td>{subject.name || ""}</td>
        <td>{teacher.fullName || ""}</td>
        <td>{semester.academicYear || ""}</td>
        <td>{r.studentCount ?? 0}</td>
        <td>
          <div className="scs-actions">
            <button
              type="button"
              className="icon-btn info"
              title="Chi tiết"
              onClick={() => {
                // Truyền cả id và name. Nếu không có id, Detail sẽ tự resolve từ name
                setDetailSectionId(classSectionIdForEdit || null);
                setDetailSectionName(cs?.name || "");
                setShowDetail(true);
              }}
            >
              <FaInfoCircle />
            </button>

            <button
              type="button"
              className="icon-btn edit"
              title="Sửa"
              onClick={() => {
                if (!classSectionIdForEdit && !cs?.name) {
                  console.warn("[SCS-List] Không tìm thấy id/name LHP cho hàng:", r);
                  toastRef.current?.error("Không xác định được lớp học phần để sửa");
                  return;
                }
                const payload = {
                  _mode: "edit",
                  studentId: studentIdForEdit || undefined,
                  classSectionId: classSectionIdForEdit || undefined,
                  name: cs?.name,
                };
                setEditingSection(payload);
                setShowForm(true);
              }}
            >
              <FaPen />
            </button>

            <button
              type="button"
              className="icon-btn delete"
              title="Xoá"
              onClick={() => promptDelete(idForActions)}
            >
              <FaTrash />
            </button>
          </div>
        </td>
      </tr>
    );
  };

  return (
    <div className="scs-container">
      <AppToast ref={toastRef} />

      {showDetail && (
        <StudentClassSectionDetail
          open={showDetail}
          classSectionId={detailSectionId}
          classSectionName={detailSectionName}  
          onClose={() => {
            setShowDetail(false);
            setDetailSectionId(null);
            setDetailSectionName("");
          }}
        />
      )}

      {showForm && (
        <StudentClassSectionForm
          open={showForm}
          initialSection={editingSection}
          onClose={() => {
            setShowForm(false);
            setEditingSection(null);
          }}
          onSuccess={(_, mode) => {
            toastRef.current?.success(
              mode === "update" ? "Cập nhật đăng ký thành công" : "Thêm đăng ký thành công"
            );
            setShowForm(false);
            setEditingSection(null);
            load({});
          }}
        />
      )}

      <DeleteConfirmModal
        isOpen={showDelete}
        onClose={() => setShowDelete(false)}
        onConfirm={confirmDelete}
        title="XÓA ĐĂNG KÝ LỚP HỌC PHẦN"
        message="Bạn có chắc chắn muốn xóa đăng ký này không?"
      />

      <div className="scs-header">
        <button
          className="scs-add-btn"
          onClick={() => {
            setEditingSection(null);
            setShowForm(true);
          }}
        >
          Thêm đăng ký
        </button>

        <form className="scs-search" onSubmit={handleSearch}>
          <input
            className="scs-search-input"
            placeholder="Tìm kiếm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <FaSearch className="scs-search-icon" onClick={handleSearch} />
        </form>
      </div>

      <table className="scs-table">
        <thead>
          <tr>
            <th>STT</th>
            <th>Mã học phần</th>
            <th>Tên học phần</th>
            <th>Giảng viên</th>
            <th>Học kì</th>
            <th>Tổng số SV</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr><td colSpan={7} style={{ padding: 16 }}>Đang tải…</td></tr>
          ) : rows.length === 0 ? (
            <tr><td colSpan={7} style={{ padding: 16 }}>Không có dữ liệu</td></tr>
          ) : (
            rows.map(renderRow)
          )}
        </tbody>
      </table>

      <div className="scs-footer">
        <div>Hiển thị <b>{rows.length}</b> / {total} kết quả</div>
        <div className="scs-pagination">
          <select
            value={size}
            onChange={(e) => {
              setPage(0);
              setSize(Number(e.target.value));
            }}
          >
            {[10,20,50,100].map((n) => <option key={n} value={n}>{n}</option>)}
          </select>
          <span>{rangeText}</span>
          <button disabled={page <= 0} onClick={() => setPage(page - 1)}>&lt;</button>
          <button disabled={page + 1 >= totalPages} onClick={() => setPage(page + 1)}>&gt;</button>
        </div>
      </div>
    </div>
  );
}
