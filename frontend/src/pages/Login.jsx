import { useState } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../service/client";
import bgLogin from "../assets/bg_login.jpg";
import { FaUser, FaLock } from "react-icons/fa";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password)
      return alert("กรุณากรอก username และ password");
    setLoading(true);

    try {
      const { data } = await apiClient.post("/api/auth/login", {
        username,
        password,
      });

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      navigate("/home");
    } catch (err) {
      const msg =
        err.response?.data?.detail || "เกิดข้อผิดพลาด ไม่สามารถ login ได้";
      alert(msg);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: `url(${bgLogin})` }}
    >
      <div className="w-full max-w-md p-8 rounded-lg">
        {/* LOGO */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-16 h-16 bg-white rounded flex items-center justify-center">
            <span className="text-green-600 font-bold text-2xl">★</span>
          </div>
          <h1 className="text-white text-3xl font-bold mt-4">LOGO</h1>
        </div>

        {/* LOGIN TITLE */}
        <h2 className="text-white text-xl font-semibold text-center mb-6">
          LOGIN
        </h2>

        {/* FORM */}
        <form className="space-y-4" onSubmit={handleSubmit} autoComplete="off">
          {/* Username Input */}
          <div className="flex items-center border border-white/70 rounded px-3 bg-transparent focus-within:ring-2 focus-within:ring-green-400">
            <FaUser className="text-white opacity-80 mr-2" />
            <input
              type="text"
              placeholder="USERNAME"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full py-3 bg-transparent text-white placeholder-gray-300 focus:outline-none"
            />
          </div>

          {/* Password Input */}
          <div className="flex items-center border border-white/70 rounded px-3 bg-transparent focus-within:ring-2 focus-within:ring-green-400">
            <FaLock className="text-white opacity-80 mr-2" />
            <input
              type="password"
              placeholder="PASSWORD"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full py-3 bg-transparent text-white placeholder-gray-300 focus:outline-none"
            />
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-white text-green-700 py-3 rounded font-semibold hover:bg-gray-100 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "กำลังเข้าสู่ระบบ..." : "LOGIN"}
          </button>
        </form>

        {/* Forgot password */}
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
