import { useState } from 'react';
import type { AppContract, Forfeit } from './lib/store';
import { useAppState } from './hooks/useAppState';
import Dashboard from './components/Dashboard';
import SetupFlow from './components/SetupFlow';
import BlockScreen from './components/BlockScreen';
import './App.css';

type Screen =
  | { kind: 'dashboard' }
  | { kind: 'setup' }
  | { kind: 'block'; contract: AppContract };

export default function App() {
  const state = useAppState();
  const [screen, setScreen] = useState<Screen>({ kind: 'dashboard' });

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
