import { useState, useEffect, useRef, useContext, useCallback } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import './Header.css';

// Header: Top navigation bar with dropdown for categories
const Header = () => {
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();

  // State
  const [categories, setCategories] = useState([]);
  const [dropdown, setDropdown] = useState(false);
  const [mobileNav, setMobileNav] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileViewport, setIsMobileViewport] = useState(
    typeof window !== 'undefined' ? window.innerWidth <= 780 : false
  );

  const navRef = useRef(null);
  const isHome = location.pathname === '/';

  const fetchCategories = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/categories`);
      const data = await res.json();
      setCategories(data);
    } catch (err) {
      console.error('Failed to load categories:', err);
    }
  }, [API_URL]);

  // Fetch categories once
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

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

  useEffect(() => {
    const syncScroll = () => setIsScrolled(window.scrollY > 24);

    syncScroll();
    window.addEventListener('scroll', syncScroll, { passive: true });

    return () => window.removeEventListener('scroll', syncScroll);
  }, [location.pathname]);

  useEffect(() => {
    const syncViewport = () => setIsMobileViewport(window.innerWidth <= 780);

    syncViewport();
    window.addEventListener('resize', syncViewport);

    return () => window.removeEventListener('resize', syncViewport);
  }, []);

  useEffect(() => {
    setMobileNav(false);
    setDropdown(false);
  }, [location.pathname]);

  const toggleMobileNav = () => {
    setMobileNav((open) => {
      if (open) setDropdown(false);
      return !open;
    });
  };

  return (
    <header className={`header${isHome ? ' header-home' : ''}${isScrolled ? ' scrolled' : ''}`}>
      <div className="container header-row">
        <Link className="brand" to="/">
          <span className="brand-mark">
            <img src={`${import.meta.env.BASE_URL}company-logo.png`} alt="Leading Trading Est" />
          </span>
          <span className="brand-copy">
            <strong>Leading Trading Est</strong>
            <span>Medical, dental & industrial supply</span>
          </span>
        </Link>

        {/* Hamburger */}
        <button
          className={`header-hamburger${mobileNav ? ' open' : ''}`}
          aria-label={mobileNav ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={mobileNav}
          onClick={toggleMobileNav}
        >
          <span className="header-hamburger-bar" />
          <span className="header-hamburger-bar" />
          <span className="header-hamburger-bar" />
        </button>

        {/* Overlay */}
        {mobileNav && (
          <div
            className="nav-mobile-overlay"
            onClick={() => {
              setMobileNav(false);
              setDropdown(false);
            }}
          />
        )}

        <nav
          ref={navRef}
          className={`nav nav-relative${mobileNav ? ' nav-mobile-active' : ''}`}
        >
          <NavLink to="/" end onClick={() => setMobileNav(false)}>
            Home
          </NavLink>

          <NavLink to="/shop" onClick={() => setMobileNav(false)}>
            Products
          </NavLink>

          {/* Categories Dropdown */}
          <div
            className="nav-dropdown-wrapper"
            onMouseEnter={() => setDropdown(true)}
            onMouseLeave={() => setDropdown(false)}
          >
            {isMobileViewport ? (
              <button
                type="button"
                className="nav-dropdown-toggle nav-dropdown-button"
                aria-expanded={dropdown}
                onClick={() => setDropdown((d) => !d)}
              >
                Categories ▾
              </button>
            ) : (
              <NavLink
                to="/categories"
                className="nav-dropdown-toggle"
                onClick={e => {
                  e.preventDefault();
                  setDropdown(d => !d);
                }}
              >
                Categories ▾
              </NavLink>
            )}

            {dropdown && (
              <div className="nav-dropdown-menu">
                {isMobileViewport && (
                  <Link
                    to="/products"
                    className="nav-dropdown-item nav-dropdown-item-all"
                    onClick={() => {
                      setDropdown(false);
                      setMobileNav(false);
                    }}
                  >
                    All Categories
                  </Link>
                )}
                {categories.map(cat => (
                  <Link
                    key={cat._id}
                    to={`/categories/${cat.slug || cat._id}`}
                    className="nav-dropdown-item"
                    onClick={() => {
                      setDropdown(false);
                      setMobileNav(false);
                    }}
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <NavLink to="/careers" onClick={() => setMobileNav(false)}>
            Careers
          </NavLink>

          <NavLink to="/contact" onClick={() => setMobileNav(false)}>
            Contact
          </NavLink>

          <NavLink to="/cart" onClick={() => setMobileNav(false)}>
            Cart
          </NavLink>

          {user && (
            <NavLink to="/orders" onClick={() => setMobileNav(false)}>
              Orders
            </NavLink>
          )}

          {/* Mobile actions */}
          {mobileNav && (
            <div className="nav-mobile-actions">
              <a className="btn" href="tel:+97339939582">Call</a>
              <a
                className="btn primary"
                href="https://wa.me/97317210665"
                target="_blank"
                rel="noreferrer"
              >
                WhatsApp
              </a>
              {user ? (
                <>
                  <Link className="btn" to="/orders">Orders</Link>
                  <button className="btn" onClick={logout}>Logout</button>
                </>
              ) : (
                <Link className="btn" to="/sign-in">Sign In</Link>
              )}
            </div>
          )}
        </nav>

        <div className="header-flex-spacer" />

        {/* Desktop actions */}
        <div className="header-actions-desktop">
          <a className="btn" href="tel:+97339939582">Call</a>
          <a
            className="btn primary"
            href="https://wa.me/97317210665"
            target="_blank"
            rel="noreferrer"
          >
            WhatsApp
          </a>
          {user ? (
            <button className="btn" onClick={logout}>Logout</button>
          ) : (
            <Link className="btn" to="/sign-in">Sign In</Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
