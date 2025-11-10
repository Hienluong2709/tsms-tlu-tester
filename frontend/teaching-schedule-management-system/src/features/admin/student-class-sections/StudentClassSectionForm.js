import { useEffect, useMemo, useRef, useState } from "react";
import { FaChevronDown, FaTrash } from "react-icons/fa";
import * as XLSX from "xlsx";
import axiosInstance from "../../../api/axiosInstance";
import StudentClassSectionApi from "../../../api/StudentClassSectionApi";
import "../../../styles/StudentClassSectionForm.css";
import AppToast from "../../../components/AppToast";

// Chuẩn hóa dữ liệu sinh viên
function normalizeStudentRow(raw) {
  const st = raw?.student || {};
  return {
    studentId: raw?.studentId ?? st?.id ?? raw?.id ?? null,
    code: raw?.studentCode ?? st?.studentCode ?? st?.code ?? raw?.code ?? "",
    fullName: raw?.fullName ?? st?.fullName ?? "",
    className:
      raw?.className ?? st?.className ?? st?.classGroup ?? st?.classCode ?? "",
  };
}

// Lấy chi tiết sinh viên theo ID (để bổ sung nếu thiếu code/className)
async function fetchStudentDetailById(id) {
  try {
    const { data } = await axiosInstance.get(`/admin/students/${id}`);
    const d = Array.isArray(data) ? data[0] : data || {};
    return {
      id: d.id ?? d.studentId ?? id,
      code: d.code ?? d.studentCode ?? "",
      fullName: d.fullName ?? d.name ?? "",
      className: d.className ?? d.classGroup ?? d.classCode ?? "",
    };
  } catch {
    try {
      const { data } = await axiosInstance.get(`/admin/students`, {
        params: { search: String(id) },
      });
      const list = Array.isArray(data) ? data : data?.content || [];
      const d =
        list.find((x) => String(x.id ?? x.studentId) === String(id)) ||
        list[0] ||
        {};
      return {
        id: d.id ?? d.studentId ?? id,
        code: d.code ?? d.studentCode ?? "",
        fullName: d.fullName ?? d.name ?? "",
        className: d.className ?? d.classGroup ?? d.classCode ?? "",
      };
    } catch {
      return { id, code: "", fullName: "", className: "" };
    }
  }
}

// Tải danh sách lớp học phần
async function loadClassSections(search = "") {
  try {
    const { data } = await axiosInstance.get("/admin/class-sections", {
      params: { search: search?.trim() || undefined },
    });
    return Array.isArray(data) ? data : data?.content || [];
  } catch (error) {
    console.error("Error loading class sections:", error);
    return [];
  }
}

// Tải chi tiết lớp học phần
async function loadClassSectionDetail(id) {
  try {
    const { data } = await axiosInstance.get(`/admin/class-sections/${id}`);
    return data;
  } catch (error) {
    console.error("Error loading class section detail:", error);
    return null;
  }
}

// Tải danh sách sinh viên (global search cho combobox)
async function loadStudents(search = "") {
  try {
    const { data } = await axiosInstance.get("/admin/students", {
      params: { search: search?.trim() || undefined },
    });
    const list = Array.isArray(data) ? data : data?.content || [];
    return list.map((s) => ({
      id: s.id ?? s.studentId,
      code: s.code ?? s.studentCode,
      fullName: s.fullName ?? s.name,
      className: s.className ?? s.classGroup ?? s.classCode ?? "",
    }));
  } catch (error) {
    console.error("Error loading students:", error);
    return [];
  }
}

