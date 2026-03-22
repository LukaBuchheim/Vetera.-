import type { AppContract } from '../lib/store';

const DAY_ORDER = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

function formatTime(t: string): string {
  const [h, m] = t.split(':').map(Number);
  const period = h >= 12 ? 'pm' : 'am';
  const hour = h % 12 || 12;
  return `${hour}:${m.toString().padStart(2, '0')}${period}`;
}

interface Props {
  contract: AppContract;
  onToggle: () => void;
  onRemove: () => void;
  onBypass: () => void;
}

export default function ContractCard({ contract, onToggle, onRemove, onBypass }: Props) {
  const displayedSchedules = contract.schedules.slice(0, 2);
  const extraCount = contract.schedules.length - 2;

  return (
    <div className={`contract-card ${contract.active ? 'active' : 'inactive'}`}>
      <div className="contract-header">
        <div className="contract-app-info">
          <span className="contract-icon">{contract.appIcon}</span>
          <div>
            <div className="contract-name">{contract.appName}</div>
            <div className="contract-charity">{contract.charityIcon} {contract.charity} · ${contract.bypassFee}/bypass</div>
          </div>
        </div>
        <div className="contract-controls">
          <button
            className={`toggle-btn ${contract.active ? 'on' : 'off'}`}
            onClick={onToggle}
            aria-label={contract.active ? 'Disable' : 'Enable'}
          >
            {contract.active ? 'ON' : 'OFF'}
          </button>
        </div>
      </div>

      <div className="contract-schedules">
        {displayedSchedules.map(sched => (
          <div key={sched.id} className="schedule-row">
            <span className="schedule-time">
              {formatTime(sched.start)} – {formatTime(sched.end)}
            </span>
            <div className="schedule-days">
              {DAY_ORDER.map(day => (
                <span
                  key={day}
                  className={`day-dot ${(sched.days as string[]).includes(day) ? 'filled' : ''}`}
                >
                  {day[0]}
                </span>
              ))}
            </div>
          </div>
        ))}
        {extraCount > 0 && (
          <div className="more-schedules">+{extraCount} more</div>
        )}
      </div>

      <div className="contract-footer">
        <button className="btn-bypass-sm" onClick={onBypass}>Bypass now</button>
        <button className="btn-remove" onClick={onRemove}>Remove</button>
      </div>
    </div>
  );
}
