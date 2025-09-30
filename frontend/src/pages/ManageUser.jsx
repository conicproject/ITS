// file: frontend/src/pages/ManageUser.jsx
import { useState } from "react";
import apiClient from "../service/client";
import { colors } from "../theme";

function ManageUser() {
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const manageUser = async () => {
    if (!username || !password) return alert("กรุณากรอก username และ password");
    setLoading(true);
    try {
      const { data } = await apiClient.post("/api/users", {
        user_name: username,
        user_password: password,
      });
      alert(`สร้าง user เรียบร้อย: ${data.user_name}`);
      setUsername("");
      setPassword("");
    } catch (err) {
      const msg =
        err.response?.data?.detail ||
        (err.request ? "ไม่สามารถเชื่อมต่อ server" : "เกิดข้อผิดพลาดไม่ทราบสาเหตุ");
      alert(msg);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h1 className={`text-2xl font-bold mb-6 text-center ${colors.text}`}>
        เพิ่ม User ใหม่
      </h1>

      <div className="space-y-4">
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className={`w-full px-4 py-3 rounded-lg border ${colors.inputBorder} ${colors.inputBg} ${colors.text} ${colors.placeholder} focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500`}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={`w-full px-4 py-3 rounded-lg border ${colors.inputBorder} ${colors.inputBg} ${colors.text} ${colors.placeholder} focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500`}
        />

        <button
          onClick={manageUser}
          disabled={loading}
          className={`w-full py-3 rounded-lg text-white font-semibold transition-all
            ${loading ? "bg-indigo-300 cursor-not-allowed" : "bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700"}`}
        >
          {loading ? "กำลังสร้าง..." : "สร้าง User"}
        </button>
      </div>
    </>
  );
}

export default ManageUser;
