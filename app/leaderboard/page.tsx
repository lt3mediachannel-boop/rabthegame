import { getTranslations } from "@/lib/translations";

async function getLeaderboard() {
  const res = await fetch("http://localhost:3000/api/leaderboard", {
    cache: "no-store",
  });

  return res.json();
}

function medal(rank: number) {
  if (rank === 1) return "🥇";
  if (rank === 2) return "🥈";
  if (rank === 3) return "🥉";
  return `#${rank}`;
}

export default async function LeaderboardPage() {
  const t = getTranslations();
  const leaderboard = await getLeaderboard();

  const topThree = leaderboard.slice(0, 3);
  const rest = leaderboard.slice(3);
  const maxPoints = leaderboard[0]?.totalPoints || 1;

  return (
    <main className="leaderboard-page">
      <section className="leaderboard-hero">
        <div className="hero-badge">🏆 Live Ranking</div>
        <h1>{t.leaderboard.title}</h1>
        <p>
          Follow the ranking in real time and see who is leading the challenge.
        </p>
      </section>

      {topThree.length > 0 && (
        <section className="podium-grid">
          {topThree.map((p: any) => (
            <article
              key={p.badgeId}
              className={`podium-card rank-${p.rank}`}
            >
              <div className="podium-medal">{medal(p.rank)}</div>
              <div className="podium-avatar">{p.badgeId}</div>
              <strong>{t.leaderboard.participant} {p.badgeId}</strong>
              <span>{p.totalPoints} {t.leaderboard.points.toLowerCase()}</span>
            </article>
          ))}
        </section>
      )}

      <section className="leaderboard-list">
        {rest.length === 0 && leaderboard.length <= 3 ? null : (
          <h2>Full Ranking</h2>
        )}

        {rest.map((p: any) => {
          const progress = Math.round((p.totalPoints / maxPoints) * 100);

          return (
            <article key={p.badgeId} className="leaderboard-row">
              <div className="leaderboard-rank">{medal(p.rank)}</div>

              <div className="leaderboard-user">
                <strong>
                  {t.leaderboard.participant} {p.badgeId}
                </strong>
                <span>
                  {p.stationsDone} {t.leaderboard.stations.toLowerCase()} ·{" "}
                  {p.quizzesDone} {t.leaderboard.quizzes.toLowerCase()}
                </span>

                <div className="leaderboard-progress">
                  <div style={{ width: `${progress}%` }} />
                </div>
              </div>

              <div className="leaderboard-points">
                {p.totalPoints}
              </div>
            </article>
          );
        })}

        {leaderboard.length === 0 && (
          <div className="empty-card">
            No participants yet.
          </div>
        )}
      </section>
    </main>
  );
}