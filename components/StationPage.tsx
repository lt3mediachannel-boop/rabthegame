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

  const [station, setStation] = useState<any>(null);
  const [badgeId, setBadgeId] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [scannerActive, setScannerActive] = useState(false);

  const scannerRef = useRef<Html5Qrcode | null>(null);

  useEffect(() => {
    async function loadStation() {
      const res = await fetch(`/api/station/${stationSlug}`);
      const data = await res.json();

      if (!res.ok) {
        setMessage(data.error || "Station not found");
        return;
      }

      setStation(data);
    }

    loadStation();
  }, [stationSlug]);

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
    await claimPoints({ badgeId });
  }

  async function startScanner() {
    setMessage("");
    setScannerActive(true);

    setTimeout(async () => {
      const scanner = new Html5Qrcode("qr-reader");
      scannerRef.current = scanner;

      try {
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

            await claimPoints({ qrToken });
          },
          () => {}
        );
      } catch (error: any) {
        setMessage(error?.message || "Camera access error");
        setScannerActive(false);
      }
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
    <main className="station-page-modern">
        <section className="station-hero">
        <div className="station-robot">
            <div className="station-robot-head">
            <span />
            <span />
            </div>
            <div className="station-robot-body" />
        </div>

        <div className="hero-badge">🎯 Challenge</div>

        <h1>{station?.name || "Loading..."}</h1>

        {station && (
            <div className="station-points-card">
            <span>Reward</span>
            <strong>{station.points} Points</strong>
            </div>
        )}
        </section>

        <section className="station-card">
        <p>{t.station.insertBadge}</p>

        <input
            value={badgeId}
            onChange={(e) => setBadgeId(e.target.value)}
            placeholder={t.home.placeholder}
            className="station-input"
        />

        <button
            onClick={claimByBadge}
            disabled={loading || !badgeId || !station}
            className="station-button-primary"
        >
            {loading ? t.station.loading : t.station.getPoints}
        </button>

        <div className="station-divider">
            <span>OR</span>
        </div>

        {!scannerActive ? (
            <button
            onClick={startScanner}
            disabled={loading || !station}
            className="station-button-secondary"
            >
            📷 Scan your Badge QR Code
            </button>
        ) : (
            <button
            onClick={stopScanner}
            className="station-button-secondary"
            >
            Stop Scanner
            </button>
        )}

        {scannerActive && (
            <div className="station-scanner">
            <div id="qr-reader" />
            </div>
        )}

        {message && (
            <div
            className={
                message.toLowerCase().includes("error") ||
                message.toLowerCase().includes("already")
                ? "station-message error"
                : "station-message success"
            }
            >
            {message}
            </div>
        )}
        </section>
    </main>
  );
}