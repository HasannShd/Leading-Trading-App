import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import './CategoryDetails.css';

// CategoryDetails: Shows all products for a given category
const CategoryDetails = () => {
  // Get category slug from URL
  const { slug } = useParams();
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategoryAndProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const categoryRes = await fetch(`${API_URL}/categories/${slug}`);
        if (!categoryRes.ok) {
          setCategory(null);
          setProducts([]);
          return;
        }
        const categoryData = await categoryRes.json();
        setCategory(categoryData);

        const productsRes = await fetch(`${API_URL}/products?category=${categoryData._id}`);
        const productsData = await productsRes.json();
        setProducts(Array.isArray(productsData) ? productsData : (productsData.items || []));
      } catch (err) {
        console.error('Failed to load category details:', err);
        setError('Failed to load category details');
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryAndProducts();
  }, [API_URL, slug]);

  // If category not found
  if (!loading && !category) {
    return (
      <main>
        <section className="category-details-section">
          <h2 className="category-details-notfound">
            {error || 'Category not found'}
          </h2>
        </section>
      </main>
    );
  }

  return (
    <main>
      <section className="category-details-section">
        {loading ? (
          <p className="category-details-empty">Loading...</p>
        ) : (
          <>
            <h1 className="category-details-title">{category.name}</h1>
            <p className="category-details-desc">{category.description}</p>
          </>
        )}

        {/* Products List */}
        <h2 className="category-details-products-title">Products</h2>
        {loading ? (
          <p className="category-details-empty">Loading...</p>
        ) : products.length === 0 ? (
          <p className="category-details-empty">No products in this category yet.</p>
        ) : (
          <ul className="category-details-products-list">
            {products.map((p) => (
              <li key={p._id} className="category-details-product-item">
                <Link to={`/product/${p._id}`} className="categories-card-link">
                  {(p.image || p.images?.[0]) && (
                    <img
                      src={
                        (p.image || p.images?.[0]).startsWith('http')
                          ? (p.image || p.images?.[0])
                          : `${import.meta.env.BASE_URL}${(p.image || p.images?.[0]).replace(/^\//, '')}`
                      }
                      alt={p.name}
                      className="category-details-product-img"
                      loading="lazy"
                    />
                  )}
                  <strong>{p.name}</strong>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
};

export default CategoryDetails;
