import { useState, useMemo } from 'react';
import Card from '../Common/Card';
import Input from '../Common/Input';
import { getCategories } from '../../services/dataService';

// Categories: List and search all product categories
const Categories = () => {
  // State for search query
  const [q, setQ] = useState('');
  // Get all categories (sync from service)
  const all = getCategories();

  // Filtered list based on search
  const list = useMemo(() => {
    const s = q.toLowerCase().trim();
    return s
      ? all.filter(c => c.name.toLowerCase().includes(s) || (c.description || '').toLowerCase().includes(s))
      : all;
  }, [q, all]);

  return (
    <main>
      {/* Search and heading */}
      <section className="categories-section">
        <div className="categories-header-row">
          <h1 className="categories-title">Categories</h1>
          <div className="categories-header-spacer" />
          <Input className="categories-search" placeholder="Search categories…" value={q} onChange={e => setQ(e.target.value)} />
        </div>

        {/* Category cards */}
        <div className="categories-grid">
          {list.map(c => (
            <Card key={c.slug}>
              <div className="categories-card-image">
                {c.image ? (
                  <img
                    src={c.image.startsWith('/') ? c.image : '/' + c.image}
                    alt={c.name}
                    loading="lazy"
                    className="categories-card-img"
                    style={{ width: '100%', height: '120px', objectFit: 'contain', background: '#f4f8fc', borderRadius: '8px', marginBottom: 12 }}
                  />
                ) : null}
              </div>
              <div className="categories-card-content">
                <h3 className="categories-card-title">{c.name}</h3>
                <p className="categories-card-desc">{c.description}</p>
                {/* TODO: Add link to /categories/:slug for subcategories or details */}
              </div>
            </Card>
          ))}
        </div>

        {/* No results message */}
        {list.length === 0 && <p className="categories-empty">No categories found.</p>}
      </section>
    </main>
  );
};

export default Categories;