// Tải danh sách sinh viên đang ở trong lớp học phần (API mới)
async function preloadStudentsOfSection(sectionId) {
  try {
    const list = await StudentClassSectionApi.listStudentsInSection(sectionId);
    let rows = list.map(normalizeStudentRow);

    // Bổ sung nếu thiếu thông tin
    const needIds = Array.from(
      new Set(
        rows
          .filter((r) => (!r.code || !r.className) && r.studentId)
          .map((r) => r.studentId)
      )
    );
    if (needIds.length) {
      const CHUNK = 10;
      const details = [];
      for (let i = 0; i < needIds.length; i += CHUNK) {
        const chunk = needIds.slice(i, i + CHUNK);
        const part = await Promise.all(chunk.map((id) => fetchStudentDetailById(id)));
        details.push(...part);
      }
      const dById = new Map(details.map((d) => [String(d.id), d]));
      rows = rows.map((r) => {
        if (r.code && r.className) return r;
        const d = dById.get(String(r.studentId));
        return d
          ? {
              ...r,
              code: r.code || d.code || "",
              fullName: r.fullName || d.fullName || "",
              className: r.className || d.className || "",
            }
          : r;
      });
    }
    return rows;
  } catch (err) {
    console.error("Error loading students in section:", err);
    return [];
  }
}

