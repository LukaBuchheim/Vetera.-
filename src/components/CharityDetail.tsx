import type { Charity } from '../lib/store';

interface Props {
  charity: Charity;
  committed: boolean;
  onCommit: () => void;
  onUncommit: () => void;
  onBack: () => void;
}

export default function CharityDetail({ charity, committed, onCommit, onUncommit, onBack }: Props) {
  return (
    <div className="charity-detail">
      <button className="charity-detail-back" onClick={onBack}>← Back</button>

      <div className="charity-detail-hero">
        <div className="charity-detail-icon">{charity.icon}</div>
        <div className="charity-detail-category">{charity.category}</div>
        <h2 className="charity-detail-name">{charity.name}</h2>
        <p className="charity-detail-tagline">{charity.tagline}</p>
      </div>

      <div className="charity-detail-body">
        <p className="charity-detail-desc">{charity.description}</p>

        <div className="charity-detail-section">
          <h3 className="charity-detail-section-title">Where your money goes</h3>
          <div className="charity-breakdown">
            {charity.whereMoneyGoes.map(item => (
              <div key={item.label} className="breakdown-row">
                <div className="breakdown-meta">
                  <span className="breakdown-label">{item.label}</span>
                  <span className="breakdown-pct">{item.percent}%</span>
                </div>
                <div className="breakdown-bar-track">
                  <div
                    className="breakdown-bar-fill"
                    style={{ width: `${item.percent}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="charity-impact-box">
          <div className="charity-impact-icon">💡</div>
          <p className="charity-impact-text">{charity.impact}</p>
        </div>
      </div>

      <div className="charity-detail-footer">
        {committed ? (
          <div className="charity-committed-actions">
            <div className="committed-badge-lg">✓ Committed</div>
            <button className="btn-uncommit" onClick={onUncommit}>Remove commitment</button>
          </div>
        ) : (
          <button className="btn-commit" onClick={onCommit}>
            Commit to {charity.name}
          </button>
        )}
      </div>
    </div>
  );
}
