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
    if (!badgeId) return;

    const res = await fetch("/api/admin/participants", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ badgeId }),
    });

    if (!res.ok) {
      alert("Errore: badge già esistente?");
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
    <main style={{ maxWidth: 900, margin: "60px auto", fontFamily: "sans-serif" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1>Admin Panel</h1>

        <button onClick={logout} style={{ padding: 10 }}>
          Logout
        </button>
      </div>

      <section style={{ marginTop: 32 }}>
        <h2>Nuovo partecipante</h2>

        <input
          value={badgeId}
          onChange={(e) => setBadgeId(e.target.value)}
          placeholder="Es. 004"
          style={{ padding: 12, fontSize: 18 }}
        />

        <button onClick={addParticipant} style={{ padding: 12, marginLeft: 8 }}>
          Aggiungi
        </button>
      </section>

      <section style={{ marginTop: 40 }}>
        <h2>Partecipanti</h2>

        <p>Totale partecipanti: {participants.length}</p>

        <a href="/admin/participants" target="_blank">
          Gestione partecipanti e QR
        </a>
      </section>

      <section style={{ marginTop: 40 }}>
        <h2>Stazioni</h2>

        <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 12 }}>
          <thead>
            <tr>
              <th>Nome</th>
              <th>Slug</th>
              <th>Punti</th>
              <th>Attiva</th>
              <th>Link</th>
            </tr>
          </thead>

          <tbody>
            {stations.map((s) => (
              <tr key={s.id}>
                <td>{s.name}</td>
                <td>{s.slug}</td>
                <td>{s.points}</td>
                <td>{s.active ? "Sì" : "No"}</td>
                <td>
                  <a href={`/station/${s.slug}`} target="_blank">
                    Apri
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section style={{ marginTop: 40 }}>
        <a href="/leaderboard" target="_blank">
          Apri classifica live
        </a>
      </section>

      <section style={{ marginTop: 40 }}>
        <h2>Crea quiz</h2>

        <input
          value={quizTitle}
          onChange={(e) => setQuizTitle(e.target.value)}
          placeholder="Titolo quiz"
          style={{ padding: 12, fontSize: 18, marginRight: 8 }}
        />

        <input
          value={quizSlug}
          onChange={(e) => setQuizSlug(e.target.value)}
          placeholder="slug opzionale es. quiz-1"
          style={{ padding: 12, fontSize: 18, marginRight: 8 }}
        />

        <button onClick={addQuiz} style={{ padding: 12 }}>
          Crea quiz
        </button>
      </section>

      <section style={{ marginTop: 40 }}>
        <h2>Aggiungi domanda</h2>

        <select
          value={selectedQuizId}
          onChange={(e) => setSelectedQuizId(e.target.value)}
          style={{ padding: 12, fontSize: 18, marginRight: 8 }}
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
          style={{
            padding: 12,
            fontSize: 18,
            display: "block",
            marginTop: 12,
            width: "100%",
          }}
        />

        <input
          value={questionPoints}
          onChange={(e) => setQuestionPoints(e.target.value)}
          type="number"
          placeholder="Punti"
          style={{ padding: 12, fontSize: 18, marginTop: 12, width: 100 }}
        />

        <div style={{ display: "grid", gap: 8, marginTop: 12 }}>
          <input
            value={answerA}
            onChange={(e) => setAnswerA(e.target.value)}
            placeholder="Risposta A"
            style={{ padding: 12 }}
          />

          <input
            value={answerB}
            onChange={(e) => setAnswerB(e.target.value)}
            placeholder="Risposta B"
            style={{ padding: 12 }}
          />

          <input
            value={answerC}
            onChange={(e) => setAnswerC(e.target.value)}
            placeholder="Risposta C"
            style={{ padding: 12 }}
          />

          <input
            value={answerD}
            onChange={(e) => setAnswerD(e.target.value)}
            placeholder="Risposta D"
            style={{ padding: 12 }}
          />
        </div>

        <select
          value={correctIndex}
          onChange={(e) => setCorrectIndex(e.target.value)}
          style={{ padding: 12, fontSize: 18, marginTop: 12 }}
        >
          <option value="0">Corretta: A</option>
          <option value="1">Corretta: B</option>
          <option value="2">Corretta: C</option>
          <option value="3">Corretta: D</option>
        </select>

        <button onClick={addQuestion} style={{ padding: 12, marginLeft: 8 }}>
          Aggiungi domanda
        </button>
      </section>

      <section style={{ marginTop: 40 }}>
        <h2>Quiz creati</h2>

        {quizzes.map((quiz) => (
          <div
            key={quiz.id}
            style={{
              border: "1px solid #ddd",
              padding: 16,
              marginTop: 12,
            }}
          >
            <h3>{quiz.title}</h3>
            <p>Slug: {quiz.slug}</p>
            <p>Domande: {quiz.questions?.length || 0}</p>

            <a href={`/quiz/${quiz.slug}?code=001`} target="_blank">
              Prova quiz come partecipante 001
            </a>
          </div>
        ))}
      </section>
    </main>
  );
}