import axios from "axios";


const getPathname = (url = "") => {
  try {
    const u = new URL(url, window.location.origin);
    return u.pathname || "";
  } catch {
    return String(url) || "";
  }
};

const isAuthPath = (url = "") => {
  const p = getPathname(url).toLowerCase();
  return (
    p === "/api/auth/login" ||
    p.endsWith("/auth/login") ||
    p.endsWith("/auth/refresh") ||
    p.endsWith("/auth/register")
  );
};

const isPublicAsset = (url = "") => {
  const p = getPathname(url);
  return (
    p === "/favicon.ico" ||
    p.startsWith("/static/") ||
    p.startsWith("/assets/") ||
    p.endsWith(".png") ||
    p.endsWith(".jpg") ||
    p.endsWith(".jpeg") ||
    p.endsWith(".svg") ||
    p.endsWith(".webp")
  );
};

const axiosInstance = axios.create({
  baseURL: "/api", // dùng proxy -> http://localhost:8080
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem("token", token);
    axiosInstance.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    localStorage.removeItem("token");
    delete axiosInstance.defaults.headers.common.Authorization;
  }
};

axiosInstance.interceptors.request.use(
  (config) => {
    const url = config?.url || "";
    if (!isAuthPath(url)) {
      const token =
        config.headers?.Authorization?.replace(/^Bearer\s+/i, "") ||
        localStorage.getItem("token");
      if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
      }
    } else {
      if (config.headers) delete config.headers.Authorization;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const res = error?.response;
    const cfg = error?.config || {};
    const status = res?.status;
    const method = (cfg.method || "").toUpperCase();
    const url = cfg.url || "";

    console.error("Lỗi API:", res || error.message);

    const shouldSkipRedirect =
      isAuthPath(url) ||
      isPublicAsset(url) ||
      method === "OPTIONS" ||
      window.location.pathname === "/login";

    if (status === 401 && !shouldSkipRedirect) {
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
