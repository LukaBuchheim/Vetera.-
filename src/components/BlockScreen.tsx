import { useState, useRef, useEffect } from 'react';
import type { AppContract, Forfeit, PaymentMethod } from '../lib/store';
import { CHARITIES } from '../lib/store';

interface Props {
  contract: AppContract;
  paymentMethod: PaymentMethod | null;
  streak: number;
  committedCharities: string[];
  onStayFocused: () => void;
  onCharged: (forfeit: Forfeit) => void;
}

export default function BlockScreen({ contract, paymentMethod, streak, committedCharities, onStayFocused, onCharged }: Props) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [holdProgress, setHoldProgress] = useState(0);
  const [charged, setCharged] = useState(false);
  const holdInterval = useRef<ReturnType<typeof setInterval> | null>(null);
  const holdStart = useRef<number | null>(null);

  // Resolve which charities are available to pick from
  const availableCharities = committedCharities.length > 0
    ? CHARITIES.filter(c => committedCharities.includes(c.id))
    : CHARITIES.filter(c => c.name === contract.charity);

  const defaultCharity = availableCharities.find(c => c.name === contract.charity)
    ?? availableCharities[0]
    ?? CHARITIES[0];

  const [selectedCharityId, setSelectedCharityId] = useState(defaultCharity.id);
  const [showCharityPicker, setShowCharityPicker] = useState(false);
  const [donationAmount, setDonationAmount] = useState(contract.bypassFee);

  const selectedCharity = CHARITIES.find(c => c.id === selectedCharityId) ?? defaultCharity;

  useEffect(() => {
    return () => { if (holdInterval.current) clearInterval(holdInterval.current); };
  }, []);

  const startHold = () => {
    holdStart.current = Date.now();
    holdInterval.current = setInterval(() => {
      const elapsed = Date.now() - (holdStart.current || 0);
      const progress = Math.min(elapsed / 3000, 1);
      setHoldProgress(progress);
      if (progress >= 1) {
        clearInterval(holdInterval.current!);
        setStep(3);
        handleCharge();
      }
    }, 50);
  };

  const stopHold = () => {
    if (holdInterval.current) clearInterval(holdInterval.current);
    setHoldProgress(0);
    holdStart.current = null;
  };

  const handleCharge = () => {
    setTimeout(() => {
      setCharged(true);
      const forfeit: Forfeit = {
        id: crypto.randomUUID(),
        contractId: contract.id,
        appName: contract.appName,
        charity: selectedCharity.name,
        charityIcon: selectedCharity.icon,
        amount: donationAmount,
        timestamp: new Date().toISOString(),
      };
      setTimeout(() => {
        onCharged(forfeit);
      }, 1200);
    }, 1000);
  };

  const cardInfo = paymentMethod
    ? `Charged to ${paymentMethod.brand} ••••${paymentMethod.last4}`
    : 'No payment method saved';

  // Step 3: Charging
  if (step === 3) {
    return (
      <div className="block-screen block-charging">
        <div className="charging-content">
          {charged ? (
            <>
              <div className="charged-check">✓</div>
              <p className="charged-label">Charged</p>
            </>
          ) : (
            <div className="charging-spinner" />
          )}
        </div>
      </div>
    );
  }

  // Step 2: Confirm
  if (step === 2) {
    return (
      <div className="block-screen block-confirm">
        <button className="back-btn" onClick={() => setStep(1)}>← Back</button>
        <div className="confirm-amount">${donationAmount % 1 === 0 ? donationAmount : donationAmount.toFixed(2)}</div>
        <p className="confirm-label">will be donated to {selectedCharity.icon} {selectedCharity.name}</p>
        <div className="hold-btn-wrap">
          <button
            className="hold-btn"
            onMouseDown={startHold}
            onMouseUp={stopHold}
            onMouseLeave={stopHold}
            onTouchStart={startHold}
            onTouchEnd={stopHold}
          >
            <div className="hold-progress" style={{ width: `${holdProgress * 100}%` }} />
            <span className="hold-label">Hold to confirm</span>
          </button>
          <p className="hold-hint">Hold for 3 seconds to charge</p>
        </div>
      </div>
    );
  }

  // Step 1: Warning
  return (
    <div className="block-screen block-warning">
      <div className="warning-content">
        <div className="block-app-icon">{contract.appIcon}</div>
        <h2 className="block-app-name">{contract.appName} is blocked</h2>

        {streak > 0 && (
          <div className="streak-warning">
            🔥 Breaking your {streak}-day streak
          </div>
        )}

        <div className="bypass-amount-row">
          <span className="bypass-amount-label">Donation amount</span>
          <span className="bypass-amount-value">
            ${donationAmount % 1 === 0 ? donationAmount : donationAmount.toFixed(2)}
          </span>
        </div>
        <div className="bypass-slider-wrap">
          <input
            type="range"
            className="bypass-slider"
            min={0.50}
            max={1000}
            step={0.50}
            value={donationAmount}
            onChange={e => setDonationAmount(parseFloat(e.target.value))}
          />
          <div className="bypass-slider-labels">
            <span>$0.50</span>
            <span>$1,000</span>
          </div>
        </div>

        <div className="forfeit-summary">
          <span className="forfeit-arrow" style={{ fontSize: 14 }}>goes to</span>
          <div className="forfeit-charity-wrap">
            <button
              className={`forfeit-charity-btn ${availableCharities.length > 1 ? 'pickable' : ''}`}
              onClick={() => availableCharities.length > 1 && setShowCharityPicker(p => !p)}
            >
              {selectedCharity.icon} {selectedCharity.name}
              {availableCharities.length > 1 && <span className="charity-chevron">{showCharityPicker ? '▲' : '▼'}</span>}
            </button>

            {showCharityPicker && availableCharities.length > 1 && (
              <div className="charity-picker-dropdown">
                {availableCharities.map(c => (
                  <button
                    key={c.id}
                    className={`charity-picker-option ${c.id === selectedCharityId ? 'active' : ''}`}
                    onClick={() => { setSelectedCharityId(c.id); setShowCharityPicker(false); }}
                  >
                    <span>{c.icon}</span>
                    <span>{c.name}</span>
                    {c.id === selectedCharityId && <span className="option-check">✓</span>}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <p className="card-info">{cardInfo}</p>
      </div>

      <div className="warning-actions">
        <button className="btn-stay" onClick={onStayFocused}>Stay focused</button>
        <button className="btn-continue" onClick={() => setStep(2)}>
          I still want to continue →
        </button>
      </div>
    </div>
  );
}
