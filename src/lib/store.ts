export interface SchedulePeriod {
  id: string;
  start: string; // "HH:MM"
  end: string;   // "HH:MM"
  days: ('Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun')[];
}

export interface PaymentMethod {
  last4: string;
  brand: 'Visa' | 'Mastercard' | 'Amex' | 'Discover' | 'Unknown';
  expiryMonth: string;
  expiryYear: string;
  name: string;
}

export interface AppContract {
  id: string;
  appName: string;
  appIcon: string;
  bypassFee: number;
  charity: string;
  charityIcon: string;
  schedules: SchedulePeriod[];
  active: boolean;
  createdAt: string;
}

export interface Forfeit {
  id: string;
  contractId: string;
  appName: string;
  charity: string;
  amount: number;
  timestamp: string;
}

export interface AppState {
  contracts: AppContract[];
  forfeits: Forfeit[];
  paymentMethod: PaymentMethod | null;
}

export const CHARITIES = [
  { name: 'Red Cross', icon: '🏥' },
  { name: 'WWF', icon: '🐼' },
  { name: 'UNICEF', icon: '🌍' },
  { name: 'Doctors Without Borders', icon: '⚕️' },
  { name: 'Save the Children', icon: '👶' },
  { name: 'Habitat for Humanity', icon: '🏠' },
];

export const APPS = [
  { name: 'Instagram', icon: '📸' },
  { name: 'TikTok', icon: '🎵' },
  { name: 'Twitter', icon: '🐦' },
  { name: 'YouTube', icon: '▶️' },
  { name: 'Reddit', icon: '👽' },
  { name: 'Facebook', icon: '👍' },
  { name: 'Snapchat', icon: '👻' },
  { name: 'LinkedIn', icon: '💼' },
];
