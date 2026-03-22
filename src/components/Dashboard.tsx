import { useState } from 'react';
import type { AppContract, Forfeit, PaymentMethod } from '../lib/store';
import StatsGrid from './StatsGrid';
import ImpactSection from './ImpactSection';
import WeeklyChart from './WeeklyChart';
import BottomNav from './BottomNav';
import ContractCard from './ContractCard';
import CharitiesTab from './CharitiesTab';

type Tab = 'overview' | 'contracts' | 'history' | 'charities';

interface Props {
  contracts: AppContract[];
  forfeits: Forfeit[];
  paymentMethod: PaymentMethod | null;
  committedCharities: string[];
  streak: number;
  hoursSaved: number;
  totalDonated: number;
  daysActive: number;
  impactByCharity: Record<string, number>;
  weeklyActivity: { date: string; amount: number }[];
  onToggleContract: (id: string) => void;
  onRemoveContract: (id: string) => void;
  onBypassContract: (contract: AppContract) => void;
  onNewContract: () => void;
  onCommitCharity: (id: string) => void;
  onUncommitCharity: (id: string) => void;
}

export default function Dashboard({
  contracts, forfeits, paymentMethod, committedCharities,
  streak, hoursSaved, totalDonated, daysActive,
  impactByCharity, weeklyActivity,
  onToggleContract, onRemoveContract, onBypassContract, onNewContract,
  onCommitCharity, onUncommitCharity,
}: Props) {
  const [tab, setTab] = useState<Tab>('overview');

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="logo-mark">V</div>
        <div>
          <div className="brand-name">Vetera</div>
          <div className="brand-tagline">Your focus, backed by real stakes.</div>
        </div>
        {paymentMethod && (
          <div className="payment-badge">
            {paymentMethod.brand} ••••{paymentMethod.last4}
          </div>
        )}
      </header>

      <div className="dashboard-content">
        {tab === 'overview' && (
          <div className="tab-overview">
            <StatsGrid
              streak={streak}
              hoursSaved={hoursSaved}
              totalDonated={totalDonated}
              daysActive={daysActive}
            />
            <ImpactSection impactByCharity={impactByCharity} />
            <WeeklyChart weeklyActivity={weeklyActivity} />
          </div>
        )}

        {tab === 'contracts' && (
          <div className="tab-contracts">
            {contracts.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">🔒</div>
                <h3>No contracts yet</h3>
                <p>Create your first contract to start building focus habits.</p>
                <button className="btn-primary" onClick={onNewContract}>+ New Contract</button>
              </div>
            ) : (
              <>
                {contracts.map(c => (
                  <ContractCard
                    key={c.id}
                    contract={c}
                    onToggle={() => onToggleContract(c.id)}
                    onRemove={() => onRemoveContract(c.id)}
                    onBypass={() => onBypassContract(c)}
                  />
                ))}
              </>
            )}
            {contracts.length > 0 && (
              <button className="fab" onClick={onNewContract}>+</button>
            )}
          </div>
        )}

        {tab === 'charities' && (
          <CharitiesTab
            committedCharities={committedCharities}
            onCommit={onCommitCharity}
            onUncommit={onUncommitCharity}
          />
        )}

        {tab === 'history' && (
          <div className="tab-history">
            {forfeits.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">🎉</div>
                <h3>No forfeits yet</h3>
                <p>You're doing great — no bypasses recorded.</p>
              </div>
            ) : (
              <div className="forfeit-list">
                {[...forfeits].reverse().map(f => (
                  <div key={f.id} className="forfeit-item">
                    <div className="forfeit-meta">
                      <span className="forfeit-app">{f.appName}</span>
                      <span className="forfeit-time">{new Date(f.timestamp).toLocaleString()}</span>
                    </div>
                    <div className="forfeit-detail">
                      <span>{f.charityIcon} {f.charity}</span>
                      <span className="forfeit-amt mono">${f.amount}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <BottomNav activeTab={tab} onChange={setTab} />
    </div>
  );
}
