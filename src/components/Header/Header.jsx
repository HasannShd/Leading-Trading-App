
import { useState, useEffect, useRef } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { getCategories } from '../../services/dataService';

// Header: Top navigation bar with dropdown for categories
const Header = () => {
  // State for dropdown menu
  const [dropdown, setDropdown] = useState(false);
  // State for mobile nav
  const [mobileNav, setMobileNav] = useState(false);

  // Get all categories (sync from service)
  const categories = getCategories();

  // Ref for nav to detect outside clicks
  const navRef = useRef();

  // Close mobile nav on outside click
  useEffect(() => {
    if (!mobileNav) return;
    function handleClick(e) {
      if (navRef.current && !navRef.current.contains(e.target)) {
        setMobileNav(false);
        setDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [mobileNav]);

  return (
    <header className="header">
      <div className="container header-row">
        <Link className="brand" to="/">Leading Trading Est</Link>
        {/* Hamburger for mobile */}
        <button
          className={`header-hamburger${mobileNav ? ' open' : ''}`}
          aria-label={mobileNav ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={mobileNav}
          onClick={() => setMobileNav(m => !m)}
        >
          <span className="header-hamburger-bar" />
          <span className="header-hamburger-bar" />
          <span className="header-hamburger-bar" />
        </button>
        {/* Overlay for mobile nav */}
        {mobileNav && <div className="nav-mobile-overlay" onClick={() => { setMobileNav(false); setDropdown(false); }} />}
        <nav
          ref={navRef}
          className={`nav nav-relative${mobileNav ? ' nav-mobile-active' : ''}`}
          aria-hidden={!mobileNav && window.innerWidth <= 700}
        >
          <NavLink to="/" end className={({ isActive }) => isActive ? 'active-link' : ''} onClick={() => setMobileNav(false)}>Home</NavLink>
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
                    onClick={() => { setDropdown(false); setMobileNav(false); }}
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            )}
          </div>
          <NavLink to="/careers" className={({ isActive }) => isActive ? 'active-link' : ''} onClick={() => setMobileNav(false)}>Careers</NavLink>
          <NavLink to="/contact" className={({ isActive }) => isActive ? 'active-link' : ''} onClick={() => setMobileNav(false)}>Contact Us</NavLink>
          {/* Action buttons in mobile nav */}
          {mobileNav && (
            <div className="nav-mobile-actions">
              <a className="btn" href="tel:+97339939582">Call</a>
              <a className="btn primary" href="https://wa.me/97317210665" target="_blank" rel="noreferrer">WhatsApp</a>
            </div>
          )}
        </nav>
        <div className="header-flex-spacer" />
        {/* Only show action buttons on desktop */}
        <div className="header-actions-desktop">
          <a className="btn" href="tel:+97339939582">Call</a>
          <a className="btn primary" href="https://wa.me/97317210665" target="_blank" rel="noreferrer">WhatsApp</a>
        </div>
      </div>
    </header>
  );
};

export default Header;
