import { useState } from 'react';
import { CHARITIES } from '../lib/store';
import type { Charity } from '../lib/store';
import CharityDetail from './CharityDetail';

interface Props {
  committedCharities: string[];
  onCommit: (id: string) => void;
  onUncommit: (id: string) => void;
}

const CATEGORIES = ['All', 'Humanitarian', 'Environment', 'Children', 'Healthcare', 'Health', 'Housing', 'Food'];

export default function CharitiesTab({ committedCharities, onCommit, onUncommit }: Props) {
  const [selected, setSelected] = useState<Charity | null>(null);
  const [activeCategory, setActiveCategory] = useState('All');

  if (selected) {
    return (
      <CharityDetail
        charity={selected}
        committed={committedCharities.includes(selected.id)}
        onCommit={() => onCommit(selected.id)}
        onUncommit={() => onUncommit(selected.id)}
        onBack={() => setSelected(null)}
      />
    );
  }

  const categories = CATEGORIES.filter(c =>
    c === 'All' || CHARITIES.some(ch => ch.category === c)
  );

  const filtered = activeCategory === 'All'
    ? CHARITIES
    : CHARITIES.filter(c => c.category === activeCategory);

  const committed = filtered.filter(c => committedCharities.includes(c.id));
  const others = filtered.filter(c => !committedCharities.includes(c.id));

  return (
    <div className="charities-tab">
      {/* Category filter */}
      <div className="charity-categories">
        {categories.map(cat => (
          <button
            key={cat}
            className={`category-pill ${activeCategory === cat ? 'active' : ''}`}
            onClick={() => setActiveCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Committed section */}
      {committed.length > 0 && (
        <div className="charity-section">
          <div className="charity-section-label">Your commitments</div>
          {committed.map(c => (
            <CharityRow
              key={c.id}
              charity={c}
              committed
              onClick={() => setSelected(c)}
            />
          ))}
        </div>
      )}

      {/* All others */}
      <div className="charity-section">
        {committed.length > 0 && others.length > 0 && (
          <div className="charity-section-label">Explore</div>
        )}
        {others.length === 0 && committed.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">🏥</div>
            <h3>No charities found</h3>
          </div>
        )}
        {others.map(c => (
          <CharityRow
            key={c.id}
            charity={c}
            committed={false}
            onClick={() => setSelected(c)}
          />
        ))}
      </div>
    </div>
  );
}

function CharityRow({ charity, committed, onClick }: { charity: Charity; committed: boolean; onClick: () => void }) {
  return (
    <button className="charity-row-card" onClick={onClick}>
      <div className="charity-row-icon">{charity.icon}</div>
      <div className="charity-row-info">
        <div className="charity-row-name">{charity.name}</div>
        <div className="charity-row-category">{charity.category} · {charity.tagline.slice(0, 40)}{charity.tagline.length > 40 ? '…' : ''}</div>
      </div>
      <div className="charity-row-right">
        {committed && <span className="committed-dot" />}
        <span className="charity-row-arrow">›</span>
      </div>
    </button>
  );
}
