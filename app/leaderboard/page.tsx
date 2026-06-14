import { getTranslations } from "@/lib/translations";

async function getLeaderboard() {
  const res = await fetch("http://localhost:3000/api/leaderboard", {
    cache: "no-store",
  });

  return res.json();
}

export default async function LeaderboardPage() {
  const t = getTranslations();

  const leaderboard = await getLeaderboard();

  return (
    <main
      style={{
        maxWidth: 700,
        margin: "60px auto",
        fontFamily: "sans-serif",
      }}
    >
      <h1>{t.leaderboard.title}</h1>

      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          marginTop: 24,
        }}
      >
        <thead>
          <tr>
            <th>{t.leaderboard.rank}</th>
            <th>{t.leaderboard.participant}</th>
            <th>{t.leaderboard.points}</th>
            <th>{t.leaderboard.stations}</th>
            <th>{t.leaderboard.quizzes}</th>
          </tr>
        </thead>

        <tbody>
          {leaderboard.map((p: any) => (
            <tr key={p.badgeId}>
              <td>{p.rank}</td>
              <td>{p.badgeId}</td>
              <td>{p.totalPoints}</td>
              <td>{p.stationsDone}</td>
              <td>{p.quizzesDone}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}