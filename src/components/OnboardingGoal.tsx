import { useState } from 'react';
import { GOALS } from '../lib/store';

interface Props {
  onComplete: (goals: string[]) => void;
}

export default function OnboardingGoal({ onComplete }: Props) {
  const [selected, setSelected] = useState<string[]>([]);

  const toggle = (id: string) => {
    setSelected(prev =>
      prev.includes(id) ? prev.filter(g => g !== id) : [...prev, id]
    );
  };

  return (
    <div className="onboarding-screen">
      <div className="onboarding-top">
        <div className="onboarding-step-label">Step 2 of 2</div>
        <h2 className="onboarding-title">What are your goals?</h2>
        <p className="onboarding-sub">Pick as many as you like — this helps us personalise your experience.</p>
      </div>

      <div className="goal-list">
        {GOALS.map(goal => (
          <button
            key={goal.id}
            className={`goal-card ${selected.includes(goal.id) ? 'selected' : ''}`}
            onClick={() => toggle(goal.id)}
          >
            <span className="goal-icon">{goal.icon}</span>
            <div className="goal-text">
              <div className="goal-label">{goal.label}</div>
              <div className="goal-sub">{goal.sub}</div>
            </div>
            <div className={`goal-radio ${selected.includes(goal.id) ? 'checked' : ''}`} />
          </button>
        ))}
      </div>

      <div className="onboarding-footer">
        {selected.length > 0 && (
          <p className="onboarding-selection-count">{selected.length} goal{selected.length !== 1 ? 's' : ''} selected</p>
        )}
        <button
          className="btn-primary onboarding-btn"
          disabled={selected.length === 0}
          onClick={() => onComplete(selected)}
        >
          Let's go →
        </button>
      </div>
    </div>
  );
}
