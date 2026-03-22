import { useState } from 'react';
import type { AppContract, Forfeit } from './lib/store';
import { APPS, CHARITIES } from './lib/store';
import { useAppState } from './hooks/useAppState';
import LandingScreen from './components/LandingScreen';
import OnboardingApps from './components/OnboardingApps';
import OnboardingGoal from './components/OnboardingGoal';
import Dashboard from './components/Dashboard';
import SetupFlow from './components/SetupFlow';
import BlockScreen from './components/BlockScreen';
import './App.css';

type OnboardStep = 'landing' | 'apps' | 'goal';

type Screen =
  | { kind: 'dashboard' }
  | { kind: 'setup' }
  | { kind: 'block'; contract: AppContract };

export default function App() {
  const state = useAppState();
  const [screen, setScreen] = useState<Screen>({ kind: 'dashboard' });
  const [onboardStep, setOnboardStep] = useState<OnboardStep>('landing');
  const [pendingApps, setPendingApps] = useState<string[]>([]);

  // ── Onboarding ──────────────────────────────────────────────
  if (!state.onboarded) {
    if (onboardStep === 'landing') {
      return (
        <div className="app-shell">
          <LandingScreen
            onGoogle={() => setOnboardStep('apps')}
            onEmail={() => setOnboardStep('apps')}
          />
        </div>
      );
    }

    if (onboardStep === 'apps') {
      return (
        <div className="app-shell">
          <OnboardingApps
            onContinue={(apps) => {
              setPendingApps(apps);
              setOnboardStep('goal');
            }}
          />
        </div>
      );
    }

    if (onboardStep === 'goal') {
      return (
        <div className="app-shell">
          <OnboardingGoal
            onComplete={(goal) => {
              // Create a default contract for each selected app
              const defaultCharity = CHARITIES[0];
              for (const appName of pendingApps) {
                const appObj = APPS.find(a => a.name === appName);
                const contract: AppContract = {
                  id: crypto.randomUUID(),
                  appName,
                  appIcon: appObj?.icon || '📱',
                  bypassFee: 5,
                  charity: defaultCharity.name,
                  charityIcon: defaultCharity.icon,
                  schedules: [{
                    id: crypto.randomUUID(),
                    start: '09:00',
                    end: '17:00',
                    days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
                  }],
                  active: true,
                  createdAt: new Date().toISOString(),
                };
                state.addContract(contract);
              }
              state.completeOnboarding('', goal);
            }}
          />
        </div>
      );
    }
  }

  // ── Main app ────────────────────────────────────────────────
  const handleNewContract = () => setScreen({ kind: 'setup' });

  const handleSetupComplete = (contract: AppContract) => {
    state.addContract(contract);
    setScreen({ kind: 'dashboard' });
  };

  const handleBypass = (contract: AppContract) => {
    setScreen({ kind: 'block', contract });
  };

  const handleCharged = (forfeit: Forfeit) => {
    state.addForfeit(forfeit);
    setScreen({ kind: 'dashboard' });
  };

  return (
    <div className="app-shell">
      {screen.kind === 'dashboard' && (
        <Dashboard
          contracts={state.contracts}
          forfeits={state.forfeits}
          paymentMethod={state.paymentMethod}
          streak={state.streak}
          hoursSaved={state.hoursSaved}
          totalDonated={state.totalDonated}
          daysActive={state.daysActive}
          impactByCharity={state.impactByCharity}
          weeklyActivity={state.weeklyActivity}
          onToggleContract={state.toggleContract}
          onRemoveContract={state.removeContract}
          onBypassContract={handleBypass}
          onNewContract={handleNewContract}
        />
      )}
      {screen.kind === 'setup' && (
        <SetupFlow
          onComplete={handleSetupComplete}
          onCancel={() => setScreen({ kind: 'dashboard' })}
          existingPaymentMethod={state.paymentMethod}
          onSavePaymentMethod={state.setPaymentMethod}
        />
      )}
      {screen.kind === 'block' && (
        <BlockScreen
          contract={screen.contract}
          paymentMethod={state.paymentMethod}
          streak={state.streak}
          onStayFocused={() => setScreen({ kind: 'dashboard' })}
          onCharged={handleCharged}
        />
      )}
    </div>
  );
}
