import { useState } from 'react';
import { APPS } from '../lib/store';

interface Props {
  onContinue: (selectedApps: string[]) => void;
}

export default function OnboardingApps({ onContinue }: Props) {
  const [selected, setSelected] = useState<string[]>([]);

  const toggle = (name: string) => {
    setSelected(prev =>
      prev.includes(name) ? prev.filter(a => a !== name) : [...prev, name]
    );
  };

  return (
    <div className="onboarding-screen">
      <div className="onboarding-top">
        <div className="onboarding-step-label">Step 1 of 2</div>
        <h2 className="onboarding-title">Which apps distract you most?</h2>
        <p className="onboarding-sub">Select every app you want Vetera to block during your focus hours.</p>
      </div>

      <div className="onboarding-app-grid">
        {APPS.map(app => (
          <button
            key={app.name}
            className={`onboarding-app-tile ${selected.includes(app.name) ? 'selected' : ''}`}
            onClick={() => toggle(app.name)}
          >
            <span className="onboarding-app-icon">{app.icon}</span>
            <span className="onboarding-app-name">{app.name}</span>
            {selected.includes(app.name) && (
              <span className="onboarding-check">✓</span>
            )}
          </button>
        ))}
      </div>

      <div className="onboarding-footer">
        {selected.length > 0 && (
          <p className="onboarding-selection-count">{selected.length} app{selected.length !== 1 ? 's' : ''} selected</p>
        )}
        <button
          className="btn-primary onboarding-btn"
          disabled={selected.length === 0}
          onClick={() => onContinue(selected)}
        >
          Continue →
        </button>
      </div>
    </div>
  );
}
