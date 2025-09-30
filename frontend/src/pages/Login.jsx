import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { colors } from "../theme";
import apiClient from "../service/client";

function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!username || !password) return alert("กรุณากรอก username และ password");
        setLoading(true);

        try {
            // ส่ง JSON แทน formData
            const { data } = await apiClient.post("/api/auth/login", {
                username,
                password,
            });

            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));
            navigate("/home");

        } catch (err) {
            const msg = err.response?.data?.detail || "เกิดข้อผิดพลาด ไม่สามารถ login ได้";
            alert(msg);
            console.error(err);
        } finally {
            setLoading(false);
        }
    };


    return (
        <>
            <h2 className={`text-3xl font-bold mb-6 ${colors.text} text-center`}>
                Welcome Back
            </h2>
            <form className="space-y-5" onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className={`w-full px-4 py-3 rounded-lg border ${colors.inputBorder} ${colors.inputBg} ${colors.text} ${colors.placeholder} focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`w-full px-4 py-3 rounded-lg border ${colors.inputBorder} ${colors.inputBg} ${colors.text} ${colors.placeholder} focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                />
                <button
                    type="submit"
                    disabled={loading}
                    className={`w-full ${colors.buttonBg} ${colors.text} py-3 rounded-lg font-semibold ${colors.buttonHover} transition duration-300 ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                    {loading ? "กำลังเข้าสู่ระบบ..." : "Sign In"}
                </button>
            </form>
            <p className={`mt-4 text-center text-gray-400`}>
                Don't have an account?{" "}
                <a href="/register" className={colors.link}>
                    Sign Up
                </a>
            </p>
        </>
    );
}

export default Login;
