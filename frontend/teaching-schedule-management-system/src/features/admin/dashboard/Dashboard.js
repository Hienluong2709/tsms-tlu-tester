import React, { useEffect, useMemo, useState } from "react";
import TeachingScheduleApi from "../../../api/TeachingScheduleApi";
import * as NotificationApi from "../../../api/NotificationApi";
import AccountApi from "../../../api/AccountApi";
import { getAllTeachers } from "../../../api/TeacherApi";
import styles from "../../../styles/DashboardAdmin.module.css";

const normalizeList = (res) =>
  (Array.isArray(res) ? res : res?.content || res?.items || []);

const toDateSafe = (v) => {
  if (!v) return null;
  const d = new Date(v);
  if (!isNaN(d)) return d;
  const m = String(v).match(/(\d{4})-(\d{2})-(\d{2})/);
  if (m) {
    const d2 = new Date(`${m[1]}-${m[2]}-${m[3]}`);
    if (!isNaN(d2)) return d2;
  }
  return null;
};

function* iterateScheduleDates(item) {
  if (Array.isArray(item?.details) && item.details.length) {
    for (const dt of item.details) {
      const d = dt?.teachingDate || dt?.date || dt?.startTime || dt?.startDate || dt?.day;
      const parsed = toDateSafe(d);
      if (parsed) yield parsed;
    }
  }
  const top = item?.date || item?.startDate || item?.startTime || item?.classDate || item?.day || item?.createdAt;
  const parsedTop = toDateSafe(top);
  if (parsedTop) yield parsedTop;
}

const teacherName = (o = {}) =>
  o.lecturerName || o.teacherName || o.teacher?.fullName || o.classSection?.teacher?.fullName || "Khác";

function countUsersSafe(res) {
  if (Array.isArray(res)) return res.length;
  if (typeof res?.totalElements === "number") return res.totalElements;
  if (typeof res?.total === "number") return res.total;
  return normalizeList(res).length;
}

function countDistinctClasses(allSchedules) {
  const set = new Set();
  for (const it of allSchedules) {
    const id =
      it?.classSection?.id ??
      it?.classSectionId ??
      it?.classSection?.name ??
      it?.classCode;
    if (id) set.add(String(id));
  }
  return set.size;
}

const Card = ({ children, style, className = "" }) => (
  <div className={`${styles.statCard} ${className}`} style={style}>
    {children}
  </div>
);

const StatCard = ({ title, value, icon }) => (
  <Card>
    <div className={styles.statTitle}>{title}</div>
    <div className={styles.statValue}>{value}</div>
    <div className={styles.statIcon}>{icon}</div>
  </Card>
);

const EmptyState = ({ hint }) => (
  <div className={styles.emptyState}>
    <div className={styles.emptyIcon}>📋</div>
    <div className={styles.emptyText}>{hint || "Chưa có dữ liệu"}</div>
  </div>
);

const Dashboard = () => {
  const [stats, setStats] = useState({ users: 0, classes: 0, teachers: 0 });
  const [todaySchedules, setTodaySchedules] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        // Today
        const now = new Date();
        const yyyy = now.getFullYear();
        const mm = String(now.getMonth() + 1).padStart(2, "0");
        const dd = String(now.getDate()).padStart(2, "0");
        const todayStr = `${yyyy}-${mm}-${dd}`;
        const rows = await TeachingScheduleApi.fetchToday({ date: todayStr }).catch(() => []);
        setTodaySchedules(rows || []);

        // Notifications
        const notiPage = await NotificationApi.fetchPage({ size: 5 }).catch(() => []);
        setNotifications(normalizeList(notiPage));

        // Schedules -> đếm số lớp distinct
        const rawAll = await TeachingScheduleApi.getAllTeachingSchedules().catch(() => []);
        const all = normalizeList(rawAll);

        // Users
        let totalUsers = 0;
        try {
          const usersRes =
            (AccountApi?.account && (await AccountApi.account.getAll())) ||
            (AccountApi?.getAll && (await AccountApi.getAll())) ||
            0;
          totalUsers = countUsersSafe(usersRes);
        } catch {
          totalUsers = 0;
        }

        // Teachers
        let totalTeachers = 0;
        try {
          const tRes = await getAllTeachers();
          totalTeachers = countUsersSafe(tRes);
        } catch {
          totalTeachers = 0;
        }

        setStats({
          users: totalUsers,
          classes: countDistinctClasses(all),
          teachers: totalTeachers,
        });
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const todayByTeacher = useMemo(() => {
    const map = {};
    for (const sch of todaySchedules) {
      const n = teacherName(sch);
      (map[n] ||= []).push({
        id: sch.id,
        subjectName:
          sch.subjectName ||
          sch.subject?.name ||
          sch.classSection?.subject?.name ||
          "",
        classCode: sch.classCode || sch.classSection?.name || "",
        room: sch.room || sch.roomName || sch.room?.name || "",
      });
    }
    return map;
  }, [todaySchedules]);


  const todayFormatted = useMemo(() => {
    const now = new Date();
    return now.toLocaleDateString('vi-VN', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  }, []);

  return (
    <div className={styles.dashboardContainer}>
      {loading ? (
        <div className={styles.loading}>Đang tải dữ liệu...</div>
      ) : (
        <>
          <div className={styles.statsRow}>
            <StatCard title="Tổng số người dùng" value={stats.users} icon={"👤"} />
            <StatCard title="Tổng số lớp học" value={stats.classes} icon={"🏫"} />
            <StatCard title="Tổng số giảng viên" value={stats.teachers} icon={"👨‍🏫"} />
          </div>

          {/* Lịch dạy hôm nay */}
          <div className={styles.scheduleSection}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Lịch dạy hôm nay</h2>
              <div className={styles.dateBadge}>{todayFormatted}</div>
            </div>
            
            {Object.keys(todayByTeacher).length === 0 ? (
              <EmptyState hint="Không có lịch dạy hôm nay." />
            ) : (
              <div className={styles.teachersGrid}>
                {Object.entries(todayByTeacher).map(([lecturer, list]) => (
                  <div key={lecturer} className={styles.teacherCard}>
                    <div className={styles.teacherName}>{lecturer}</div>
                    <ul className={styles.classList}>
                      {list.map((sch, idx) => (
                        <li key={sch.id ?? idx} className={styles.classItem}>
                          <div className={styles.subjectName}>{sch.subjectName || "—"}</div>
                          <div className={styles.classDetails}>
                            {sch.classCode && <span>{sch.classCode}</span>}
                            {sch.room && <span>Phòng: {sch.room}</span>}
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Thông báo mới nhất */}
          <div className={styles.notificationsSection}>
            <h2 className={styles.sectionTitle}>Thông báo mới nhất</h2>
            
            {notifications.length === 0 ? (
              <EmptyState hint="Chưa có thông báo." />
            ) : (
              <div>
                {notifications.map((n, i) => (
                  <div key={n.id ?? i} className={styles.notificationItem}>
                    <div className={styles.notificationTitle}>{n.title || "Thông báo"}</div>
                    <div className={styles.notificationContent}>{n.content || ""}</div>
                    {n.createdAt && (
                      <div className={styles.notificationTime}>
                        {new Date(n.createdAt).toLocaleString("vi-VN")}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;