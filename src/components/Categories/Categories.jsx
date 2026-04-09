import { useState, useMemo, useEffect, useCallback, useDeferredValue, useRef } from 'react';
import { Link } from 'react-router-dom';
import Card from '../Common/Card';
import Input from '../Common/Input';
import StatePanel from '../Common/StatePanel';
import { buildCategoryTree } from '../../utils/categoryTree';
import { useScrollReveal } from '../../hooks/useScrollReveal';
import './Categories.css';

const Categories = () => {
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  const [categories, setCategories] = useState([]);
  const [q, setQ] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const rootRef = useRef(null);

  const deferredQuery = useDeferredValue(q);

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`${API_URL}/categories`);
      const data = await response.json();
      const nextCategories = Array.isArray(data) ? data : [];
      setCategories(nextCategories);
    } catch (err) {
      setError('We could not load the category catalog right now.');
    } finally {
      setLoading(false);
    }
  }, [API_URL]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useScrollReveal(rootRef);

  const list = useMemo(() => {
    const s = deferredQuery.toLowerCase().trim();
    const tree = buildCategoryTree(categories);
    return s
      ? tree.filter((parent) =>
          parent.name.toLowerCase().includes(s) ||
          (parent.description || '').toLowerCase().includes(s) ||
          parent.children.some((child) =>
            child.name.toLowerCase().includes(s) ||
            (child.description || '').toLowerCase().includes(s)
          )
        )
      : tree;
  }, [deferredQuery, categories]);

  const withDescriptions = categories.filter((category) => category.description?.trim()).length;

  return (
    <main>
      <section className="categories-shell" ref={rootRef}>
        <section className="categories-hero">
          <div className="categories-hero-copy animate-stagger" data-stagger-step="110ms">
            <span className="categories-eyebrow animate-on-scroll">Our Categories</span>
            <h1 className="categories-title animate-on-scroll">Explore our medical, dental, and industrial categories.</h1>
            <p className="categories-subtitle animate-on-scroll">
              Browse the main categories in our catalog and open each one to view the products available inside it.
            </p>
          </div>

          <div className="categories-hero-tools animate-stagger" data-stagger-step="120ms">
            <Input
              className="categories-search animate-on-scroll"
              placeholder="Search categories, departments, or supply types"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
            <div className="categories-hero-stats animate-stagger" data-stagger-step="120ms">
              <div className="categories-stat animate-on-scroll">
                <strong>{categories.length}</strong>
                <span>active categories</span>
              </div>
              <div className="categories-stat animate-on-scroll">
                <strong>{withDescriptions}</strong>
                <span>with descriptions</span>
              </div>
            </div>
          </div>
        </section>

        {loading ? (
          <StatePanel
            eyebrow="Loading"
            title="Preparing the category catalog"
            description="We’re pulling the current category structure and matching assets."
            variant="loading"
          />
        ) : error ? (
          <StatePanel
            eyebrow="Unavailable"
            title="Category catalog not available"
            description={error}
            variant="error"
            action={<button className="btn primary" onClick={fetchCategories}>Try Again</button>}
          />
        ) : list.length === 0 ? (
          <StatePanel
            eyebrow="No Match"
            title="No categories match that search"
            description={q.trim()
              ? `Nothing matched "${q.trim()}". Try a broader term or browse the full catalog.`
              : 'No categories are available yet.'}
            action={q.trim() ? <button className="btn" onClick={() => setQ('')}>Clear Search</button> : null}
          />
        ) : (
          <>
            <div className="categories-results-bar animate-on-scroll">
              <span>{list.length} category{list.length === 1 ? '' : 'ies'} available</span>
              <p>Open a main category to browse its subcategories and products.</p>
            </div>

            <div className="categories-grid animate-stagger" data-stagger-step="100ms">
              {list.map((c) => {
                const categoryKey = (c.slug || c.name || '')
                  .toLowerCase()
                  .replace(/[^a-z0-9]+/g, '-')
                  .replace(/(^-|-$)+/g, '');

                return (
                  <Link
                    key={c._id}
                    to={`/categories/${c.slug || c._id}`}
                    className="categories-card-link animate-on-scroll"
                    aria-label={`Open ${c.name}`}
                  >
                    <Card className="categories-card">
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
                        <div className="categories-card-topline">
                          <span>Main Category</span>
                          <strong>Open</strong>
                        </div>
                        <h3 className="categories-card-title">{c.name}</h3>
                        <p className="categories-card-desc">
                          {c.description?.trim() || 'Browse the subcategories and products available inside this main category.'}
                        </p>
                        {c.children?.length ? (
                          <div className="categories-card-children">
                            {c.children.slice(0, 4).map((child) => (
                              <span key={child._id}>{child.name}</span>
                            ))}
                            {c.children.length > 4 ? <strong>+{c.children.length - 4} more</strong> : null}
                          </div>
                        ) : null}
                      </div>
                    </Card>
                  </Link>
                );
              })}
            </div>
          </>
        )}
      </section>
    </main>
  );
};

export default Categories;
