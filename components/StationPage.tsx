"use client";

import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { getTranslations } from "@/lib/translations";

export default function StationPage({
  stationSlug,
}: {
  stationSlug: string;
}) {
  const t = getTranslations();

  const [badgeId, setBadgeId] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [scannerActive, setScannerActive] = useState(false);

  const scannerRef = useRef<Html5Qrcode | null>(null);

  function extractTokenFromQr(value: string) {
    try {
      const url = new URL(value);
      const parts = url.pathname.split("/");
      return parts[parts.length - 1];
    } catch {
      return value;
    }
  }

  async function claimPoints(payload: { badgeId?: string; qrToken?: string }) {
    setLoading(true);
    setMessage("");

    const res = await fetch("/api/station/claim", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...payload,
        stationSlug,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      setMessage(data.error || t.errors.generic);
    } else {
      setMessage(
        `${t.leaderboard.participant} ${data.badgeId}: +${data.pointsAdded} ${t.leaderboard.points.toLowerCase()}. ${t.player.totalPoints}: ${data.totalPoints}`
      );
    }

    setLoading(false);
  }

  async function claimByBadge() {
    if (!badgeId) return;

    await claimPoints({
      badgeId,
    });
  }

  async function startScanner() {
    setMessage("");
    setScannerActive(true);

    setTimeout(async () => {
      const scanner = new Html5Qrcode("qr-reader");
      scannerRef.current = scanner;

      await scanner.start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: {
            width: 250,
            height: 250,
          },
        },
        async (decodedText) => {
          const qrToken = extractTokenFromQr(decodedText);

          await scanner.stop();
          scanner.clear();
          scannerRef.current = null;
          setScannerActive(false);

          await claimPoints({
            qrToken,
          });
        },
        () => {}
      );
    }, 100);
  }

  async function stopScanner() {
    if (scannerRef.current) {
      await scannerRef.current.stop();
      scannerRef.current.clear();
      scannerRef.current = null;
    }

    setScannerActive(false);
  }

  useEffect(() => {
    return () => {
      if (scannerRef.current) {
        scannerRef.current.stop().catch(() => {});
      }
    };
  }, []);

  return (
    <main
      style={{
        maxWidth: 520,
        margin: "60px auto",
        fontFamily: "sans-serif",
      }}
    >
      <h1>
        {t.station.title}: {stationSlug}
      </h1>

      <p>{t.station.insertBadge}</p>

      <input
        value={badgeId}
        onChange={(e) => setBadgeId(e.target.value)}
        placeholder={t.home.placeholder}
        style={{
          width: "100%",
          padding: 14,
          fontSize: 22,
          marginTop: 20,
        }}
      />

      <button
        onClick={claimByBadge}
        disabled={loading || !badgeId}
        style={{
          width: "100%",
          padding: 14,
          marginTop: 12,
          fontSize: 18,
        }}
      >
        {loading ? t.station.loading : t.station.getPoints}
      </button>

      <div style={{ marginTop: 24 }}>
        {!scannerActive ? (
          <button
            onClick={startScanner}
            disabled={loading}
            style={{
              width: "100%",
              padding: 14,
              fontSize: 18,
            }}
          >
            Scan QR Code
          </button>
        ) : (
          <button
            onClick={stopScanner}
            style={{
              width: "100%",
              padding: 14,
              fontSize: 18,
            }}
          >
            Stop Scanner
          </button>
        )}
      </div>

      {scannerActive && (
        <div
          style={{
            marginTop: 20,
            background: "#fff",
            padding: 12,
            borderRadius: 12,
          }}
        >
          <div id="qr-reader" />
        </div>
      )}

      {message && (
        <div
          style={{
            marginTop: 24,
            fontSize: 18,
          }}
        >
          {message}
        </div>
      )}
    </main>
  );
}