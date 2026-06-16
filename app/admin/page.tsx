"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminPage() {
  const router = useRouter();

  const [authorized, setAuthorized] = useState(false);

  const [participants, setParticipants] = useState<any[]>([]);
  const [stations, setStations] = useState<any[]>([]);
  const [badgeId, setBadgeId] = useState("");

  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [quizTitle, setQuizTitle] = useState("");
  const [quizSlug, setQuizSlug] = useState("");
  const [selectedQuizId, setSelectedQuizId] = useState("");
  const [questionText, setQuestionText] = useState("");
  const [questionPoints, setQuestionPoints] = useState("1");
  const [answerA, setAnswerA] = useState("");
  const [answerB, setAnswerB] = useState("");
  const [answerC, setAnswerC] = useState("");
  const [answerD, setAnswerD] = useState("");
  const [correctIndex, setCorrectIndex] = useState("0");

  const [stationName, setStationName] = useState("");
  const [stationSlug, setStationSlug] = useState("");
  const [stationPoints, setStationPoints] = useState("");

  async function loadData() {
    const pRes = await fetch("/api/admin/participants");
    const sRes = await fetch("/api/admin/stations");
    const qRes = await fetch("/api/admin/quizzes");

    setParticipants(await pRes.json());
    setStations(await sRes.json());
    setQuizzes(await qRes.json());
  }

  function logout() {
    localStorage.removeItem("admin-auth");
    router.push("/admin-login");
  }

  async function addParticipant() {
    const res = await fetch("/api/admin/participants", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        badgeId: badgeId || undefined,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.error || "Errore creazione partecipante");
      return;
    }

    setBadgeId("");
    loadData();
  }

  async function addQuiz() {
    if (!quizTitle) return;

    const res = await fetch("/api/admin/quizzes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: quizTitle,
        slug: quizSlug,
      }),
    });

    if (!res.ok) {
      const data = await res.json();
      alert(data.error || "Errore creazione quiz");
      return;
    }

    setQuizTitle("");
    setQuizSlug("");
    loadData();
  }

  async function addStation() {
    if (!stationName || !stationSlug || !stationPoints) {
      alert("Insert station name, slug and points");
      return;
    }

    const res = await fetch("/api/admin/stations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: stationName,
        slug: stationSlug,
        points: Number(stationPoints),
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.error || "Station creation error");
      return;
    }

    setStationName("");
    setStationSlug("");
    setStationPoints("");
    loadData();
  }

  async function addQuestion() {
    if (!selectedQuizId || !questionText || !answerA || !answerB) {
      alert("Seleziona quiz, domanda e almeno due risposte");
      return;
    }

    const answers = [answerA, answerB, answerC, answerD].filter(Boolean);

    const res = await fetch(`/api/admin/quizzes/${selectedQuizId}/questions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: questionText,
        points: Number(questionPoints),
        answers,
        correctIndex: Number(correctIndex),
      }),
    });

    if (!res.ok) {
      const data = await res.json();
      alert(data.error || "Errore creazione domanda");
      return;
    }

    setQuestionText("");
    setQuestionPoints("1");
    setAnswerA("");
    setAnswerB("");
    setAnswerC("");
    setAnswerD("");
    setCorrectIndex("0");

    loadData();
  }

  useEffect(() => {
    const auth = localStorage.getItem("admin-auth");

    if (auth !== "true") {
      router.push("/admin-login");
      return;
    }

    setAuthorized(true);
    loadData();
  }, [router]);

  if (!authorized) {
    return null;
  }

  return (
    <main className="admin-modern-page">
      <section className="admin-modern-hero">
        <div>
          <div className="hero-badge">⚙️ Control Room</div>
          <h1>Admin Panel</h1>
          <p>Manage participants, challenge stations, quizzes and live ranking.</p>
        </div>

        <button onClick={logout} className="admin-logout-btn">
          Logout
        </button>
      </section>

      <section className="admin-stats-grid">
        <div className="admin-stat-card">
          <span>Participants</span>
          <strong>{participants.length}</strong>
        </div>

        <div className="admin-stat-card">
          <span>Stations</span>
          <strong>{stations.length}</strong>
        </div>

        <div className="admin-stat-card">
          <span>Quizzes</span>
          <strong>{quizzes.length}</strong>
        </div>
      </section>

      <section className="admin-section-card">
        <div className="admin-section-head">
          <div>
            <h2>Nuovo partecipante</h2>
            <p>Lascia vuoto per generare automaticamente il prossimo ID.</p>
          </div>
        </div>

        <div className="admin-form-row">
          <input
            value={badgeId}
            onChange={(e) => setBadgeId(e.target.value)}
            placeholder="Auto, oppure es. 001"
            className="admin-input"
          />

          <button onClick={addParticipant} className="admin-primary-btn">
            Aggiungi
          </button>
        </div>

        <div className="admin-link-row">
          <a href="/admin/participants" target="_blank">
            Gestione partecipanti e QR →
          </a>
        </div>
      </section>

      <section className="admin-section-card">
        <div className="admin-section-head">
          <div>
            <h2>Stazioni</h2>
            <p>Crea challenge con slug personalizzato e punti definiti.</p>
          </div>
        </div>

        <div className="admin-form-grid station-grid">
          <input
            value={stationName}
            onChange={(e) => setStationName(e.target.value)}
            placeholder="Station name"
            className="admin-input"
          />

          <input
            value={stationSlug}
            onChange={(e) => setStationSlug(e.target.value)}
            placeholder="Custom slug, es. theory-station-moss"
            className="admin-input"
          />

          <input
            value={stationPoints}
            onChange={(e) => setStationPoints(e.target.value)}
            type="number"
            placeholder="Points"
            className="admin-input"
          />

          <button onClick={addStation} className="admin-primary-btn">
            Create station
          </button>
        </div>

        <div className="admin-table-wrap">
          <table className="admin-table-modern">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Slug</th>
                <th>Punti</th>
                <th>Attiva</th>
                <th>Link</th>
                <th>QR Link</th>
              </tr>
            </thead>

            <tbody>
              {stations.map((s) => (
                <tr key={s.id}>
                  <td>{s.name}</td>
                  <td>
                    <code>{s.slug}</code>
                  </td>
                  <td>{s.points}</td>
                  <td>
                    <span className={s.active ? "admin-pill active" : "admin-pill inactive"}>
                      {s.active ? "Sì" : "No"}
                    </span>
                  </td>
                  <td>
                    <a href={`/station/${s.slug}`} target="_blank">
                      Apri
                    </a>
                  </td>
                  <td>
                    <a href={`/station/${s.slug}`} target="_blank">
                      /station/{s.slug}
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="admin-section-card">
        <div className="admin-section-head">
          <div>
            <h2>Classifica</h2>
            <p>Apri la classifica live in una nuova finestra.</p>
          </div>

          <a href="/leaderboard" target="_blank" className="admin-secondary-btn">
            Apri classifica live
          </a>
        </div>
      </section>

      <section className="admin-section-card">
        <div className="admin-section-head">
          <div>
            <h2>Crea quiz</h2>
            <p>Definisci titolo e slug del quiz.</p>
          </div>
        </div>

        <div className="admin-form-row">
          <input
            value={quizTitle}
            onChange={(e) => setQuizTitle(e.target.value)}
            placeholder="Titolo quiz"
            className="admin-input"
          />

          <input
            value={quizSlug}
            onChange={(e) => setQuizSlug(e.target.value)}
            placeholder="slug opzionale es. quiz-1"
            className="admin-input"
          />

          <button onClick={addQuiz} className="admin-primary-btn">
            Crea quiz
          </button>
        </div>
      </section>

      <section className="admin-section-card">
        <div className="admin-section-head">
          <div>
            <h2>Aggiungi domanda</h2>
            <p>Seleziona il quiz, inserisci domanda, risposte e risposta corretta.</p>
          </div>
        </div>

        <div className="admin-question-form">
          <select
            value={selectedQuizId}
            onChange={(e) => setSelectedQuizId(e.target.value)}
            className="admin-input"
          >
            <option value="">Seleziona quiz</option>
            {quizzes.map((q) => (
              <option key={q.id} value={q.id}>
                {q.title}
              </option>
            ))}
          </select>

          <input
            value={questionText}
            onChange={(e) => setQuestionText(e.target.value)}
            placeholder="Testo domanda"
            className="admin-input full"
          />

          <input
            value={questionPoints}
            onChange={(e) => setQuestionPoints(e.target.value)}
            type="number"
            placeholder="Punti"
            className="admin-input small"
          />

          <div className="admin-answer-grid">
            <input value={answerA} onChange={(e) => setAnswerA(e.target.value)} placeholder="Risposta A" className="admin-input" />
            <input value={answerB} onChange={(e) => setAnswerB(e.target.value)} placeholder="Risposta B" className="admin-input" />
            <input value={answerC} onChange={(e) => setAnswerC(e.target.value)} placeholder="Risposta C" className="admin-input" />
            <input value={answerD} onChange={(e) => setAnswerD(e.target.value)} placeholder="Risposta D" className="admin-input" />
          </div>

          <div className="admin-form-row">
            <select
              value={correctIndex}
              onChange={(e) => setCorrectIndex(e.target.value)}
              className="admin-input"
            >
              <option value="0">Corretta: A</option>
              <option value="1">Corretta: B</option>
              <option value="2">Corretta: C</option>
              <option value="3">Corretta: D</option>
            </select>

            <button onClick={addQuestion} className="admin-primary-btn">
              Aggiungi domanda
            </button>
          </div>
        </div>
      </section>

      <section className="admin-section-card">
        <div className="admin-section-head">
          <div>
            <h2>Quiz creati</h2>
            <p>Elenco dei quiz disponibili e link di test.</p>
          </div>
        </div>

        <div className="admin-quiz-list">
          {quizzes.map((quiz) => (
            <article key={quiz.id} className="admin-quiz-card">
              <div>
                <h3>{quiz.title}</h3>
                <p>
                  Slug: <code>{quiz.slug}</code>
                </p>
                <p>Domande: {quiz.questions?.length || 0}</p>
              </div>

              <a href={`/quiz/${quiz.slug}?code=001`} target="_blank">
                Prova quiz come partecipante 001
              </a>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}