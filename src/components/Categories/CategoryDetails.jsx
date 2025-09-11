import { useParams } from 'react-router-dom';
import { getCategory } from '../../services/dataService';
import { getProductsByCategory } from '../../services/productsService';

// CategoryDetails: Shows all products for a given category
const CategoryDetails = () => {
  // Get category slug from URL
  const { slug } = useParams();
  // Get category and products (sync from service)
  const category = getCategory(slug);
  const products = getProductsByCategory(slug);

  // If category not found
  if (!category) {
    return (
      <main>
        <section className="category-details-section">
          <h2 className="category-details-notfound">Category not found</h2>
        </section>
      </main>
    );
  }

  return (
    <main>
      <section className="category-details-section">
        <h1 className="category-details-title">{category.name}</h1>
        <p className="category-details-desc">{category.description}</p>

        {/* Products List */}
        <h2 className="category-details-products-title">Products</h2>
        {products.length === 0 ? (
          <p className="category-details-empty">No products in this category yet.</p>
        ) : (
          <ul className="category-details-products-list">
            {products.map((p, idx) => (
              <li key={p.name} className="category-details-product-item">
                <img
                  src={import.meta.env.BASE_URL + 'src/assets/' + p.image}
                  alt={p.name}
                  className="category-details-product-img"
                />
                <strong>{p.name}</strong>
                {/* <div className="category-details-product-desc">{p.description}</div> */}
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
};

export default CategoryDetails;
