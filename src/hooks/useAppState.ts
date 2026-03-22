import { useState, useEffect, useCallback } from 'react';
import type { AppState, AppContract, Forfeit, PaymentMethod } from '../lib/store';

const STORAGE_KEY = 'vetera_state';

const DEFAULT_STATE: AppState = {
  contracts: [],
  forfeits: [],
  paymentMethod: null,
  committedCharities: [],
  onboarded: false,
  userName: '',
  goals: [],
};

function loadState(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_STATE;
    return { ...DEFAULT_STATE, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_STATE;
  }
}

function saveState(state: AppState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // ignore
  }
}

export function useAppState() {
  const [state, setState] = useState<AppState>(loadState);

  useEffect(() => {
    saveState(state);
  }, [state]);

  const addContract = useCallback((contract: AppContract) => {
    setState(s => ({ ...s, contracts: [...s.contracts, contract] }));
  }, []);

  const removeContract = useCallback((id: string) => {
    setState(s => ({ ...s, contracts: s.contracts.filter(c => c.id !== id) }));
  }, []);

  const toggleContract = useCallback((id: string) => {
    setState(s => ({
      ...s,
      contracts: s.contracts.map(c =>
        c.id === id ? { ...c, active: !c.active } : c
      ),
    }));
  }, []);

  const addForfeit = useCallback((forfeit: Forfeit) => {
    setState(s => ({ ...s, forfeits: [...s.forfeits, forfeit] }));
  }, []);

  const setPaymentMethod = useCallback((pm: PaymentMethod | null) => {
    setState(s => ({ ...s, paymentMethod: pm }));
  }, []);

  const commitCharity = useCallback((id: string) => {
    setState(s => ({
      ...s,
      committedCharities: s.committedCharities.includes(id)
        ? s.committedCharities
        : [...s.committedCharities, id],
    }));
  }, []);

  const uncommitCharity = useCallback((id: string) => {
    setState(s => ({
      ...s,
      committedCharities: s.committedCharities.filter(c => c !== id),
    }));
  }, []);

  const completeOnboarding = useCallback((userName: string, goals: string[]) => {
    setState(s => ({ ...s, onboarded: true, userName, goals }));
  }, []);

  // Computed: streak (consecutive days with no forfeits, from today going back)
  const streak = (() => {
    const forfeitDays = new Set(
      state.forfeits.map(f => f.timestamp.slice(0, 10))
    );
    let count = 0;
    const now = new Date();
    while (true) {
      const d = new Date(now);
      d.setDate(d.getDate() - count);
      const key = d.toISOString().slice(0, 10);
      if (forfeitDays.has(key)) break;
      count++;
      if (count > 365) break;
    }
    return count;
  })();

  // Computed: hours saved
  const hoursSaved = (() => {
    let total = 0;
    for (const c of state.contracts) {
      if (!c.active) continue;
      for (const sched of c.schedules) {
        const [startH, startM] = sched.start.split(':').map(Number);
        const [endH, endM] = sched.end.split(':').map(Number);
        const hrs = (endH * 60 + endM - startH * 60 - startM) / 60;
        total += Math.max(0, hrs) * sched.days.length;
      }
    }
    return Math.round(total);
  })();

  // Computed: total donated per charity
  const impactByCharity: Record<string, number> = {};
  for (const f of state.forfeits) {
    impactByCharity[f.charity] = (impactByCharity[f.charity] || 0) + f.amount;
  }

  // Computed: 7-day activity
  const weeklyActivity: { date: string; amount: number }[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    const amount = state.forfeits
      .filter(f => f.timestamp.slice(0, 10) === key)
      .reduce((sum, f) => sum + f.amount, 0);
    weeklyActivity.push({ date: key, amount });
  }

  const totalDonated = state.forfeits.reduce((sum, f) => sum + f.amount, 0);

  const daysActive = new Set(
    state.forfeits.map(f => f.timestamp.slice(0, 10))
  ).size;

  return {
    contracts: state.contracts,
    forfeits: state.forfeits,
    paymentMethod: state.paymentMethod,
    committedCharities: state.committedCharities,
    onboarded: state.onboarded,
    userName: state.userName,
    goals: state.goals,
    streak,
    hoursSaved,
    impactByCharity,
    weeklyActivity,
    totalDonated,
    daysActive,
    addContract,
    removeContract,
    toggleContract,
    addForfeit,
    setPaymentMethod,
    commitCharity,
    uncommitCharity,
    completeOnboarding,
  };
}
