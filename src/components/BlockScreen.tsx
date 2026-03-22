import { useState, useRef, useEffect } from 'react';
import type { AppContract, Forfeit, PaymentMethod } from '../lib/store';

interface Props {
  contract: AppContract;
  paymentMethod: PaymentMethod | null;
  streak: number;
  onStayFocused: () => void;
  onCharged: (forfeit: Forfeit) => void;
}

export default function BlockScreen({ contract, paymentMethod, streak, onStayFocused, onCharged }: Props) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [holdProgress, setHoldProgress] = useState(0);
  const [charged, setCharged] = useState(false);
  const holdInterval = useRef<ReturnType<typeof setInterval> | null>(null);
  const holdStart = useRef<number | null>(null);

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
        charity: contract.charity,
        amount: contract.bypassFee,
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
        <div className="confirm-amount">${contract.bypassFee}</div>
        <p className="confirm-label">will be donated to {contract.charityIcon} {contract.charity}</p>
        <div className="hold-btn-wrap">
          <button
            className="hold-btn"
            onMouseDown={startHold}
            onMouseUp={stopHold}
            onMouseLeave={stopHold}
            onTouchStart={startHold}
            onTouchEnd={stopHold}
          >
            <div
              className="hold-progress"
              style={{ width: `${holdProgress * 100}%` }}
            />
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

        <div className="forfeit-summary">
          <span className="forfeit-amount">${contract.bypassFee}</span>
          <span className="forfeit-arrow">→</span>
          <span className="forfeit-charity">{contract.charityIcon} {contract.charity}</span>
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
