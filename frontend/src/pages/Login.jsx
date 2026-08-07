// src/pages/Login.jsx - อัพเดทเพื่อเก็บข้อมูลเมนู
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../service/client";
import { FaUser, FaLock } from "react-icons/fa";
import { saveMenusToStorage, clearMenusFromStorage } from "../utils/menuAccess";

function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [inputsReady, setInputsReady] = useState(false);

  const usernameRef = useRef(null);
  const passwordRef = useRef(null);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const { data } = await apiClient.get("/api/menus");
          saveMenusToStorage(data); // บันทึกเมนูลง localStorage
          navigate("/overview/dashboard", { replace: true });
        } catch {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          clearMenusFromStorage();
        }
      }
    };
    checkAuth();
  }, [navigate]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setInputsReady(true);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const username = usernameRef.current.value;
    const password = passwordRef.current.value;

    if (!username || !password) {
      alert("กรุณากรอก username และ password");
      return;
    }

    setLoading(true);
    try {
      const { data } = await apiClient.post("/api/auth/login", {
        username,
        password,
      });

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      // ดึงข้อมูลเมนูหลังจาก login สำเร็จ
      try {
        const menuResponse = await apiClient.get("/api/menus");
        saveMenusToStorage(menuResponse.data);
      } catch (menuError) {
        console.error("Failed to fetch menus:", menuError);
      }

      navigate("/overview/dashboard", { replace: true });
    } catch (err) {
      alert(
        err.response?.data?.detail ||
        "เกิดข้อผิดพลาด ไม่สามารถ login ได้"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleFocus = (e) => {
    if (!inputsReady) {
      e.target.blur();
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center relative"
      style={{
        backgroundImage:
          "linear-gradient(rgba(8, 13, 28, 0.88), rgba(8, 13, 28, 0.94)), url('/assets/bg_login.jpg')",
      }}
    >
      <style>{`
        input:-webkit-autofill,
        input:-webkit-autofill:hover,
        input:-webkit-autofill:focus,
        input:-webkit-autofill:active {
          -webkit-background-clip: text;
          -webkit-text-fill-color: white;
          transition: background-color 5000s ease-in-out 0s;
          box-shadow: inset 0 0 20px 20px transparent;
        }
      `}</style>

      <div className="absolute top-4 right-4 text-white text-sm bg-black/40 px-3 py-1 rounded">
        {/* user = admin | pass = abc@1234 */}
      </div>

      <div
        className="w-full max-w-md p-8 rounded-2xl"
        style={{
          background: "linear-gradient(rgba(10, 17, 35, 0.85), rgba(8, 13, 28, 0.92))",
          border: "1px solid rgba(255, 255, 255, 0.07)",
          backdropFilter: "blur(20px)",
          boxShadow: "0 20px 50px rgba(0, 0, 0, 0.45)",
        }}
      >
        {/* Logo Section - matches Sidebar branding */}
        <div className="flex flex-col items-center mb-8">
          <div
            style={{
              background: "linear-gradient(135deg, #7C93F5 0%, #4F6DE0 50%, #3B5BDB 100%)",
              width: "60px",
              height: "60px",
              borderRadius: "14px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 6px 16px rgba(59, 91, 219, 0.4)",
            }}
          >
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
              <path
                d="M4 18L9 8L13 15L16 10L20 18"
                stroke="#fff"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <div className="mt-4 text-center">
            <div style={{ fontSize: "1.6rem", fontWeight: "800", lineHeight: 1.1 }}>
              <span style={{ color: "#fff" }}>ITS</span>{" "}
              <span style={{ color: "rgb(56, 189, 248)" }}>Command</span>
            </div>
            <div
              style={{
                fontSize: "0.7rem",
                letterSpacing: "0.2em",
                color: "#9CA3AF",
                fontWeight: "600",
                marginTop: "6px",
                display: "flex",
                justifyContent: "center",
                gap: "2px",
              }}
            >
              <span>SMAR</span>
              <span
                style={{
                  background: "rgba(56, 189, 248, 0.9)",
                  color: "#fff",
                  padding: "0 4px",
                  borderRadius: "2px",
                }}
              >
                T
              </span>
              <span>TRAFFIC</span>
            </div>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          method="post"
          action="/login"
          autoComplete="on"
          className="space-y-4"
        >
          <div
            className="flex items-center rounded px-3 bg-transparent transition-all"
            style={{
              border: "1px solid rgba(255, 255, 255, 0.15)",
            }}
            onFocus={(e) => (e.currentTarget.style.borderColor = "rgb(56, 189, 248)")}
            onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.15)")}
          >
            <FaUser className="text-gray-400 mr-2" />
            <input
              ref={usernameRef}
              id="username"
              name="username"
              type="text"
              placeholder="USERNAME"
              autoComplete="username"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck="false"
              data-form-type="username"
              readOnly={!inputsReady}
              onFocus={handleFocus}
              className="w-full py-3 bg-transparent text-white placeholder-gray-500 focus:outline-none"
            />
          </div>

          <div
            className="flex items-center rounded px-3 bg-transparent transition-all"
            style={{
              border: "1px solid rgba(255, 255, 255, 0.15)",
            }}
            onFocus={(e) => (e.currentTarget.style.borderColor = "rgb(56, 189, 248)")}
            onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.15)")}
          >
            <FaLock className="text-gray-400 mr-2" />
            <input
              ref={passwordRef}
              id="password"
              name="password"
              type="password"
              placeholder="PASSWORD"
              autoComplete="current-password"
              readOnly={!inputsReady}
              onFocus={handleFocus}
              className="w-full py-3 bg-transparent text-white placeholder-gray-500 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded font-semibold transition duration-300 disabled:opacity-50 cursor-pointer"
            style={{
              background: "linear-gradient(135deg, #7C93F5 0%, #4F6DE0 50%, #3B5BDB 100%)",
              color: "#fff",
              boxShadow: "0 4px 14px rgba(59, 91, 219, 0.4)",
            }}
          >
            {loading ? "กำลังเข้าสู่ระบบ..." : "LOGIN"}
          </button>
        </form>

        <p className="mt-4 text-right text-sm">
          <a
            href="/forgot-password"
            className="underline"
            style={{ color: "rgb(125, 211, 252)" }}
          >
            Forgot password?
          </a>
        </p>
      </div>
    </div>
  );
}

export default Login;