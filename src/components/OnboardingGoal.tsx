import { useState } from 'react';
import { GOALS } from '../lib/store';

interface Props {
  onComplete: (goal: string) => void;
}

export default function OnboardingGoal({ onComplete }: Props) {
  const [selected, setSelected] = useState('');

  return (
    <div className="onboarding-screen">
      <div className="onboarding-top">
        <div className="onboarding-step-label">Step 2 of 2</div>
        <h2 className="onboarding-title">What's your main goal?</h2>
        <p className="onboarding-sub">This helps us personalise your experience.</p>
      </div>

      <div className="goal-list">
        {GOALS.map(goal => (
          <button
            key={goal.id}
            className={`goal-card ${selected === goal.id ? 'selected' : ''}`}
            onClick={() => setSelected(goal.id)}
          >
            <span className="goal-icon">{goal.icon}</span>
            <div className="goal-text">
              <div className="goal-label">{goal.label}</div>
              <div className="goal-sub">{goal.sub}</div>
            </div>
            <div className={`goal-radio ${selected === goal.id ? 'checked' : ''}`} />
          </button>
        ))}
      </div>

      <div className="onboarding-footer">
        <button
          className="btn-primary onboarding-btn"
          disabled={!selected}
          onClick={() => onComplete(selected)}
        >
          Let's go →
        </button>
      </div>
    </div>
  );
}
