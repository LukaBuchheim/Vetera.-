import { useState } from 'react';
import type { AppContract, SchedulePeriod, PaymentMethod } from '../lib/store';
import { APPS, CHARITIES } from '../lib/store';

interface Props {
  onComplete: (contract: AppContract) => void;
  onCancel: () => void;
  existingPaymentMethod: PaymentMethod | null;
  onSavePaymentMethod: (pm: PaymentMethod) => void;
  committedCharities: string[];
}

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] as const;
type Day = typeof DAYS[number];

function detectBrand(cardNum: string): PaymentMethod['brand'] {
  const first = cardNum[0];
  if (first === '4') return 'Visa';
  if (first === '5') return 'Mastercard';
  if (first === '3') return 'Amex';
  if (first === '6') return 'Discover';
  return 'Unknown';
}

function formatCardNumber(raw: string): string {
  const digits = raw.replace(/\D/g, '').slice(0, 16);
  return digits.replace(/(.{4})/g, '$1 ').trim();
}

export default function SetupFlow({ onComplete, onCancel, existingPaymentMethod, onSavePaymentMethod, committedCharities }: Props) {
  const [step, setStep] = useState(1);

  // Step 1 — app selection
  const [selectedApps, setSelectedApps] = useState<string[]>([]);

  // Step 2 — schedules
  const [schedules, setSchedules] = useState<SchedulePeriod[]>([
    { id: crypto.randomUUID(), start: '09:00', end: '17:00', days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'] },
  ]);

  // Step 3 — bypass fee
  const [bypassFee, setBypassFee] = useState(5);

  // Step 4 — payment method
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardName, setCardName] = useState('');
  const [skipPayment, setSkipPayment] = useState(false);

  // Step 5 — charity
  const [charity, setCharity] = useState('');
  const [charityIcon, setCharityIcon] = useState('');

  const toggleApp = (name: string) => {
    setSelectedApps(prev =>
      prev.includes(name) ? prev.filter(a => a !== name) : [...prev, name]
    );
  };

  const toggleDay = (scheduleId: string, day: Day) => {
    setSchedules(prev =>
      prev.map(s => {
        if (s.id !== scheduleId) return s;
        const days = s.days.includes(day)
          ? s.days.filter(d => d !== day)
          : [...s.days, day];
        return { ...s, days } as SchedulePeriod;
      })
    );
  };

  const updateSchedule = (id: string, field: 'start' | 'end', value: string) => {
    setSchedules(prev =>
      prev.map(s => s.id === id ? { ...s, [field]: value } : s)
    );
  };

  const addSchedule = () => {
    setSchedules(prev => [
      ...prev,
      { id: crypto.randomUUID(), start: '09:00', end: '17:00', days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'] },
    ]);
  };

  const removeSchedule = (id: string) => {
    setSchedules(prev => prev.filter(s => s.id !== id));
  };

  const handleFinish = () => {
    if (!charity) return;
    const primaryApp = selectedApps[0] || 'Unknown';
    const appObj = APPS.find(a => a.name === primaryApp);

    // Save payment if entered
    if (!skipPayment && cardNumber.replace(/\s/g, '').length >= 4) {
      const digits = cardNumber.replace(/\s/g, '');
      onSavePaymentMethod({
        last4: digits.slice(-4),
        brand: detectBrand(digits),
        expiryMonth: expiry.split('/')[0] || '',
        expiryYear: expiry.split('/')[1] || '',
        name: cardName,
      });
    }

    const contract: AppContract = {
      id: crypto.randomUUID(),
      appName: primaryApp,
      appIcon: appObj?.icon || '📱',
      bypassFee,
      charity,
      charityIcon,
      schedules,
      active: true,
      createdAt: new Date().toISOString(),
    };
    onComplete(contract);
  };

  return (
    <div className="setup-flow">
      {/* Progress */}
      <div className="setup-progress">
        {[1, 2, 3, 4, 5].map(n => (
          <div key={n} className={`step-dot ${n === step ? 'active' : n < step ? 'done' : ''}`} />
        ))}
      </div>

      {/* Step 1: Select apps */}
      {step === 1 && (
        <div className="setup-step">
          <h2>Select apps to block</h2>
          <p className="step-sub">Choose which apps you want to limit.</p>
          <div className="app-grid">
            {APPS.map(app => (
              <button
                key={app.name}
                className={`app-pill ${selectedApps.includes(app.name) ? 'selected' : ''}`}
                onClick={() => toggleApp(app.name)}
              >
                <span className="app-icon">{app.icon}</span>
                <span>{app.name}</span>
              </button>
            ))}
          </div>
          <div className="step-actions">
            <button className="btn-ghost" onClick={onCancel}>Cancel</button>
            <button className="btn-primary" disabled={selectedApps.length === 0} onClick={() => setStep(2)}>
              Next →
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Schedule */}
      {step === 2 && (
        <div className="setup-step">
          <h2>Set your schedule</h2>
          <p className="step-sub">When should blocking be active?</p>
          <div className="schedules-list">
            {schedules.map(sched => (
              <div key={sched.id} className="schedule-card">
                <div className="schedule-times">
                  <div className="time-picker">
                    <label>From</label>
                    <input type="time" value={sched.start} onChange={e => updateSchedule(sched.id, 'start', e.target.value)} />
                  </div>
                  <span className="time-sep">–</span>
                  <div className="time-picker">
                    <label>To</label>
                    <input type="time" value={sched.end} onChange={e => updateSchedule(sched.id, 'end', e.target.value)} />
                  </div>
                  {schedules.length > 1 && (
                    <button className="btn-icon-sm trash" onClick={() => removeSchedule(sched.id)} aria-label="Remove">
                      🗑
                    </button>
                  )}
                </div>
                <div className="day-pills">
                  {DAYS.map(day => (
                    <button
                      key={day}
                      className={`day-pill ${sched.days.includes(day) ? 'selected' : ''}`}
                      onClick={() => toggleDay(sched.id, day)}
                    >
                      {day[0]}
                    </button>
                  ))}
                </div>
              </div>
            ))}
            <button className="btn-add-window" onClick={addSchedule}>+ Add time window</button>
          </div>
          <div className="step-actions">
            <button className="btn-ghost" onClick={() => setStep(1)}>← Back</button>
            <button className="btn-primary" disabled={schedules.length === 0 || schedules.some(s => s.days.length === 0 || s.start >= s.end)} onClick={() => setStep(3)}>
              Next →
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Bypass fee */}
      {step === 3 && (
        <div className="setup-step">
          <h2>Set bypass fee</h2>
          <p className="step-sub">How much will bypassing cost you?</p>
          <div className="fee-options">
            {[1, 2, 5, 10, 20].map(amt => (
              <button
                key={amt}
                className={`fee-pill ${bypassFee === amt ? 'selected' : ''}`}
                onClick={() => setBypassFee(amt)}
              >
                ${amt}
              </button>
            ))}
          </div>
          <div className="custom-fee">
            <label>Custom amount ($)</label>
            <input
              type="number"
              min={1}
              value={bypassFee}
              onChange={e => setBypassFee(Math.max(1, Number(e.target.value)))}
            />
          </div>
          <div className="step-actions">
            <button className="btn-ghost" onClick={() => setStep(2)}>← Back</button>
            <button className="btn-primary" onClick={() => setStep(4)}>Next →</button>
          </div>
        </div>
      )}

      {/* Step 4: Payment method */}
      {step === 4 && (
        <div className="setup-step">
          <h2>Payment method</h2>
          <p className="step-sub">Used only when you bypass a block.</p>
          {existingPaymentMethod ? (
            <div className="existing-card">
              <div className="card-badge">
                <span>{existingPaymentMethod.brand}</span>
                <span>••••{existingPaymentMethod.last4}</span>
              </div>
              <p className="card-holder">{existingPaymentMethod.name}</p>
            </div>
          ) : !skipPayment ? (
            <div className="card-form">
              <div className="card-number-field">
                <label>Card number</label>
                <div className="card-input-wrap">
                  <input
                    type="text"
                    placeholder="1234 5678 9012 3456"
                    value={cardNumber}
                    maxLength={19}
                    onChange={e => setCardNumber(formatCardNumber(e.target.value))}
                  />
                  {cardNumber && (
                    <span className="card-brand-badge">{detectBrand(cardNumber.replace(/\s/g, ''))}</span>
                  )}
                </div>
              </div>
              <div className="card-row">
                <div className="card-field">
                  <label>Expiry</label>
                  <input
                    type="text"
                    placeholder="MM/YY"
                    value={expiry}
                    maxLength={5}
                    onChange={e => {
                      let v = e.target.value.replace(/\D/g, '');
                      if (v.length >= 3) v = v.slice(0, 2) + '/' + v.slice(2, 4);
                      setExpiry(v);
                    }}
                  />
                </div>
                <div className="card-field">
                  <label>CVV</label>
                  <input
                    type="text"
                    placeholder="123"
                    value={cvv}
                    maxLength={4}
                    onChange={e => setCvv(e.target.value.replace(/\D/g, ''))}
                  />
                </div>
              </div>
              <div className="card-field">
                <label>Name on card</label>
                <input
                  type="text"
                  placeholder="Jane Doe"
                  value={cardName}
                  onChange={e => setCardName(e.target.value)}
                />
              </div>
            </div>
          ) : null}
          <button className="btn-skip" onClick={() => setSkipPayment(s => !s)}>
            {skipPayment ? 'Add card instead' : 'Skip for now'}
          </button>
          <div className="step-actions">
            <button className="btn-ghost" onClick={() => setStep(3)}>← Back</button>
            <button className="btn-primary" onClick={() => setStep(5)}>Next →</button>
          </div>
        </div>
      )}

      {/* Step 5: Charity */}
      {step === 5 && (
        <div className="setup-step">
          <h2>Choose your charity</h2>
          <p className="step-sub">Bypass fees go here.</p>
          <div className="charity-list">
            {committedCharities.length > 0 && (
              <div className="charity-group-label">Your commitments</div>
            )}
            {[
              ...CHARITIES.filter(c => committedCharities.includes(c.id)),
              ...CHARITIES.filter(c => !committedCharities.includes(c.id)),
            ].map(c => (
              <button
                key={c.name}
                className={`charity-row ${charity === c.name ? 'selected' : ''}`}
                onClick={() => { setCharity(c.name); setCharityIcon(c.icon); }}
              >
                <span className="charity-icon">{c.icon}</span>
                <span>{c.name}</span>
                {committedCharities.includes(c.id) && charity !== c.name && (
                  <span className="committed-dot-sm" />
                )}
                {charity === c.name && <span className="check">✓</span>}
              </button>
            ))}
          </div>
          <div className="step-actions">
            <button className="btn-ghost" onClick={() => setStep(4)}>← Back</button>
            <button className="btn-primary" disabled={!charity} onClick={handleFinish}>
              Create Contract ✓
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
