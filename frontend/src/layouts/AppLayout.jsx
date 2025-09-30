// src/components/AppLayout.jsx
import React from "react";
import { colors } from "../theme";

export default function AppLayout({ children }) {
    return (
        <div className={`min-h-screen flex items-center justify-center ${colors.background}`}>
            <div className={`p-10 rounded-2xl shadow-lg w-full max-w-md ${colors.card}`}>
                {children}
            </div>
        </div>
    );
}
