import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../service/client";
import { FaUser, FaLock } from "react-icons/fa";

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
          await apiClient.get("/api/menus");
          navigate("/overview", { replace: true });
        } catch {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
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
      navigate("/overview", { replace: true });
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
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: "url('/assets/bg_login.jpg')" }}
    >
      {/* ⭐ เพิ่ม style tag สำหรับ autofill */}
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
        user = admin | pass = abc@1234
      </div>

      <div className="w-full max-w-md p-8 rounded-lg">
        <div className="flex flex-col items-center mb-6">
          <div className="w-16 h-16 bg-white rounded flex items-center justify-center">
            <span className="text-green-600 font-bold text-2xl">★</span>
          </div>
          <h1 className="text-white text-3xl font-bold mt-4">LOGO</h1>
        </div>

        <form
          onSubmit={handleSubmit}
          method="post"
          action="/login"
          autoComplete="on"
          className="space-y-4"
        >
          <div className="flex items-center border border-white/70 rounded px-3 bg-transparent focus-within:ring-2 focus-within:ring-green-400">
            <FaUser className="text-white opacity-80 mr-2" />
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
              className="w-full py-3 bg-transparent text-white placeholder-gray-300 focus:outline-none"
            />
          </div>

          <div className="flex items-center border border-white/70 rounded px-3 bg-transparent focus-within:ring-2 focus-within:ring-green-400">
            <FaLock className="text-white opacity-80 mr-2" />
            <input
              ref={passwordRef}
              id="password"
              name="password"
              type="password"
              placeholder="PASSWORD"
              autoComplete="current-password"
              readOnly={!inputsReady}
              onFocus={handleFocus}
              className="w-full py-3 bg-transparent text-white placeholder-gray-300 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-white text-green-700 py-3 rounded font-semibold hover:bg-gray-100 transition duration-300 disabled:opacity-50"
          >
            {loading ? "กำลังเข้าสู่ระบบ..." : "LOGIN"}
          </button>
        </form>

        <p className="mt-4 text-right text-sm">
          <a href="/forgot-password" className="underline text-white">
            Forgot password?
          </a>
        </p>
      </div>
    </div>
  );
}

export default Login;