import React, { useState, useEffect } from 'react';
import ScoreApi from '../../../api/ScoreApi';
import '../../../styles/InputGrade.css';

const InputGrade = () => {
    // State lưu danh sách lớp học phần
    const [classSections, setClassSections] = useState([]);

    const [formData, setFormData] = useState({
        studentCode: '',
        classSectionId: '', // Cái này sẽ được chọn từ Dropdown
        attendanceScore: '',
        midtermScore: '',
        finalScore: ''
    });

    const [result, setResult] = useState(null);
    const [error, setError] = useState('');

    // 1. Load danh sách lớp khi vào trang
    useEffect(() => {
        const fetchClassSections = async () => {
            try {
                const response = await ScoreApi.getAllClassSections();
                setClassSections(response.data || response || []);
            } catch (err) {
                console.error("Lỗi tải danh sách lớp:", err);
            }
        };
        fetchClassSections();
    }, []);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setResult(null);

        if (!formData.classSectionId) {
            alert("Vui lòng chọn Lớp học phần!");
            return;
        }

        try {
            const payload = {
                studentCode: formData.studentCode,
                classSectionId: parseInt(formData.classSectionId),
                attendanceScore: parseFloat(formData.attendanceScore),
                midtermScore: parseFloat(formData.midtermScore),
                finalScore: parseFloat(formData.finalScore)
            };

            const response = await ScoreApi.inputGrade(payload);
            const data = response.data || response;
            setResult(data);
            alert("Nhập điểm thành công!");

        } catch (err) {
            console.error("Lỗi nhập điểm:", err);
            setError(err.response?.data?.message || "Có lỗi xảy ra. Kiểm tra lại mã SV.");
        }
    };

    return (
        <div className="container mt-4" style={{ maxWidth: '800px' }}>
            <div className="card shadow">
                <div className="card-header bg-primary text-white">
                    <h4 className="mb-0"><i className="fas fa-edit me-2"></i>Nhập Kết Quả Học Tập</h4>
                </div>
                <div className="card-body">
                    
                    <form onSubmit={handleSubmit}>
                        <div className="row mb-3">
                            <div className="col-md-6">
                                <label className="form-label fw-bold">Mã Sinh Viên:</label>
                                <input 
                                    type="text" 
                                    className="form-control" 
                                    name="studentCode" 
                                    value={formData.studentCode} 
                                    onChange={handleChange} 
                                    placeholder="VD: SV001" 
                                    required 
                                />
                            </div>
                            
                            {/* --- ĐÃ SỬA THÀNH DROPDOWN --- */}
                            <div className="col-md-6">
                                <label className="form-label fw-bold">Chọn Lớp Học Phần:</label>
                                <select 
                                    className="form-select" // Class của Bootstrap
                                    name="classSectionId" 
                                    value={formData.classSectionId} 
                                    onChange={handleChange} 
                                    required 
                                >
                                    <option value="">-- Chọn lớp --</option>
                                    {classSections.map(cls => (
                                        <option key={cls.id} value={cls.id}>
                                            {cls.name} (ID: {cls.id})
                                        </option>
                                    ))}
                                </select>
                            </div>
                            {/* ----------------------------- */}
                        </div>

                        <div className="row mb-4">
                            <div className="col-md-4">
                                <label className="form-label">Điểm Chuyên Cần (10%):</label>
                                <input type="number" step="0.1" min="0" max="10" className="form-control" name="attendanceScore" value={formData.attendanceScore} onChange={handleChange} required />
                            </div>
                            <div className="col-md-4">
                                <label className="form-label">Điểm Giữa Kỳ (40%):</label>
                                <input type="number" step="0.1" min="0" max="10" className="form-control" name="midtermScore" value={formData.midtermScore} onChange={handleChange} required />
                            </div>
                            <div className="col-md-4">
                                <label className="form-label">Điểm Cuối Kỳ (50%):</label>
                                <input type="number" step="0.1" min="0" max="10" className="form-control" name="finalScore" value={formData.finalScore} onChange={handleChange} required />
                            </div>
                        </div>

                        <button type="submit" className="btn btn-primary w-100">
                            <i className="fas fa-save me-2"></i>Lưu Kết Quả
                        </button>
                    </form>

                    {error && <div className="alert alert-danger mt-3">{error}</div>}

                    {result && (
                        <div className="alert alert-success mt-4">
                            <h5 className="alert-heading"><i className="fas fa-check-circle me-2"></i>Đã lưu thành công!</h5>
                            <hr />
                            <div className="row">
                                <div className="col-md-6">
                                    <p><strong>Sinh viên:</strong> {result.studentName} ({result.studentCode})</p>
                                    <p><strong>Lớp:</strong> {result.className}</p>
                                </div>
                                <div className="col-md-6 text-end">
                                    <p>Tổng kết (hệ 10): <strong className="text-primary fs-5">{result.totalScore10}</strong></p>
                                    <p>Tổng kết (hệ 4): <strong>{result.totalScore4}</strong></p>
                                    <p>Điểm chữ: <strong className="text-danger fs-4">{result.letterGrade}</strong></p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default InputGrade;