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
  charityIcon: string;
  amount: number;
  timestamp: string;
}

export interface Charity {
  id: string;
  name: string;
  icon: string;
  category: string;
  tagline: string;
  description: string;
  whereMoneyGoes: { label: string; percent: number }[];
  impact: string; // e.g. "$5 provides clean water for 30 days"
}

export interface AppState {
  contracts: AppContract[];
  forfeits: Forfeit[];
  paymentMethod: PaymentMethod | null;
  committedCharities: string[]; // charity ids
  onboarded: boolean;
  userName: string;
  goals: string[];
}

export const CHARITIES: Charity[] = [
  {
    id: 'red-cross',
    name: 'Red Cross',
    icon: '🏥',
    category: 'Humanitarian',
    tagline: 'Preventing and alleviating human suffering',
    description: 'The Red Cross responds to nearly 70,000 disasters across the US every year — house fires, floods, hurricanes — providing shelter, food, and emotional support to people in crisis.',
    whereMoneyGoes: [
      { label: 'Programs & Services', percent: 90 },
      { label: 'Fundraising', percent: 5 },
      { label: 'Administration', percent: 5 },
    ],
    impact: '$5 helps provide emergency supplies for a family displaced by disaster',
  },
  {
    id: 'wwf',
    name: 'WWF',
    icon: '🐼',
    category: 'Environment',
    tagline: 'Protecting nature for the benefit of people and wildlife',
    description: 'WWF works in over 100 countries to protect endangered species, restore habitats, and address the root causes of environmental threats — from deforestation to climate change.',
    whereMoneyGoes: [
      { label: 'Conservation Programs', percent: 82 },
      { label: 'Fundraising', percent: 10 },
      { label: 'Administration', percent: 8 },
    ],
    impact: '$5 helps fund one hour of anti-poaching patrol in a critical wildlife zone',
  },
  {
    id: 'unicef',
    name: 'UNICEF',
    icon: '🌍',
    category: 'Children',
    tagline: 'Every child has the right to survive and thrive',
    description: 'UNICEF works in over 190 countries to save children\'s lives, defend their rights, and help them fulfil their potential — from providing vaccines to improving access to education.',
    whereMoneyGoes: [
      { label: 'Child Programmes', percent: 87 },
      { label: 'Fundraising', percent: 7 },
      { label: 'Administration', percent: 6 },
    ],
    impact: '$5 buys life-saving therapeutic food to treat a malnourished child for a week',
  },
  {
    id: 'msf',
    name: 'Doctors Without Borders',
    icon: '⚕️',
    category: 'Healthcare',
    tagline: 'Medical care where it\'s needed most',
    description: 'MSF provides medical care in conflict zones, epidemic outbreaks, and natural disasters. Operating in over 70 countries, they treat millions of patients each year regardless of race, religion, or politics.',
    whereMoneyGoes: [
      { label: 'Medical Operations', percent: 86 },
      { label: 'Fundraising', percent: 9 },
      { label: 'Administration', percent: 5 },
    ],
    impact: '$5 covers the cost of a full course of malaria treatment for a child',
  },
  {
    id: 'save-children',
    name: 'Save the Children',
    icon: '👶',
    category: 'Children',
    tagline: 'A world where every child has a safe and happy childhood',
    description: 'Save the Children fights for children\'s rights and delivers immediate, lasting change in their lives — providing emergency relief, education, health care, and economic opportunities.',
    whereMoneyGoes: [
      { label: 'Programs', percent: 85 },
      { label: 'Fundraising', percent: 9 },
      { label: 'Administration', percent: 6 },
    ],
    impact: '$5 provides essential learning supplies for a child for an entire school term',
  },
  {
    id: 'habitat',
    name: 'Habitat for Humanity',
    icon: '🏠',
    category: 'Housing',
    tagline: 'A world where everyone has a decent place to live',
    description: 'Habitat for Humanity builds and repairs homes in partnership with families in need across the US and in 70+ countries. Homeownership changes everything — health, education, financial stability.',
    whereMoneyGoes: [
      { label: 'Home Building & Repair', percent: 83 },
      { label: 'Fundraising', percent: 10 },
      { label: 'Administration', percent: 7 },
    ],
    impact: '$5 buys materials to repair a critical part of a family\'s home',
  },
  {
    id: 'ocean-conservancy',
    name: 'Ocean Conservancy',
    icon: '🌊',
    category: 'Environment',
    tagline: 'A healthy ocean for people and wildlife',
    description: 'Ocean Conservancy leads the world\'s largest annual beach cleanup and advocates for science-based policies to protect ocean ecosystems. They\'ve removed over 350 million pounds of trash from beaches worldwide.',
    whereMoneyGoes: [
      { label: 'Ocean Programs', percent: 80 },
      { label: 'Fundraising', percent: 12 },
      { label: 'Administration', percent: 8 },
    ],
    impact: '$5 helps remove 5 lbs of plastic from coastal environments',
  },
  {
    id: 'mental-health-america',
    name: 'Mental Health America',
    icon: '🧠',
    category: 'Health',
    tagline: 'Mental health for all — before stage 4',
    description: 'Mental Health America promotes mental health as a critical part of overall wellness. They advocate for policies, educate the public, and connect people with free screening tools and community support.',
    whereMoneyGoes: [
      { label: 'Programs & Advocacy', percent: 78 },
      { label: 'Fundraising', percent: 13 },
      { label: 'Administration', percent: 9 },
    ],
    impact: '$5 funds access to free mental health screening for 10 people',
  },
  {
    id: 'feeding-america',
    name: 'Feeding America',
    icon: '🍽️',
    category: 'Food',
    tagline: 'A hunger-free America',
    description: 'Feeding America is the nation\'s largest hunger-relief organization, operating a nationwide network of 200 food banks serving 60,000 food pantries. They provide meals to 40 million people in need each year.',
    whereMoneyGoes: [
      { label: 'Food Programs', percent: 98 },
      { label: 'Fundraising', percent: 1 },
      { label: 'Administration', percent: 1 },
    ],
    impact: '$5 helps provide 50 meals to people facing hunger',
  },
  {
    id: 'trees-for-future',
    name: 'Trees for the Future',
    icon: '🌳',
    category: 'Environment',
    tagline: 'Planting trees, transforming lives',
    description: 'Trees for the Future trains farmers in sub-Saharan Africa to plant diverse forests, restoring degraded land and generating sustainable income. One planted tree can change a family\'s future.',
    whereMoneyGoes: [
      { label: 'Planting Programs', percent: 84 },
      { label: 'Fundraising', percent: 10 },
      { label: 'Administration', percent: 6 },
    ],
    impact: '$5 plants 50 trees and helps restore land for a farming family',
  },
];

export const GOALS = [
  { id: 'doom-scroll', icon: '🌀', label: 'Stop doom scrolling', sub: 'Break the endless feed loop' },
  { id: 'screen-time', icon: '📵', label: 'Reduce screen time', sub: 'Spend less time on your phone' },
  { id: 'focus', icon: '🎯', label: 'Improve focus', sub: 'Get deep work done without distractions' },
  { id: 'sleep', icon: '😴', label: 'Better sleep habits', sub: 'No more late-night scrolling' },
  { id: 'family', icon: '👨‍👩‍👧', label: 'More time with family', sub: 'Be present for the people that matter' },
  { id: 'read', icon: '📚', label: 'Read more, scroll less', sub: 'Replace scrolling with something real' },
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
