
import { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { getCategories } from '../../services/dataService';

// Header: Top navigation bar with dropdown for categories
const Header = () => {
  // State for dropdown menu
  const [dropdown, setDropdown] = useState(false);
  // Get all categories (sync from service)
  const categories = getCategories();

  return (
    <header className="header">
      <div className="container header-row">
  <Link className="brand" to="/">Leading Trading Est</Link>
        <nav className="nav nav-relative">
          <NavLink to="/" end className={({ isActive }) => isActive ? 'active-link' : ''}>Home</NavLink>
          {/* Categories Dropdown */}
          <div
            className="nav-dropdown-wrapper"
            onMouseEnter={() => setDropdown(true)}
            onMouseLeave={() => setDropdown(false)}
          >
            <NavLink
              to="/categories"
              className={({ isActive }) => isActive ? 'active-link nav-dropdown-toggle' : 'nav-dropdown-toggle'}
              onClick={e => { e.preventDefault(); setDropdown(d => !d); }}
            >
              Categories ▾
            </NavLink>
            {dropdown && (
              <div className="nav-dropdown-menu">
                {categories.map(cat => (
                  <Link
                    key={cat.slug}
                    to={`/categories/${cat.slug}`}
                    className="nav-dropdown-item"
                    onClick={() => setDropdown(false)}
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            )}
          </div>
          <NavLink to="/careers" className={({ isActive }) => isActive ? 'active-link' : ''}>Careers</NavLink>
          <NavLink to="/contact" className={({ isActive }) => isActive ? 'active-link' : ''}>Contact Us</NavLink>
        </nav>
        <div className="header-flex-spacer" />
        <a className="btn" href="tel:+97339939582">Call</a>
        <a className="btn primary" href="https://wa.me/97317210665" target="_blank" rel="noreferrer">WhatsApp</a>
      </div>
    </header>
  );
};

export default Header;
