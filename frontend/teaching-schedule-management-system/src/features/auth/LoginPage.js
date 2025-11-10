import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "../../styles/LoginPage.css";
import { useAuth } from "../../contexts/AuthContext";
import { authApi } from "../../api/AccountApi";


const normalizeRole = (rawRole) => {
  const r = String(rawRole || "").trim().toUpperCase();
  if (r === "ROLE_ADMIN" || r.includes("ADMIN")) return "Admin";
  if (r === "ROLE_TEACHER" || r.includes("TEACHER")) return "Teacher";
  if (r === "ROLE_STUDENT" || r.includes("STUDENT")) return "Student";
  return "User";
};

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { login, isLoggedIn, user, logout } = useAuth();
  const navigate = useNavigate();


  useEffect(() => {
    if (isLoggedIn && user?.role) {
      const role = user.role;
      if (role === "Admin") navigate("/dashboard", { replace: true });
      else if (role === "Teacher") navigate("/teacher-dashboard", { replace: true }); 
      else if (role === "Student") navigate("/student-dashboard", { replace: true });
      else navigate("/dashboard", { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setUsernameError("");
    setPasswordError("");

    if (!username) return setUsernameError("Vui lòng nhập tên đăng nhập");
    if (!password) return setPasswordError("Vui lòng nhập mật khẩu");

    setIsLoading(true);
    try {
      const data = await authApi.login({ username, password });

      const token = data?.token;
      if (!token) throw new Error("Login thành công nhưng backend không trả token.");

      const role = normalizeRole(data?.user?.role);
      const userPayload = {
        id: data?.user?.id ?? null,
        username: data?.user?.username ?? username,
        fullName:
          data?.user?.fullName ??
          data?.user?.name ??
          data?.user?.username ??
          username,
        role,                         
        rawRole: data?.user?.role ?? null,
        teacherId: data?.user?.teacherId ?? null,
      };

      login({ token, user: userPayload }, rememberMe);

      // Điều hướng theo vai trò
      if (role === "Admin") navigate("/dashboard", { replace: true });
      else if (role === "Teacher") navigate("/teacher-dashboard", { replace: true });
      else if (role === "Student") navigate("/student-dashboard", { replace: true });
      else navigate("/dashboard", { replace: true });
    } catch (error) {
      const status = error?.response?.status;
      const backendMsg = error?.response?.data?.message || error?.response?.data?.error || "";
      let errorMessage = "Tên đăng nhập hoặc mật khẩu không đúng";
      if (status === 403) errorMessage = backendMsg || "Không có quyền truy cập (403).";
      else if (status === 401) errorMessage = backendMsg || "Sai thông tin đăng nhập (401).";
      else if (status === 500) errorMessage = backendMsg || "Lỗi server, vui lòng thử lại sau (500).";
      else if (status) errorMessage = backendMsg || `Lỗi ${status}: Không thể đăng nhập`;
      else if ((error?.message || "").includes("Network Error")) errorMessage = "Không thể kết nối đến server";
      setUsernameError(errorMessage);
      setPasswordError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoToDashboard = () => navigate("/dashboard", { replace: true });
  const handleLogout = () => logout();

  
  return (
    <section className="vh-100">
      <div className="container-fluid h-custom">
        <div className="row d-flex justify-content-center align-items-center h-100">

          <div className="col-md-6 col-lg-6 col-xl-6 d-flex justify-content-center">
            <img
              src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.webp"
              className="img-fluid w-75"
              alt="Login"
              style={{ maxHeight: "400px", objectFit: "contain" }}
            />
          </div>


          <div className="col-md-6 col-lg-5 col-xl-4 offset-xl-1">
            <div className="card p-4 shadow rounded-3">
              <h4 className="text-center mb-1">TSMS TLU</h4>

              <form onSubmit={handleLogin} noValidate>
                <div className="form-outline mb-2">
                  <label className="form-label" htmlFor="username">Tên đăng nhập</label>
                  <input
                    type="text"
                    id="username"
                    className={`form-control ${usernameError ? "is-invalid" : ""}`}
                    placeholder="Nhập tên đăng nhập"
                    value={username}
                    onChange={(e) => {
                      setUsername(e.target.value);
                      if (usernameError) setUsernameError("");
                    }}
                  />
                  <div className="error-container">
                    {usernameError && <div className="text-danger small">{usernameError}</div>}
                  </div>
                </div>

                <div className="form-outline mb-2">
                  <label className="form-label" htmlFor="password">Mật khẩu</label>
                  <div className="input-group">
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      className={`form-control ${passwordError ? "is-invalid" : ""}`}
                      placeholder="Nhập mật khẩu"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (passwordError) setPasswordError("");
                      }}
                    />
                    <span
                      className={`input-group-text bg-white px-3 ${passwordError ? "border-danger" : ""}`}
                      style={{ cursor: "pointer", borderLeft: "none" }}
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      <i className={`fas ${showPassword ? "fa-eye" : "fa-eye-slash"}`}></i>
                    </span>
                  </div>
                  <div className="error-container">
                    {passwordError && <div className="text-danger small">{passwordError}</div>}
                  </div>
                </div>

                <div className="d-flex justify-content-between align-items-center mb-3">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      checked={rememberMe}
                      onChange={() => setRememberMe(!rememberMe)}
                      id="rememberMe"
                    />
                    <label className="form-check-label" htmlFor="rememberMe">
                      Ghi nhớ đăng nhập
                    </label>
                  </div>
                  <button type="button" className="btn btn-link text-primary p-0" onClick={() => {}}>
                    Quên mật khẩu?
                  </button>
                </div>

                <div className="d-grid mb-3">
                  <button type="submit" className="btn btn-primary" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Đang đăng nhập...
                      </>
                    ) : (
                      "Đăng nhập"
                    )}
                  </button>
                </div>

                <p className="text-center text-muted mt-3 mb-0" style={{ fontSize: "14px" }}>
                  © 2025 Trường Đại học Thủy Lợi
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
