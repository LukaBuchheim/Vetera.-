import { CHARITIES } from '../lib/store';

interface Props {
  impactByCharity: Record<string, number>;
}

export default function ImpactSection({ impactByCharity }: Props) {
  const entries = Object.entries(impactByCharity).filter(([, v]) => v > 0);

  if (entries.length === 0) {
    return (
      <div className="impact-empty">
        <p>No donations yet — stay focused!</p>
      </div>
    );
  }

  return (
    <div className="impact-section">
      <h3 className="section-title">Your impact</h3>
      {entries.map(([name, amount]) => {
        const ch = CHARITIES.find(c => c.name === name);
        return (
          <div key={name} className="impact-card">
            <span className="impact-icon">{ch?.icon || '💛'}</span>
            <div className="impact-info">
              <div className="impact-name">{name}</div>
              <div className="impact-bar-wrap">
                <div
                  className="impact-bar"
                  style={{ width: `${Math.min((amount / 50) * 100, 100)}%` }}
                />
              </div>
            </div>
            <div className="impact-amount mono">${amount}</div>
          </div>
        );
      })}
    </div>
  );
}
