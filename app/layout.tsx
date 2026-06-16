import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="it">
      <body>
        <div className="app-shell">
          <header className="header">
            <a href="/" className="logo">
              <div className="logo-icon">🎮</div>
              RAB<span>Skills Challenge</span>
            </a>

            <nav className="header-nav">
{/*               <a className="nav-btn" href="/">🏠 Home</a>
              <a className="nav-btn" href="/leaderboard">🏆 Classifica</a>
              <a className="nav-btn" href="/admin">⚙️ Admin</a> */}
            </nav>
          </header>

          {children}
        </div>
      </body>
    </html>
  );
}