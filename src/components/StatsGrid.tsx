interface Props {
  streak: number;
  hoursSaved: number;
  totalDonated: number;
  daysActive: number;
}

export default function StatsGrid({ streak, hoursSaved, totalDonated, daysActive }: Props) {
  return (
    <div className="stats-grid">
      <div className={`stat-card ${streak > 0 ? 'streak-glow' : ''}`}>
        <div className="stat-icon">🔥</div>
        <div className="stat-value mono">{streak}</div>
        <div className="stat-label">DAY STREAK</div>
      </div>
      <div className="stat-card">
        <div className="stat-icon">⏰</div>
        <div className="stat-value mono">{hoursSaved}</div>
        <div className="stat-label">HRS SAVED</div>
      </div>
      <div className="stat-card">
        <div className="stat-icon">💸</div>
        <div className="stat-value mono">${totalDonated}</div>
        <div className="stat-label">DONATED</div>
      </div>
      <div className="stat-card">
        <div className="stat-icon">📅</div>
        <div className="stat-value mono">{daysActive}</div>
        <div className="stat-label">DAYS ACTIVE</div>
      </div>
    </div>
  );
}
