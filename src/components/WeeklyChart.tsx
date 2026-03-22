interface Props {
  weeklyActivity: { date: string; amount: number }[];
}

export default function WeeklyChart({ weeklyActivity }: Props) {
  const max = Math.max(...weeklyActivity.map(d => d.amount), 1);

  return (
    <div className="weekly-chart">
      <h3 className="section-title">This week</h3>
      <div className="chart-bars">
        {weeklyActivity.map(({ date, amount }) => {
          const d = new Date(date + 'T12:00:00');
          const label = d.toLocaleDateString('en-US', { weekday: 'short' }).slice(0, 1);
          const height = Math.max((amount / max) * 100, amount > 0 ? 8 : 0);
          return (
            <div key={date} className="chart-bar-col">
              <div className="chart-bar-track">
                <div
                  className="chart-bar-fill"
                  style={{ height: `${height}%` }}
                />
              </div>
              <div className="chart-bar-label">{label}</div>
              {amount > 0 && <div className="chart-bar-amount">${amount}</div>}
            </div>
          );
        })}
      </div>
    </div>
  );
}
