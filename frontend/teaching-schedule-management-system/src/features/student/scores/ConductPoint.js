import React, { useState, useEffect } from 'react';
import ScoreApi from '../../../api/ScoreApi'; // Dùng ScoreApi
// XÓA DÒNG NÀY: import { getAllSemesters } ... (Không dùng API của Admin nữa)
import '../../../styles/ConductPoint.css';
import { useAuth } from '../../../contexts/AuthContext';

const ConductPoint = () => {
    const { user } = useAuth();
    const [semesters, setSemesters] = useState([]);
    
    const [formData, setFormData] = useState({
        semesterId: '',
        criteria1: 0,
        criteria2: 0,
        criteria3: 0,
        criteria4: 0,
        criteria5: 0
    });

    const [totalScore, setTotalScore] = useState(0);
    const [rank, setRank] = useState('Yếu');

    // 1. Load danh sách học kỳ
    useEffect(() => {
        const fetchSemesters = async () => {
            try {
                // --- SỬA QUAN TRỌNG TẠI ĐÂY ---
                // Dùng API riêng của Sinh viên (đã khai báo trong ScoreApi)
                const response = await ScoreApi.getSemesters(); 
                
                // Backend trả về list luôn, hoặc trong response.data
                setSemesters(response.data || response || []);
            } catch (error) {
                console.error("Lỗi tải học kỳ:", error);
                // Nếu vẫn lỗi 403, chứng tỏ Backend chưa build xong code mới
            }
        };
        fetchSemesters();
    }, []);

    // 2. Tự động tính tổng điểm và xếp loại
    useEffect(() => {
        const total = 
            parseInt(formData.criteria1 || 0) + 
            parseInt(formData.criteria2 || 0) + 
            parseInt(formData.criteria3 || 0) + 
            parseInt(formData.criteria4 || 0) + 
            parseInt(formData.criteria5 || 0);

        setTotalScore(total);

        let r = 'Yếu';
        if (total >= 90) r = 'Xuất sắc';
        else if (total >= 80) r = 'Tốt';
        else if (total >= 65) r = 'Khá';
        else if (total >= 50) r = 'Trung bình';
        setRank(r);

    }, [formData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        const maxValues = { criteria1: 20, criteria2: 25, criteria3: 20, criteria4: 25, criteria5: 10 };
        let val = parseInt(value) || 0;
        
        if (maxValues[name] && val > maxValues[name]) val = maxValues[name];
        if (val < 0) val = 0;

        setFormData({ ...formData, [name]: val });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const studentCode = user?.studentCode; 

        if (!studentCode) {
            alert("Lỗi: Không tìm thấy thông tin mã sinh viên. Vui lòng đăng xuất và đăng nhập lại!");
            return;
        }

        if (!formData.semesterId) {
            alert("Vui lòng chọn học kỳ!");
            return;
        }

        try {
            const payload = {
                semesterId: formData.semesterId,
                criteria1: formData.criteria1,
                criteria2: formData.criteria2,
                criteria3: formData.criteria3,
                criteria4: formData.criteria4,
                criteria5: formData.criteria5
            };

            await ScoreApi.submitConduct(studentCode, payload);
            alert("Đã gửi điểm rèn luyện thành công! Kết quả đang chờ duyệt.");
        } catch (error) {
            console.error("Lỗi gửi điểm:", error);
            alert("Lỗi: " + (error.response?.data?.message || "Không gửi được điểm."));
        }
    };

    return (
        <div className="conduct-container">
            <h2>Phiếu Chấm Điểm Rèn Luyện</h2>
            <p className="text-muted" style={{marginBottom: '20px'}}>
                Sinh viên: <b>{user?.fullName || "Chưa cập nhật"}</b> - MSV: <b>{user?.studentCode || "Trống"}</b>
            </p>

            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: 15 }}>
                    <label><b>Chọn Học Kỳ:</b></label>
                    <select 
                        name="semesterId" 
                        value={formData.semesterId} 
                        onChange={(e) => setFormData({...formData, semesterId: e.target.value})}
                        required
                        style={{ width: '100%', padding: 8, marginTop: 5 }}
                    >
                        <option value="">-- Chọn học kỳ --</option>
                        {semesters.map(sem => (
                            <option key={sem.id} value={sem.id}>{sem.name}</option>
                        ))}
                    </select>
                </div>

                <h3>Điểm Thành Phần</h3>
                <div className="criteria-group">
                    <label>Mục 1: Ý thức học tập (Max 20)</label>
                    <input type="number" name="criteria1" value={formData.criteria1} onChange={handleChange} min="0" max="20" required />
                </div>
                <div className="criteria-group">
                    <label>Mục 2: Ý thức chấp hành quy chế (Max 25)</label>
                    <input type="number" name="criteria2" value={formData.criteria2} onChange={handleChange} min="0" max="25" required />
                </div>
                <div className="criteria-group">
                    <label>Mục 3: Tham gia hoạt động chính trị XH (Max 20)</label>
                    <input type="number" name="criteria3" value={formData.criteria3} onChange={handleChange} min="0" max="20" required />
                </div>
                <div className="criteria-group">
                    <label>Mục 4: Phẩm chất công dân (Max 25)</label>
                    <input type="number" name="criteria4" value={formData.criteria4} onChange={handleChange} min="0" max="25" required />
                </div>
                <div className="criteria-group">
                    <label>Mục 5: Tham gia ban cán sự lớp (Max 10)</label>
                    <input type="number" name="criteria5" value={formData.criteria5} onChange={handleChange} min="0" max="10" required />
                </div>

                <div className="result-box">
                    <p>Tổng điểm: <span style={{ color: 'blue', fontSize: '1.2em' }}>{totalScore}</span> / 100</p>
                    <p>Xếp loại: <span style={{ color: 'red', fontWeight: 'bold' }}>{rank}</span></p>
                </div>

                <button type="submit" className="btn-submit" style={{ marginTop: 20, width: '100%' }}>Gửi Điểm</button>
            </form>
        </div>
    );
};

export default ConductPoint;