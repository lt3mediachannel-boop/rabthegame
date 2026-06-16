import { getTranslations } from "@/lib/translations";

async function getPlayer(code: string) {
  const res = await fetch(`http://localhost:3000/api/player/${code}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    return null;
  }

  return res.json();
}

export default async function PlayerPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const t = getTranslations();
  const { code } = await params;
  const player = await getPlayer(code);

  if (!player) {
    return (
      <main className="player-page">
        <section className="player-card">
          <h1>{t.player.participantNotFound}</h1>
          <p>{t.player.participantNotFoundText}</p>
        </section>
      </main>
    );
  }

  return (
    <main className="player-page">
      <section className="player-hero">
        <div className="robot-wrap" aria-hidden="true">
          <div className="robot">
            <div className="robot-antenna" />
            <div className="robot-head">
              <div className="robot-eye" />
              <div className="robot-eye" />
            </div>
            <div className="robot-body">
              <div className="robot-light" />
            </div>
          </div>
        </div>

        <div className="player-info-block">
          <div className="player-badge">Participant #{player.badgeId}</div>

          <h1>{t.player.title}</h1>

          <p className="player-subtitle">
            Complete challenges, answer quizzes and climb the leaderboard.
          </p>
        </div>
      </section>

      <section className="stats-grid-player">
        <div className="stat-box primary">
          <span className="stat-label">{t.player.badgeId}</span>
          <strong>{player.badgeId}</strong>
        </div>

        <div className="stat-box gold">
          <span className="stat-label">{t.player.totalPoints}</span>
          <strong>
            {player.totalPoints} {t.leaderboard.points.toLowerCase()}
          </strong>
        </div>

        <div className="stat-box cyan">
          <span className="stat-label">{t.player.quizzes}</span>
          <strong>{player.quizzes.length}</strong>
        </div>
      </section>

      <section className="player-section">
        <h2>{t.player.quizzes}</h2>

        {player.quizzes.length === 0 ? (
          <div className="empty-card">
            <p>{t.player.noQuizCompleted}</p>
          </div>
        ) : (
          <div className="quiz-list">
            {player.quizzes.map((quiz: any, index: number) => (
              <article className="quiz-card" key={index}>
                <div>
                  <strong>{quiz.quizTitle}</strong>
                  <p>
                    {t.player.score}: {quiz.score}
                  </p>
                </div>

                <span className="status-pill">Completed</span>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}