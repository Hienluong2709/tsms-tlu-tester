import React, { useEffect, useMemo, useState } from "react";
import { FaEdit, FaTrash, FaInfoCircle, FaSearch } from "react-icons/fa";
import {
  getFacultyById,
  createFaculty,
  updateFaculty,
  deleteFaculty,
  getFacultiesWithCountsByName,
  getTeachersByFacultyName,
  getDepartmentsByFacultyName,
} from "../../../api/FacultyApi";
import DeleteConfirmModal from "../../../components/DeleteConfirmModal";
import FacultyForm from "./FacultyForm";
import FacultyDetail from "./FacultyDetail";
import "../../../styles/FacultyList.css";

const norm = (v) => (v ?? "").toString().trim().toLowerCase();

const FacultyList = () => {
  const [faculties, setFaculties] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [toDelete, setToDelete] = useState(null);

  const [showDetail, setShowDetail] = useState(false);
  const [selected, setSelected] = useState(null);

  const applyFilter = useMemo(
    () => (list, term) => {
      if (!term?.trim()) return list;
      const t = norm(term);
      return list.filter(
        (f) =>
          norm(f.name).includes(t) ||
          norm(f.code).includes(t) ||
          norm(f.deanName).includes(t)
      );
    },
    []
  );

  const initialLoad = async () => {
    try {
      const rows = await getFacultiesWithCountsByName();
      setFaculties(rows || []);
      setFiltered(applyFilter(rows || [], search));
    } catch (err) {
    }
  };

  useEffect(() => {
    initialLoad();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setFiltered(applyFilter(faculties, search));
  }, [search, faculties, applyFilter]);

  const handleInfoClick = async (fac) => {
    try {
      const [full, teachers, departments] = await Promise.all([
        getFacultyById(fac.id),
        getTeachersByFacultyName(fac.name),
        getDepartmentsByFacultyName(fac.name),
      ]);
      setSelected({
        ...full,
        teachers,
        departments,
        teacherCount: teachers.length,
        departmentCount: departments.length,
      });
      setShowDetail(true);
    } catch {
      // ignore
    }
  };

  // THÊM: đẩy lên đầu ngay; SỬA: giữ vị trí; sau đó vá lại count/id thật ở nền
  const handleFormSuccess = async (payload) => {
    try {
      const isEdit = !!editing?.id;
      const apiRes = isEdit
        ? await updateFaculty(editing.id, payload)
        : await createFaculty(payload);

      // fallback nếu API trả thiếu field
      const optimistic = {
        id: apiRes?.id ?? `temp_${Date.now()}`,
        code: apiRes?.code ?? payload.code ?? "",
        name: apiRes?.name ?? payload.name ?? "",
        deanName: apiRes?.deanName ?? payload.deanName ?? "",
      };

      setFaculties((prev) => {
        const idx = prev.findIndex((x) => x.id === optimistic.id);
        let next;
        if (isEdit && idx !== -1) {
          const { teacherCount = 0, departmentCount = 0 } = prev[idx] || {};
          next = [...prev];
          next[idx] = { ...optimistic, teacherCount, departmentCount };
        } else {
          next = [{ ...optimistic, teacherCount: 0, departmentCount: 0 }, ...prev];
        }
        setFiltered(applyFilter(next, search));
        return next;
      });

      setShowForm(false);
      setEditing(null);

      // vá lại count + id thật (nếu cần)
      Promise.all([
        getTeachersByFacultyName(optimistic.name).catch(() => []),
        getDepartmentsByFacultyName(optimistic.name).catch(() => []),
        getFacultiesWithCountsByName().catch(() => []),
      ]).then(([teachers, departments, allFacs]) => {
        const real = Array.isArray(allFacs)
          ? allFacs.find(
              (f) =>
                (optimistic.code && f.code === optimistic.code) ||
                norm(f.name) === norm(optimistic.name)
            )
          : null;

        setFaculties((prev) => {
          const idx = prev.findIndex((x) => x.id === optimistic.id);
          if (idx === -1) return prev;
          const next = [...prev];
          next[idx] = {
            ...(real || next[idx]),
            code: (real?.code ?? next[idx].code) || "",
            name: (real?.name ?? next[idx].name) || "",
            deanName: real?.deanName ?? next[idx].deanName ?? "",
            teacherCount: teachers.length,
            departmentCount: departments.length,
          };
          setFiltered(applyFilter(next, search));
          return next;
        });
      });
    } catch {
      // ignore
    }
  };

  const confirmDelete = async () => {
    if (!toDelete) return;
    try {
      await deleteFaculty(toDelete.id);
      setFaculties((prev) => {
        const next = prev.filter((f) => f.id !== toDelete.id);
        setFiltered(applyFilter(next, search));
        return next;
      });
    } catch {
      // ignore
    } finally {
      setToDelete(null);
      setShowDeleteModal(false);
    }
  };

  return (
    <div className="teacher-container">
      {showForm && (
        <FacultyForm
          editData={editing}
          onClose={() => {
            setShowForm(false);
            setEditing(null);
          }}
          onSuccess={handleFormSuccess}
        />
      )}

      <FacultyDetail
        open={showDetail}
        faculty={selected}
        onClose={() => setShowDetail(false)}
      />

      <div className="teacher-header">
        <button
          className="add-button"
          onClick={() => {
            setEditing(null);
            setShowForm(true);
          }}
        >
          Thêm khoa
        </button>

        <div className="search-container">
          <input
            type="text"
            placeholder="Tìm kiếm"
            className="search-input"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <FaSearch className="search-icon" />
        </div>
      </div>

      <table className="account-table">
        <thead>
          <tr>
            <th>STT</th>
            <th>Mã khoa</th>
            <th>Tên khoa</th>
            <th>Số lượng giảng viên</th>
            <th>Số lượng bộ môn</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((f, i) => (
            <tr key={f.id}>
              <td>{i + 1}</td>
              <td>{f.code}</td>
              <td>{f.name}</td>
              <td>{f.teacherCount ?? 0}</td>
              <td>{f.departmentCount ?? 0}</td>
              <td className="actions">
                <button
                  className="icon-btn info"
                  title="Chi tiết"
                  onClick={() => handleInfoClick(f)}
                  aria-label={`Xem chi tiết khoa ${f.name}`}
                >
                  <FaInfoCircle />
                </button>
                <button
                  className="icon-btn edit"
                  title="Chỉnh sửa"
                  onClick={() => {
                    setEditing(f);
                    setShowForm(true);
                  }}
                  aria-label={`Chỉnh sửa khoa ${f.name}`}
                >
                  <FaEdit />
                </button>
                <button
                  className="icon-btn delete"
                  title="Xóa"
                  onClick={() => {
                    setToDelete(f);
                    setShowDeleteModal(true);
                  }}
                  aria-label={`Xóa khoa ${f.name}`}
                >
                  <FaTrash />
                </button>
              </td>
            </tr>
          ))}

          {filtered.length === 0 && (
            <tr>
              <td colSpan="7" style={{ textAlign: "center", padding: 20 }}>
                Không có dữ liệu
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <div className="footer">
        <div>
          Hiển thị {filtered.length} kết quả
          {search && ` (lọc từ ${faculties.length})`}
        </div>
        <div className="pagination">
          <select defaultValue="10">
            <option value="10">10</option>
            <option value="25">25</option>
            <option value="50">50</option>
          </select>
          <span>Từ 1 đến {Math.min(filtered.length, 10)} bản ghi</span>
          <button disabled>&lt;</button>
          <button disabled>&gt;</button>
        </div>
      </div>

      <DeleteConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
        title="XÓA KHOA"
        message="Bạn có chắc chắn muốn xóa khoa này không?"
      />
    </div>
  );
};

export default FacultyList;
