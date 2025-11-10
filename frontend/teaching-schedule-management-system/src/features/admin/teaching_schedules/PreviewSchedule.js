import React from "react";
import "../../../styles/PreviewSchedule.css";

const weekDayVi = (isoStr) => {
  if (!isoStr) return "";
  const day = new Date(isoStr).getDay();
  return [
    "Chủ nhật",
    "Thứ 2",
    "Thứ 3",
    "Thứ 4",
    "Thứ 5",
    "Thứ 6",
    "Thứ 7",
  ][day];
};

const PreviewSchedule = ({ details = [] }) => {
  if (!details.length) return null;

  return (
    <div className="tsf-preview">
      <h4>Danh sách buổi học sẽ được tạo:</h4>
      <table className="tsf-table">
        <thead>
          <tr>
            <th>STT</th>
            <th>Ngày dạy</th>
            <th>Thứ</th>
            <th>Tiết</th>
            <th>Loại</th>
          </tr>
        </thead>
        <tbody>
          {details.map((d, i) => (
            <tr key={i}>
              <td>{i + 1}</td>
              <td>{d.teachingDate}</td>
              <td>{weekDayVi(d.teachingDate)}</td>
              <td>
                {d.periodStart} - {d.periodEnd}
              </td>
              <td>{d.type}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PreviewSchedule;
