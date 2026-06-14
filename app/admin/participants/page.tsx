"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { QRCodeCanvas } from "qrcode.react";

export default function AdminParticipantsPage() {
  const router = useRouter();

  const [authorized, setAuthorized] = useState(false);
  const [participants, setParticipants] = useState<any[]>([]);

  async function loadParticipants() {
    const res = await fetch("/api/admin/participants");
    setParticipants(await res.json());
  }

  function logout() {
    localStorage.removeItem("admin-auth");
    router.push("/admin-login");
  }

  function downloadQR(qrToken: string) {
    const canvas = document.getElementById(`qr-${qrToken}`) as HTMLCanvasElement;
    if (!canvas) return;

    const url = canvas.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = url;
    a.download = `QR-${qrToken}.png`;
    a.click();
  }

  useEffect(() => {
    const auth = localStorage.getItem("admin-auth");

    if (auth !== "true") {
      router.push("/admin-login");
      return;
    }

    setAuthorized(true);
    loadParticipants();
  }, [router]);

  if (!authorized) {
    return null;
  }

  return (
    <main style={{ maxWidth: 1100, margin: "60px auto", fontFamily: "sans-serif" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 16,
        }}
      >
        <div>
          <h1>Partecipanti</h1>
          <p>Elenco completo con badge ID, QR token, punti e QR scaricabile.</p>
        </div>

        <button onClick={logout} style={{ padding: 10 }}>
          Logout
        </button>
      </div>

      <div style={{ marginTop: 20 }}>
        <a href="/admin">← Torna ad Admin Panel</a>
      </div>

      <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 24 }}>
        <thead>
          <tr>
            <th>Badge ID</th>
            <th>QR Token</th>
            <th>Punti</th>
            <th>Dashboard</th>
            <th>QR Code</th>
            <th>Download</th>
          </tr>
        </thead>

        <tbody>
          {participants.map((p) => {
            const baseUrl =
              process.env.NEXT_PUBLIC_BASE_URL || window.location.origin;

            const playerUrl = `${baseUrl}/player/${p.qrToken}`;

            return (
              <tr key={p.id}>
                <td>{p.badgeId}</td>
                <td>{p.qrToken}</td>
                <td>{p.totalPoints}</td>
                <td>
                  <a href={`/player/${p.qrToken}`} target="_blank">
                    Apri
                  </a>
                </td>
                <td>
                  <QRCodeCanvas
                    id={`qr-${p.qrToken}`}
                    value={playerUrl}
                    size={90}
                    includeMargin
                  />
                </td>
                <td>
                  <button onClick={() => downloadQR(p.qrToken)}>
                    Scarica PNG
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </main>
  );
}