import React, { forwardRef, useImperativeHandle, useState, useEffect } from "react";

const AUTO_HIDE = 2500;

const AppToast = forwardRef(function AppToast(_, ref) {
  const [open, setOpen] = useState(false);
  const [msg, setMsg] = useState("");
  const [type, setType] = useState("success"); // "success" | "error"
  const [timer, setTimer] = useState(null);

  useImperativeHandle(ref, () => ({
    success: (message) => show(message, "success"),
    error: (message) => show(message, "error"),
    hide: () => setOpen(false),
  }));

  useEffect(() => () => { if (timer) clearTimeout(timer); }, [timer]);

  const show = (message, variant) => {
    if (timer) clearTimeout(timer);
    setMsg(message);
    setType(variant);
    setOpen(true);
    const t = setTimeout(() => setOpen(false), AUTO_HIDE);
    setTimer(t);
  };

  return (
    <div className={`app-toast ${open ? "show" : ""} ${type}`}>
      <div className="app-toast__content">{msg}</div>
    </div>
  );
});

export default AppToast;
