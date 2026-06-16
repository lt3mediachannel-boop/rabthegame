"use client";

import { useState } from "react";

export default function Home() {
  const [code, setCode] = useState("");

  function goToPlayer() {
    if (!code) return;
    window.location.href = `/player/${code}`;
  }

  return (
    <main className="hero">
      <div className="hero-badge">⚡ Challenge Arena</div>

      <h1>
        Completa le <span className="hl">sfide</span> e scala la classifica
      </h1>

      <p style={{ color: "var(--text2)", lineHeight: 1.6 }}>
        Scansiona il QR personale per accedere alla dashboard.
      </p>

      {/* <div className="input-block">
        <label className="input-label">Il tuo ID partecipante</label>

        <div className="input-row">
          <input
            className="input"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="001"
          />

          <button className="btn-primary" onClick={goToPlayer}>
            Entra →
          </button>
        </div>
      </div> */}
    </main>
  );
}