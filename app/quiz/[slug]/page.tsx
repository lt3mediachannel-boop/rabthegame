"use client";

import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";

export default function QuizPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const [slug, setSlug] = useState("");
  const [code, setCode] = useState("");
  const [manualCode, setManualCode] = useState("");
  const [data, setData] = useState<any>(null);
  const [selected, setSelected] = useState<Record<number, number>>({});
  const [message, setMessage] = useState("");
  const [scannerActive, setScannerActive] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const scannerRef = useRef<Html5Qrcode | null>(null);

  useEffect(() => {
    params.then((p) => {
      setSlug(p.slug);

      const url = new URL(window.location.href);
      const c = url.searchParams.get("code") || "";

      if (c) {
        setCode(c);
        loadQuiz(p.slug, c);
      }
    });
  }, [params]);

  function extractTokenFromQr(value: string) {
    try {
      const url = new URL(value);
      const parts = url.pathname.split("/");
      return parts[parts.length - 1];
    } catch {
      return value;
    }
  }

  async function loadQuiz(quizSlug: string, participantCode: string) {
    const res = await fetch(`/api/quiz/${quizSlug}?code=${participantCode}`);
    const json = await res.json();
    setData(json);
  }

  function startWithManualCode() {
    if (!manualCode) return;

    const nextCode = manualCode.trim();
    setCode(nextCode);

    const url = `/quiz/${slug}?code=${nextCode}`;
    window.history.replaceState(null, "", url);

    loadQuiz(slug, nextCode);
  }

  async function startScanner() {
    setScannerActive(true);
    setMessage("");

    setTimeout(async () => {
      const scanner = new Html5Qrcode("quiz-qr-reader");
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
            setCode(qrToken);

            const url = `/quiz/${slug}?code=${qrToken}`;
            window.history.replaceState(null, "", url);

            loadQuiz(slug, qrToken);
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

  async function submitQuiz() {
    const answers = Object.entries(selected).map(([questionId, answerId]) => ({
      questionId: Number(questionId),
      answerId: Number(answerId),
    }));

    const res = await fetch(`/api/quiz/${slug}/submit`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        code,
        answers,
      }),
    });

    const result = await res.json();

    if (!res.ok) {
      setMessage(result.error || "Quiz submission error");
    } else {
      setSubmitted(true);
      setMessage(
        `Quiz completed. Score: ${result.score}. Total points: ${result.totalPoints}`
      );
    }
  }

  useEffect(() => {
    return () => {
      if (scannerRef.current) {
        scannerRef.current.stop().catch(() => {});
      }
    };
  }, []);

  if (!code) {
    return (
      <main className="quiz-page-modern">
        <section className="quiz-intro-card">
          <div className="quiz-robot" aria-hidden="true">
            <div className="quiz-robot-head">
              <span />
              <span />
            </div>
            <div className="quiz-robot-body" />
          </div>

          <div className="hero-badge">📝 Quiz Access</div>

          <h1>Identify yourself to start the quiz</h1>

          <p>
            Before starting the quiz, you must identify yourself. Enter your
            participant Badge ID or scan your personal QR Code. This step is
            required to assign the quiz score to your profile and prevent
            multiple attempts.
          </p>

          <div className="quiz-login-box">
            <label>Participant Badge ID</label>

            <input
              value={manualCode}
              onChange={(e) => setManualCode(e.target.value)}
              placeholder="001"
            />

            <button onClick={startWithManualCode} disabled={!manualCode}>
              Continue to quiz →
            </button>
          </div>

          <div className="quiz-scan-box">
            {!scannerActive ? (
              <button onClick={startScanner}>
                Scan my personal QR Code
              </button>
            ) : (
              <button onClick={stopScanner}>
                Stop scanner
              </button>
            )}
          </div>

          {scannerActive && (
            <div className="qr-reader-wrap">
              <div id="quiz-qr-reader" />
            </div>
          )}

          {message && <p className="quiz-message">{message}</p>}

          <p className="quiz-helper">
            Your personal QR Code opens your dashboard and contains your unique
            participant token.
          </p>
        </section>
      </main>
    );
  }

  if (!data) {
    return (
      <main className="quiz-page-modern">
        <section className="quiz-intro-card">
          <h1>Loading...</h1>
        </section>
      </main>
    );
  }

  if (data.blocked) {
    return (
      <main className="quiz-page-modern">
        <section className="quiz-result-card">
          <div className="result-icon">✅</div>
          <h1>Quiz already completed</h1>
          <p>{data.message}</p>
          <strong>Score: {data.score}</strong>
        </section>
      </main>
    );
  }

  if (data.error) {
    return (
      <main className="quiz-page-modern">
        <section className="quiz-result-card">
          <div className="result-icon">⚠️</div>
          <h1>Quiz not available</h1>
          <p>{data.error}</p>
        </section>
      </main>
    );
  }

  const answeredCount = Object.keys(selected).length;
  const totalQuestions = data.quiz.questions.length;

  return (
    <main className="quiz-page-modern">
      <section className="quiz-header-modern">
        <div className="hero-badge">🧠 Active Quiz</div>

        <h1>{data.quiz.title}</h1>

        <p>
          Participant <strong>{data.participant.badgeId}</strong> ·{" "}
          {answeredCount}/{totalQuestions} answered
        </p>

        <div className="quiz-progress-bar">
          <div
            style={{
              width: `${Math.round((answeredCount / totalQuestions) * 100)}%`,
            }}
          />
        </div>
      </section>

      <section className="quiz-question-list">
        {data.quiz.questions.map((q: any, index: number) => (
          <article className="quiz-question-card" key={q.id}>
            <div className="question-topline">
              <span>Question {index + 1}</span>
              <strong>{q.points} point(s)</strong>
            </div>

            <h2>{q.text}</h2>

            {(q.imageUrl1 || q.imageUrl2) && (
              <div className="quiz-question-images">
                {q.imageUrl1 && (
                  <img src={q.imageUrl1} alt={`Question ${index + 1} image 1`} />
                )}

                {q.imageUrl2 && (
                  <img src={q.imageUrl2} alt={`Question ${index + 1} image 2`} />
                )}
              </div>
            )}

            <div className="quiz-options">
              {q.answers.map((a: any) => {
                const isSelected = selected[q.id] === a.id;

                return (
                  <label
                    key={a.id}
                    className={isSelected ? "quiz-option selected" : "quiz-option"}
                  >
                    <input
                      type="radio"
                      name={`question-${q.id}`}
                      value={a.id}
                      onChange={() =>
                        setSelected({
                          ...selected,
                          [q.id]: a.id,
                        })
                      }
                    />

                    <span>{a.text}</span>
                  </label>
                );
              })}
            </div>
          </article>
        ))}
      </section>

      <button
        className="quiz-submit-btn"
        onClick={submitQuiz}
        disabled={submitted || answeredCount === 0}
      >
        {submitted ? "Submitted" : "Submit Quiz"}
      </button>

      {message && (
        <section className={submitted ? "quiz-final-message success" : "quiz-final-message"}>
          {message}
        </section>
      )}
    </main>
  );
}