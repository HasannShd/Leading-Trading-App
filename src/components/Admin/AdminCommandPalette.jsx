import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminCommandPalette.css';

const allLinks = [
  { to: '/admin/dashboard',          label: 'Overview',        section: 'Staff Operations', icon: '⌂' },
  { to: '/admin/staff',              label: 'Staff Team',       section: 'Staff Operations', icon: '◉' },
  { to: '/admin/messages',           label: 'Messages',         section: 'Staff Operations', icon: '✉' },
  { to: '/admin/attendance',         label: 'Attendance',       section: 'Staff Operations', icon: '◌' },
  { to: '/admin/reports',            label: 'Reports',          section: 'Staff Operations', icon: '▤' },
  { to: '/admin/orders',             label: 'Staff Orders',     section: 'Staff Operations', icon: '▣' },
  { to: '/admin/clients',            label: 'Clients',          section: 'Staff Operations', icon: '◎' },
  { to: '/admin/visits',             label: 'Visits',           section: 'Staff Operations', icon: '◍' },
  { to: '/admin/logs',               label: 'Logs',             section: 'Staff Operations', icon: '⋯' },
  { to: '/admin/website',            label: 'Website',          section: 'Website Control',  icon: '◫' },
  { to: '/admin/catalog',            label: 'Catalog',          section: 'Website Control',  icon: '◫' },
  { to: '/admin/catalog/categories', label: 'Categories',       section: 'Website Control',  icon: '□'  },
  { to: '/admin/catalog/products',   label: 'Products',         section: 'Website Control',  icon: '◇' },
  { to: '/admin/catalog/import',     label: 'Import',           section: 'Website Control',  icon: '↥' },
  { to: '/admin/site-orders',        label: 'Website Orders',   section: 'Website Control',  icon: '▥' },
  { to: '/admin/marketing',          label: 'Marketing',        section: 'Website Control',  icon: '✦' },
  { to: '/admin/updates',            label: 'App Updates',      section: 'Website Control',  icon: '⬡' },
  { to: '/admin/account',            label: 'Account',          section: 'Website Control',  icon: '⚙' },
];

const AdminCommandPalette = ({ onClose }) => {
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(0);
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const listRef = useRef(null);

  useEffect(() => { inputRef.current?.focus(); }, []);

  const filtered = query.trim()
    ? allLinks.filter((l) =>
        l.label.toLowerCase().includes(query.toLowerCase()) ||
        l.section.toLowerCase().includes(query.toLowerCase())
      )
    : allLinks;

  useEffect(() => { setSelected(0); }, [query]);

  const go = (to) => { navigate(to); onClose(); };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelected((s) => {
        const next = Math.min(s + 1, filtered.length - 1);
        listRef.current?.children[next]?.scrollIntoView({ block: 'nearest' });
        return next;
      });
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelected((s) => {
        const prev = Math.max(s - 1, 0);
        listRef.current?.children[prev]?.scrollIntoView({ block: 'nearest' });
        return prev;
      });
    } else if (e.key === 'Enter') {
      if (filtered[selected]) go(filtered[selected].to);
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <div className="acp-overlay" onClick={onClose}>
      <div className="acp-modal" onClick={(e) => e.stopPropagation()} onKeyDown={handleKeyDown}>
        <div className="acp-search">
          <span className="acp-search-icon" aria-hidden="true">⌘</span>
          <input
            ref={inputRef}
            className="acp-input"
            placeholder="Jump to a page..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search admin pages"
          />
          {query && (
            <button className="acp-clear" onClick={() => setQuery('')} aria-label="Clear search">×</button>
          )}
        </div>

        <div className="acp-results" ref={listRef}>
          {filtered.length > 0 ? filtered.map((link, i) => (
            <button
              key={link.to}
              className={`acp-item${i === selected ? ' selected' : ''}`}
              onClick={() => go(link.to)}
              onMouseEnter={() => setSelected(i)}
            >
              <span className="acp-item-icon">{link.icon}</span>
              <span className="acp-item-label">{link.label}</span>
              <span className="acp-item-section">{link.section}</span>
              <span className="acp-item-arrow">→</span>
            </button>
          )) : (
            <div className="acp-empty">No pages match <strong>"{query}"</strong></div>
          )}
        </div>

        <div className="acp-footer">
          <span><kbd>↑↓</kbd> navigate</span>
          <span><kbd>↵</kbd> open</span>
          <span><kbd>Esc</kbd> close</span>
        </div>
      </div>
    </div>
  );
};

export default AdminCommandPalette;
