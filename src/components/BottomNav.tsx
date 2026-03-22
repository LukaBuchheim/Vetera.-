type Tab = 'overview' | 'contracts' | 'history' | 'charities';

interface Props {
  activeTab: Tab;
  onChange: (tab: Tab) => void;
}

const TABS = [
  { id: 'overview' as const, icon: '📊', label: 'Overview' },
  { id: 'contracts' as const, icon: '🔒', label: 'Contracts' },
  { id: 'charities' as const, icon: '🏥', label: 'Charities' },
  { id: 'history' as const, icon: '🕒', label: 'History' },
];

export default function BottomNav({ activeTab, onChange }: Props) {
  return (
    <nav className="bottom-nav">
      {TABS.map(tab => (
        <button
          key={tab.id}
          className={`nav-tab ${activeTab === tab.id ? 'active' : ''}`}
          onClick={() => onChange(tab.id)}
        >
          <span className="nav-icon">{tab.icon}</span>
          <span className="nav-label">{tab.label}</span>
        </button>
      ))}
    </nav>
  );
}
