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
      <main style={{ maxWidth: 600, margin: "60px auto", fontFamily: "sans-serif" }}>
        <h1>{t.player.participantNotFound}</h1>
        <p>{t.player.participantNotFoundText}</p>
      </main>
    );
  }

  return (
    <main style={{ maxWidth: 700, margin: "60px auto", fontFamily: "sans-serif" }}>
      <h1>{t.player.title}</h1>

      <div style={{ padding: 24, border: "1px solid #ddd", borderRadius: 12, marginTop: 24 }}>
        <h2>
          {t.player.badgeId}: {player.badgeId}
        </h2>

        <p style={{ fontSize: 32, fontWeight: 700 }}>
          {player.totalPoints} {t.leaderboard.points.toLowerCase()}
        </p>
      </div>

      <h2 style={{ marginTop: 40 }}>{t.player.stations}</h2>

      <div style={{ display: "grid", gap: 12, marginTop: 16 }}>
        {player.stations.map((station: any) => (
          <div
            key={station.id}
            style={{
              padding: 18,
              border: "1px solid #ddd",
              borderRadius: 12,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <strong>{station.name}</strong>

              <div>
                {station.points} {t.leaderboard.points.toLowerCase()}
              </div>

              {!station.completed && (
                <a
                  href={`/station/${station.slug}`}
                  style={{ display: "inline-block", marginTop: 8 }}
                >
                  {t.player.goToStation}
                </a>
              )}
            </div>

            <div style={{ fontSize: 22 }}>
              {station.completed ? "✅" : "⭕"}
            </div>
          </div>
        ))}
      </div>

      <h2 style={{ marginTop: 40 }}>{t.player.quizzes}</h2>

      {player.quizzes.length === 0 ? (
        <p>{t.player.noQuizCompleted}</p>
      ) : (
        <div style={{ display: "grid", gap: 12, marginTop: 16 }}>
          {player.quizzes.map((quiz: any, index: number) => (
            <div
              key={index}
              style={{
                padding: 18,
                border: "1px solid #ddd",
                borderRadius: 12,
              }}
            >
              <strong>{quiz.quizTitle}</strong>
              <div>
                {t.player.score}: {quiz.score}
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}