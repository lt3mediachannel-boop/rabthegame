"use client";

import { useState } from "react";

const ADMIN_PASSWORD = "RabGame-Admin-2026!";

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  function login() {
    if (password !== ADMIN_PASSWORD) {
      setMessage("Wrong password");
      return;
    }

    localStorage.setItem("admin-auth", "true");
    window.location.href = "/admin";
  }

  return (
    <main style={{ maxWidth: 420, margin: "80px auto", fontFamily: "sans-serif" }}>
      <h1>Admin Login</h1>

      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        style={{ width: "100%", padding: 14, fontSize: 18, marginTop: 20 }}
      />

      <button
        onClick={login}
        style={{ width: "100%", padding: 14, marginTop: 12, fontSize: 18 }}
      >
        Login
      </button>

      {message && <p style={{ color: "red" }}>{message}</p>}
    </main>
  );
}