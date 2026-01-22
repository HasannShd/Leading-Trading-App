import { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Card from '../Common/Card';
import Input from '../Common/Input';
import './Categories.css';

const Categories = () => {
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  const [categories, setCategories] = useState([]);
  const [q, setQ] = useState('');

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${API_URL}/categories`);
      const data = await response.json();
      console.log('Categories:', data);
      setCategories(data);
    } catch (err) {
      console.error('Failed to fetch categories:', err);
    }
  };

  // Filtered list based on search
  const list = useMemo(() => {
    const s = q.toLowerCase().trim();
    return s
      ? categories.filter(c =>
          c.name.toLowerCase().includes(s) ||
          (c.description || '').toLowerCase().includes(s)
        )
      : categories;
  }, [q, categories]);

  return (
    <main>
      <section className="categories-section">
        <div className="categories-header-row">
          <h1 className="categories-title">Categories</h1>
          <div className="categories-header-spacer" />
          <Input
            className="categories-search"
            placeholder="Search categories…"
            value={q}
            onChange={e => setQ(e.target.value)}
          />
        </div>

        <div className="categories-grid">
          {list.map(c => {
            const categoryKey = (c.slug || c.name || '')
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, '-')
              .replace(/(^-|-$)+/g, '');

            return (
            <Link
              key={c._id}
              to={`/categories/${c.slug || c._id}`}
              className="categories-card-link"
              aria-label={`Open ${c.name}`}
            >
              <Card>
                <div className="categories-card-image" data-category={categoryKey}>
                  {c.image ? (
                    <img
                      className={`categories-card-img${categoryKey ? ` categories-card-img--${categoryKey}` : ''}`}
                      src={
                        c.image.startsWith('http')
                          ? c.image
                          : `${import.meta.env.BASE_URL}${c.image.replace(/^\//, '')}`
                      }
                      alt={c.name}
                      loading="lazy"
                    />
                  ) : (
                    <span>{c.name[0]}</span>
                  )}
                </div>
                <div className="categories-card-content">
                  <h3 className="categories-card-title">{c.name}</h3>
                  <p className="categories-card-desc">{c.description}</p>
                </div>
              </Card>
            </Link>
            );
          })}
        </div>

        {list.length === 0 && (
          <p className="categories-empty">No categories found.</p>
        )}
      </section>
    </main>
  );
};

export default Categories;