export default function StudentClassSectionForm({
  open,
  initialSection = null,
  onClose,
  onSuccess,
}) {
  const toastRef = useRef(null);
  const fileRef = useRef(null);

  // Cho phép vào edit-mode bằng _mode: 'edit' hoặc có id
  const requestedEdit = initialSection?._mode === "edit";
  const editSectionId = useMemo(
    () =>
      initialSection?.classSectionId ??
      initialSection?.id ??
      initialSection?.sectionId ??
      null,
    [initialSection]
  );
  const isEdit = Boolean(requestedEdit || editSectionId);

  // State chính
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [sectionKeyword, setSectionKeyword] = useState(initialSection?.name || "");
  const [sections, setSections] = useState([]);
  const [selectedSection, setSelectedSection] = useState(
    editSectionId ? { id: editSectionId, name: initialSection?.name } : null
  );
  const [secOpen, setSecOpen] = useState(false);
  const secBoxRef = useRef(null);

  const [studentKeyword, setStudentKeyword] = useState("");
  const [students, setStudents] = useState([]); // nguồn cho combobox
  const [selectedStudentCode, setSelectedStudentCode] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(null);

  const [selectedList, setSelectedList] = useState([]); // bảng hiển thị
  const [existingCodes, setExistingCodes] = useState(new Set()); // SV đã ở trong lớp (dùng phân biệt thêm mới / xoá trên BE)

  const [msvOpen, setMsvOpen] = useState(false);
  const msvBoxRef = useRef(null);
  const msvInputRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    let cancelled = false;

    (async () => {
      try {
        setLoading(true);

        // 1) Tải dữ liệu nền
        const [sec, stds] = await Promise.all([loadClassSections(""), loadStudents("")]);
        if (cancelled) return;
        setSections(sec);
        setStudents(stds);

        // 2) Nếu là "Sửa": khóa chọn lớp + preload thông tin & DS SV
        if (isEdit) {
          // 2a) Resolve id nếu chưa có, dựa theo name
          let resolvedId = editSectionId ?? null;
          if (!resolvedId && initialSection?.name) {
            try {
              const cand = await loadClassSections(initialSection.name);
              const picked =
                cand.find(
                  (x) => String(x?.name).trim() === String(initialSection.name).trim()
                ) || cand[0];
              if (picked?.id) resolvedId = picked.id;
              if (!cancelled && picked) {
                setSelectedSection(picked);
                setSectionKeyword(picked?.name || initialSection?.name || "");
              }
            } catch (e) {
              console.warn("Resolve sectionId by name failed", e);
            }
          }

          // 2b) Lấy detail bằng id (nếu resolve được)
          if (resolvedId) {
            const detail = await loadClassSectionDetail(resolvedId);
            if (!cancelled) {
              setSelectedSection(detail || { id: resolvedId, name: initialSection?.name });
              setSectionKeyword(detail?.name || initialSection?.name || "");
            }

            // 2c) Preload danh sách SV đang ở trong lớp
            const rows = await preloadStudentsOfSection(resolvedId);
            if (!cancelled) {
              setSelectedList(rows);
              const exist = new Set(rows.filter((r) => r.code).map((r) => r.code));
              setExistingCodes(exist);

              // Merge DS SV cho combobox (đảm bảo có đủ các SV đã ở lớp)
              const byCode = new Map(stds.map((s) => [s.code, s]));
              rows.forEach((r) => {
                if (r.code && !byCode.has(r.code)) {
                  byCode.set(r.code, {
                    id: r.studentId,
                    code: r.code,
                    fullName: r.fullName,
                    className: r.className,
                  });
                }
              });
              setStudents(Array.from(byCode.values()));
            }
          } else {
            // Không resolve được id -> báo lỗi nhẹ, vẫn cho chọn lại hoặc đóng form
            if (!cancelled) {
              toastRef.current?.error(
                "Không xác định được lớp học phần để sửa (thiếu ID)."
              );
            }
          }
        } else {
          // 3) Tạo mới -> clear bảng
          setSelectedList([]);
          setExistingCodes(new Set());
        }
      } catch (error) {
        console.error("Initialization error:", error);
        if (!cancelled) toastRef.current?.error("Không thể tải dữ liệu ban đầu");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [open, isEdit, editSectionId, initialSection]);

  // Tìm kiếm lớp học phần (khóa hẳn khi là Sửa)
  useEffect(() => {
    const locked = isEdit;
    if (!open || locked) return;

    let cancelled = false;
    const t = setTimeout(async () => {
      try {
        const sec = await loadClassSections(sectionKeyword);
        if (!cancelled) setSections(sec);
      } catch (error) {
        console.error("Error searching class sections:", error);
      }
    }, 300);

    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, [sectionKeyword, open, isEdit]);

  // Tìm kiếm sinh viên
  useEffect(() => {
    if (!open) return;

    let cancelled = false;
    const t = setTimeout(async () => {
      try {
        const stds = await loadStudents(studentKeyword);
        if (!cancelled) {
          const byCode = new Map(stds.map((x) => [String(x.code).trim(), x]));
          selectedList.forEach((r) => {
            const k = String(r.code).trim();
            if (!byCode.has(k) && r.code) {
              byCode.set(k, {
                id: r.studentId,
                code: r.code,
                fullName: r.fullName,
                className: r.className,
              });
            }
          });
          setStudents(Array.from(byCode.values()));
        }
      } catch (error) {
        console.error("Error searching students:", error);
      }
    }, 250);

    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, [studentKeyword, open, selectedList]);

  const studentLookup = useMemo(() => {
    const map = new Map();
    students.forEach((s) => map.set(String(s.code).trim(), s));
    selectedList.forEach((r) => {
      const key = String(r.code).trim();
      if (key && !map.has(key)) {
        map.set(key, {
          id: r.studentId,
          code: r.code,
          fullName: r.fullName,
          className: r.className,
        });
      }
    });
    return map;
  }, [students, selectedList]);

  useEffect(() => {
    if (!selectedStudentCode) {
      setSelectedStudent(null);
      return;
    }
    const found = studentLookup.get(String(selectedStudentCode).trim());
    setSelectedStudent(found || null);
  }, [selectedStudentCode, studentLookup]);

  useEffect(() => {
    const onDown = (e) => {
      if (msvOpen && msvBoxRef.current && !msvBoxRef.current.contains(e.target))
        setMsvOpen(false);
      if (secOpen && secBoxRef.current && !secBoxRef.current.contains(e.target))
        setSecOpen(false);
    };
    const onKey = (e) => {
      if (e.key === "Escape") {
        setMsvOpen(false);
        setSecOpen(false);
      }
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [msvOpen, secOpen]);

  const info = useMemo(() => {
    const cs = selectedSection || {};
    return {
      faculty: cs.faculty?.name || cs.subject?.faculty?.name || cs.facultyName || "",
      department:
        cs.department?.name || cs.subject?.department?.name || cs.departmentName || "",
      teacher: cs.teacher?.fullName || cs.teacherName || "",
      semester: cs.semester?.name || cs.semester?.term || cs.semester?.academicYear || "",
      subject: cs.subject?.name || cs.subjectName || "",
      room: cs.room?.name || cs.roomName || "",
      sectionName: cs.name || "",
    };
  }, [selectedSection]);

  /*Add/Remove student*/
  const addStudent = () => {
    const code = String(selectedStudentCode || "").trim();
    const found = studentLookup.get(code);
    if (!found) return toastRef.current?.error("MSV không hợp lệ");
    if (selectedList.some((x) => x.code === found.code))
      return toastRef.current?.error("Sinh viên đã có trong danh sách");

    setSelectedList((prev) => [
      ...prev,
      {
        studentId: found.id,
        code: found.code,
        fullName: found.fullName,
        className: found.className,
      },
    ]);
    setSelectedStudentCode("");
    setSelectedStudent(null);
    setMsvOpen(false);
  };

  const removeStudent = async (code) => {
    const target = selectedList.find((x) => x.code === code);
    if (!target) return;

    // Nếu đang Sửa & sinh viên đã tồn tại trong lớp -> gọi DELETE API
    if (isEdit && selectedSection?.id && existingCodes.has(code)) {
      try {
        await StudentClassSectionApi.removeStudentFromSection(
          selectedSection.id,
          target.studentId
        );
        setExistingCodes((prev) => {
          const n = new Set(prev);
          n.delete(code);
          return n;
        });
        toastRef.current?.success("Đã xoá khỏi lớp học phần");
      } catch (e) {
        console.error("removeStudent error", e);
        toastRef.current?.error("Xoá thất bại");
        return; // giữ nguyên UI nếu BE xoá thất bại
      }
    }

    // Cập nhật UI
    setSelectedList((prev) => prev.filter((x) => x.code !== code));
  };

  /*Excel*/
  const downloadTemplate = () => {
    const wb = XLSX.utils.book_new();
    const wsData = [
      ["Trường Đại học Thủy Lợi"],
      [],
      ["DANH SÁCH SINH VIÊN ĐĂNG KÍ HỌC PHẦN"],
      [],
      ["MSV", "Họ tên", "Lớp"],
    ];
    const ws = XLSX.utils.aoa_to_sheet(wsData);
    ws["!merges"] = [
      { s: { r: 0, c: 0 }, e: { r: 0, c: 2 } },
      { s: { r: 2, c: 0 }, e: { r: 2, c: 2 } },
    ];
    ws["!cols"] = [{ wch: 14 }, { wch: 28 }, { wch: 14 }];
    XLSX.utils.book_append_sheet(wb, ws, "Mau_DangKy");
    XLSX.writeFile(wb, "mau_dang_ky_sinh_vien.xlsx");
  };

  const handleImportExcel = async (file) => {
    try {
      const buf = await file.arrayBuffer();
      const wb = XLSX.read(buf, { type: "array" });
      const ws = wb.Sheets[wb.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json(ws, {
        header: 1,
        defval: "",
        blankRows: false,
      });

      if (!rows.length) return toastRef.current?.error("File rỗng");

      let headerRowIndex = 0;
      let header = [];
      for (let i = 0; i < Math.min(rows.length, 10); i += 1) {
        const h = rows[i].map((x) => String(x || "").trim().toUpperCase());
        if (h.includes("MSV")) {
          headerRowIndex = i;
          header = h;
          break;
        }
      }
      const colIdx = header.findIndex((h) =>
        ["MSV", "MÃ SV", "STUDENTCODE"].includes(h)
      );
      if (colIdx === -1)
        return toastRef.current?.error("Không tìm thấy cột 'MSV' trong file");

      const codes = new Set();
      for (let i = headerRowIndex + 1; i < rows.length; i += 1) {
        const code = String(rows[i][colIdx] || "").trim();
        if (code) codes.add(code);
      }
      if (codes.size === 0)
        return toastRef.current?.error("File không có MSV hợp lệ");

      const toAdd = [];
      const notFound = [];
      codes.forEach((code) => {
        const found = studentLookup.get(code);
        if (found) {
          if (
            !toAdd.some((x) => x.code === found.code) &&
            !selectedList.some((x) => x.code === found.code)
          ) {
            toAdd.push({
              studentId: found.id,
              code: found.code,
              fullName: found.fullName,
              className: found.className,
            });
          }
        } else notFound.push(code);
      });

      const resolved = [];
      for (const code of notFound) {
        try {
          const list = await loadStudents(code);
          const exact = list.find((s) => String(s.code).trim() === code);
          if (
            exact &&
            !toAdd.some((x) => x.code === exact.code) &&
            !selectedList.some((x) => x.code === exact.code)
          ) {
            resolved.push({
              studentId: exact.id,
              code: exact.code,
              fullName: exact.fullName,
              className: exact.className,
            });
          }
        } catch {}
      }

      const finalAdd = [...toAdd, ...resolved];
      setSelectedList((prev) => [...prev, ...finalAdd]);

      const missing = notFound.filter((c) => !finalAdd.some((x) => x.code === c));
      const ok = finalAdd.length;
      if (ok > 0) toastRef.current?.success(`Đã thêm ${ok} sinh viên từ Excel.`);
      if (missing.length > 0) {
        const preview = missing.slice(0, 10).join(", ");
        toastRef.current?.error(
          `Không tìm thấy ${missing.length} MSV: ${preview}${
            missing.length > 10 ? "..." : ""
          }`
        );
      }
    } catch (e) {
      console.error("[SCS-Form] import excel error", e);
      toastRef.current?.error("Không thể đọc file Excel");
    }
  };

  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedSection?.id)
      return toastRef.current?.error("Vui lòng chọn lớp học phần");

    if (selectedList.length === 0)
      return toastRef.current?.error("Vui lòng thêm ít nhất 1 sinh viên");

    try {
      setSaving(true);

      // Chỉ gửi những SV CHƯA có trong lớp (dựa theo existingCodes)
      const listToAdd = selectedList.filter((it) => !existingCodes.has(it.code));
      if (listToAdd.length === 0) {
        toastRef.current?.success("Không có bản ghi mới cần đăng ký.");
        onSuccess?.([], isEdit ? "update" : "create");
        return;
      }

      // POST từng sinh viên theo API mới
      for (const it of listToAdd) {
        await StudentClassSectionApi.addStudentToSection(
          selectedSection.id,
          it.studentId
        );
      }

      toastRef.current?.success(`Đăng ký thành công ${listToAdd.length} sinh viên.`);
      // cập nhật existingCodes
      setExistingCodes((prev) => {
        const n = new Set(prev);
        listToAdd.forEach((it) => n.add(it.code));
        return n;
      });

      onSuccess?.(
        listToAdd.map((s) => ({
          studentId: s.studentId,
          classSectionId: selectedSection.id,
        })),
        isEdit ? "update" : "create"
      );
    } catch (err) {
      console.error("[SCS-Form] submit error", err);
      toastRef.current?.error("Thao tác thất bại");
    } finally {
      setSaving(false);
    }
  };

  const closeNow = () => {
    if (saving) return;
    setSelectedSection(null);
    setSectionKeyword("");
    setSelectedStudentCode("");
    setSelectedStudent(null);
    setSelectedList([]);
    setExistingCodes(new Set());
    setSecOpen(false);
    setMsvOpen(false);
    onClose?.();
  };

  const keyword = (studentKeyword || selectedStudentCode || "").trim().toLowerCase();

  const inClassOptions = useMemo(() => {
    const base = selectedList.map((r) => ({
      id: r.studentId,
      code: r.code,
      fullName: r.fullName,
      className: r.className,
    }));
    if (!keyword) return base.slice(0, 50);
    return base
      .filter(
        (s) =>
          s.code.toLowerCase().includes(keyword) ||
          (s.fullName || "").toLowerCase().includes(keyword)
      )
      .slice(0, 50);
  }, [selectedList, keyword]);

  const globalOptions = useMemo(() => {
    const arr = students.filter(
      (s) =>
        !inClassOptions.some((x) => x.code === s.code) &&
        (!keyword ||
          s.code.toLowerCase().includes(keyword) ||
          (s.fullName || "").toLowerCase().includes(keyword))
    );
    return arr.slice(0, 50);
  }, [students, inClassOptions, keyword]);

  if (!open) return null;

  return (
    <div
      className="scsf-backdrop"
      role="dialog"
      aria-modal="true"
      aria-label={isEdit ? "Sửa đăng kí học phần" : "Đăng kí học phần mới"}
    >
      <AppToast ref={toastRef} />
      <div className="scsf-modal">
        <div className="scsf-header">
          <div>{isEdit ? "SỬA ĐĂNG KÍ HỌC PHẦN" : "ĐĂNG KÍ HỌC PHẦN MỚI"}</div>
          <button
            type="button"
            className="scsf-close"
            aria-label="Đóng"
            onClick={closeNow}
            title="Đóng"
          >
            ×
          </button>
        </div>

        <form className="scsf-form" onSubmit={handleSubmit}>
          <div className="scsf-body">
            <label className="scsf-label">
              Lớp học phần: <span className="req">*</span>
            </label>
            <div className="scsf-select-row">
              <div
                ref={secBoxRef}
                className={`scsf-select ${loading || isEdit ? "disabled" : ""}`}
                onClick={() => {
                  if (!isEdit) setSecOpen(true);
                }}
                onKeyDown={(e) => {
                  if (!isEdit && ["Enter", " ", "ArrowDown"].includes(e.key))
                    setSecOpen(true);
                }}
                role="button"
                tabIndex={0}
                aria-expanded={secOpen}
              >
                <input
                  className="scsf-select-input"
                  placeholder="— Chọn học phần —"
                  value={sectionKeyword}
                  onChange={(e) => {
                    if (!isEdit) setSectionKeyword(e.target.value);
                  }}
                  onFocus={() => {
                    if (!isEdit) setSecOpen(true);
                  }}
                  aria-label="Tìm hoặc chọn lớp học phần"
                  readOnly={isEdit}
                />
                <FaChevronDown
                  className="scsf-select-caret"
                  onClick={(e) => {
                    if (isEdit) return;
                    e.stopPropagation();
                    setSecOpen((v) => !v);
                  }}
                  style={{
                    cursor: isEdit ? "default" : "pointer",
                    opacity: isEdit ? 0.3 : 1,
                  }}
                  title={isEdit ? "" : secOpen ? "Thu gọn" : "Mở danh sách"}
                />

                {!isEdit && secOpen && (
                  <div
                    className="scsf-select-dropdown"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={(e) => e.stopPropagation()}
                  >
                    {sections.length === 0 ? (
                      <div className="scsf-dd-empty">Không có dữ liệu</div>
                    ) : (
                      sections.map((cs) => (
                        <div
                          key={cs.id}
                          className={`scsf-dd-item ${
                            selectedSection?.id === cs.id ? "active" : ""
                          }`}
                          onClick={async () => {
                            try {
                              const detail = await loadClassSectionDetail(cs.id);
                              setSelectedSection(detail);
                              setSectionKeyword(detail?.name || cs.name || "");
                            } catch {
                              setSelectedSection(cs);
                              setSectionKeyword(cs.name || "");
                            } finally {
                              setSecOpen(false);
                            }
                          }}
                        >
                          <div className="scsf-dd-name">{cs.name}</div>
                          <div className="scsf-dd-sub">{cs.subject?.name || ""}</div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="scsf-grid">
              <div>
                <label className="scsf-label">Khoa:</label>
                <input className="scsf-input" value={info.faculty} readOnly />
              </div>
              <div>
                <label className="scsf-label">Bộ môn:</label>
                <input className="scsf-input" value={info.department} readOnly />
              </div>
              <div>
                <label className="scsf-label">Giảng viên:</label>
                <input className="scsf-input" value={info.teacher} readOnly />
              </div>
              <div>
                <label className="scsf-label">Học kỳ:</label>
                <input className="scsf-input" value={info.semester} readOnly />
              </div>
              <div>
                <label className="scsf-label">Môn học:</label>
                <input className="scsf-input" value={info.subject} readOnly />
              </div>
              <div>
                <label className="scsf-label">Phòng:</label>
                <input className="scsf-input" value={info.room} readOnly />
              </div>
            </div>

            <div className="scsf-block">
              <div className="scsf-block-title-row">
                <span className="scsf-block-title">Thiết lập sinh viên</span>
                <div className="scsf-upload-right">
                  <button type="button" className="scsf-btn ghost" onClick={downloadTemplate}>
                    Tải mẫu Excel
                  </button>
                  <button type="button" className="scsf-btn ghost" onClick={() => fileRef.current?.click()}>
                    Tải lên Excel
                  </button>
                  <input
                    ref={fileRef}
                    type="file"
                    accept=".xlsx,.xls"
                    style={{ display: "none" }}
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f)
                        handleImportExcel(f).finally(() => {
                          e.target.value = "";
                        });
                    }}
                  />
                </div>
              </div>

              <div className="scsf-stu-row">
                <div className="scsf-stu-col code">
                  <div className="scsf-combo" ref={msvBoxRef}>
                    <input
                      ref={msvInputRef}
                      className="scsf-input"
                      placeholder="Nhập hoặc chọn MSV"
                      value={selectedStudentCode}
                      onChange={(e) => {
                        const v = e.target.value;
                        setSelectedStudentCode(v);
                        setStudentKeyword(v);
                        setMsvOpen(true);
                      }}
                      onFocus={() => setMsvOpen(true)}
                      aria-label="Nhập hoặc chọn MSV"
                      autoComplete="off"
                    />
                    {msvOpen && (
                      <div className="scsf-combo-list">
                        {inClassOptions.length > 0 && (
                          <>
                            <div className="scsf-combo-group-title">Sinh viên đang chọn</div>
                            {inClassOptions.map((s) => (
                              <div
                                key={`in-${s.code}`}
                                className="scsf-combo-item"
                                onMouseDown={(e) => e.preventDefault()}
                                onClick={() => {
                                  setSelectedStudentCode(String(s.code));
                                  setStudentKeyword(String(s.code));
                                  setMsvOpen(false);
                                  setTimeout(() => msvInputRef.current?.focus(), 0);
                                }}
                              >
                                <div className="code">{s.code}</div>
                                <div className="name">{s.fullName}</div>
                              </div>
                            ))}
                            <div className="scsf-combo-sep" />
                          </>
                        )}

                        {globalOptions.length === 0 ? (
                          <div className="scsf-combo-empty">Không có kết quả</div>
                        ) : (
                          <>
                            <div className="scsf-combo-group-title">Tất cả sinh viên</div>
                            {globalOptions.map((s) => (
                              <div
                                key={`all-${s.id}-${s.code}`}
                                className="scsf-combo-item"
                                onMouseDown={(e) => e.preventDefault()}
                                onClick={() => {
                                  setSelectedStudentCode(String(s.code));
                                  setStudentKeyword(String(s.code));
                                  setMsvOpen(false);
                                  setTimeout(() => msvInputRef.current?.focus(), 0);
                                }}
                              >
                                <div className="code">{s.code}</div>
                                <div className="name">{s.fullName}</div>
                              </div>
                            ))}
                          </>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <div className="scsf-stu-col name">
                  <input
                    className="scsf-input"
                    placeholder="Họ tên"
                    value={selectedStudent?.fullName || ""}
                    readOnly
                  />
                </div>
                <div className="scsf-stu-col cls">
                  <input
                    className="scsf-input"
                    placeholder="Lớp"
                    value={selectedStudent?.className || ""}
                    readOnly
                  />
                </div>
                <div className="scsf-stu-col add">
                  <button type="button" className="scsf-add-student" onClick={addStudent}>
                    Thêm sinh viên
                  </button>
                </div>
              </div>

              <table className="scsf-table">
                <thead>
                  <tr>
                    <th>STT</th>
                    <th>MSV</th>
                    <th>Họ tên</th>
                    <th>Lớp</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {selectedList.length === 0 ? (
                    <tr>
                      <td colSpan={5} style={{ padding: 12 }}>
                        Chưa có sinh viên nào
                      </td>
                    </tr>
                  ) : (
                    selectedList.map((s, i) => (
                      <tr key={`${s.code}-${i}`}>
                        <td>{i + 1}</td>
                        <td>{s.code || "—"}</td>
                        <td>{s.fullName}</td>
                        <td>{s.className || "—"}</td>
                        <td style={{ textAlign: "center" }}>
                          <button
                            type="button"
                            className="scsf-icon danger"
                            onClick={() => removeStudent(s.code)}
                            title="Xóa"
                            aria-label={`Xóa sinh viên ${s.code}`}
                          >
                            <FaTrash />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="scsf-actions">
            <button type="button" className="scsf-btn ghost" onClick={closeNow} disabled={saving}>
              Hủy bỏ
            </button>
            <button type="submit" className="scsf-btn primary" disabled={saving}>
              {saving ? "Đang xử lý..." : "Xác nhận"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
