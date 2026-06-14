"use client";

import { useState } from "react";

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  async function login() {
    setMessage("");

    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ password }),
    });

    const data = await res.json();

    if (!res.ok) {
      setMessage(data.error || "Login failed");
      return;
    }

    window.location.href = "/admin";
  }

  return (
    <main
      style={{
        maxWidth: 420,
        margin: "80px auto",
        fontFamily: "sans-serif",
      }}
    >
      <h1>Admin Login</h1>

      <p>Inserisci la password amministratore.</p>

      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        style={{
          width: "100%",
          padding: 14,
          fontSize: 18,
          marginTop: 20,
        }}
      />

      <button
        onClick={login}
        style={{
          width: "100%",
          padding: 14,
          marginTop: 12,
          fontSize: 18,
        }}
      >
        Login
      </button>

      {message && (
        <p style={{ marginTop: 20, color: "red" }}>
          {message}
        </p>
      )}
    </main>
  );
}