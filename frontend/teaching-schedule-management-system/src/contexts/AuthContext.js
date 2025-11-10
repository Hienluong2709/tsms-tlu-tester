// src/contexts/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import { setAuthToken } from "../api/axiosInstance";

const AuthContext = createContext();
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
};

// Helpers
const LS = window.localStorage;
const SS = window.sessionStorage;
const KEYS = {
  isLoggedIn: "isLoggedIn",
  user: "user",
  token: "token",
  rememberMe: "rememberMe",
};

function readAuthFrom(storage) {
  const isLoggedIn = storage.getItem(KEYS.isLoggedIn);
  const user = storage.getItem(KEYS.user);
  const token = storage.getItem(KEYS.token);
  if (isLoggedIn === "true" && user && token) {
    return { user: JSON.parse(user), token };
  }
  return null;
}

function isJwtExpired(token) {
  try {
    const [, payload] = token.split(".");
    const { exp } = JSON.parse(atob(payload));
    if (!exp) return false;
    return Date.now() >= exp * 1000;
  } catch {
    return false; // nếu token không phải JWT, bỏ qua kiểm tra
  }
}

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [ready, setReady] = useState(false);

  // ✅ login nhận { token, user } và lưu theo rememberMe
  const login = (data, rememberMe = false) => {
    if (!data?.token || !data?.user) {
      console.error("login() needs shape: { token, user }");
      return;
    }
    setIsLoggedIn(true);
    setUser(data.user);
    setToken(data.token);
    setAuthToken(data.token);

    // Xoá sạch trước khi set
    [LS, SS].forEach(s => {
      s.removeItem(KEYS.isLoggedIn);
      s.removeItem(KEYS.user);
      s.removeItem(KEYS.token);
    });

    const store = rememberMe ? LS : SS;
    store.setItem(KEYS.isLoggedIn, "true");
    store.setItem(KEYS.user, JSON.stringify(data.user));
    store.setItem(KEYS.token, data.token);

    // rememberMe flag chỉ lưu ở localStorage để hydrate biết có “nhớ”
    if (rememberMe) LS.setItem(KEYS.rememberMe, "true");
    else LS.removeItem(KEYS.rememberMe);
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUser(null);
    setToken(null);
    setAuthToken(null);

    [LS, SS].forEach(s => {
      s.removeItem(KEYS.isLoggedIn);
      s.removeItem(KEYS.user);
      s.removeItem(KEYS.token);
      s.removeItem(KEYS.rememberMe);
    });
  };

  // ✅ Hydrate: ưu tiên sessionStorage; nếu không có, chỉ dùng localStorage khi rememberMe = true
  useEffect(() => {
    try {
      let restored = readAuthFrom(SS);
      if (!restored && LS.getItem(KEYS.rememberMe) === "true") {
        restored = readAuthFrom(LS);
      }

      if (restored) {
        if (isJwtExpired(restored.token)) {
          // token hết hạn -> clear & ở màn login
          logout();
        } else {
          setIsLoggedIn(true);
          setUser(restored.user);
          setToken(restored.token);
          setAuthToken(restored.token);
        }
      } else {
        setAuthToken(null);
      }
    } catch {
      logout();
    } finally {
      setReady(true);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, token, ready, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
