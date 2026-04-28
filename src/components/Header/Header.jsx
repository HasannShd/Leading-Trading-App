import { useState, useEffect, useRef, useContext, useCallback, useMemo } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { buildCategoryTree } from '../../utils/categoryTree';
import './Header.css';

// Header: Top navigation bar with dropdown for categories
const Header = () => {
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();

  // State
  const [categories, setCategories] = useState([]);
  const [dropdown, setDropdown] = useState(false);
  const [expandedCategoryId, setExpandedCategoryId] = useState('');
  const [mobileNav, setMobileNav] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileViewport, setIsMobileViewport] = useState(
    typeof window !== 'undefined' ? window.innerWidth <= 780 : false
  );

  const navRef = useRef(null);
  const isHome = location.pathname === '/';
  const categoryTree = useMemo(() => buildCategoryTree(categories), [categories]);

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
        setExpandedCategoryId('');
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
    setExpandedCategoryId('');
  }, [location.pathname]);

  useEffect(() => {
    if (!mobileNav) {
      document.body.style.overflow = '';
      return undefined;
    }

    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileNav]);

  const toggleMobileNav = () => {
    setMobileNav((open) => {
      if (open) {
        setDropdown(false);
        setExpandedCategoryId('');
      }
      return !open;
    });
  };

  const closeMenus = () => {
    setDropdown(false);
    setExpandedCategoryId('');
    setMobileNav(false);
  };

  return (
    <header className={`header${isHome ? ' header-home' : ''}${isScrolled ? ' scrolled' : ''}${mobileNav ? ' mobile-open' : ''}`}>
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
          type="button"
          className={`header-hamburger${mobileNav ? ' open' : ''}`}
          aria-label={mobileNav ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={mobileNav}
          aria-controls="site-navigation"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleMobileNav();
          }}
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
          id="site-navigation"
          ref={navRef}
          className={`nav nav-relative${mobileNav ? ' nav-mobile-active' : ''}`}
        >
          <NavLink to="/" end onClick={() => setMobileNav(false)}>
            Home
          </NavLink>

          {/* Categories Dropdown */}
          <div
            className="nav-dropdown-wrapper"
            onMouseEnter={!isMobileViewport ? () => setDropdown(true) : undefined}
            onMouseLeave={!isMobileViewport ? () => {
              setDropdown(false);
              setExpandedCategoryId('');
            } : undefined}
          >
            {isMobileViewport ? (
              <button
                type="button"
                className="nav-dropdown-toggle nav-dropdown-button"
                aria-expanded={dropdown}
                aria-controls="mobile-categories-menu"
                onClick={(e) => {
                  e.stopPropagation();
                  setDropdown((d) => {
                    if (d) setExpandedCategoryId('');
                    return !d;
                  });
                }}
              >
                Categories ▾
              </button>
            ) : (
              <NavLink
                to="/categories"
                className="nav-dropdown-toggle"
              >
                Categories ▾
              </NavLink>
            )}

            {dropdown && (
              <div
                id={isMobileViewport ? 'mobile-categories-menu' : undefined}
                className="nav-dropdown-menu"
              >
                <Link
                  to="/categories"
                  className="nav-dropdown-item nav-dropdown-item-all"
                  onClick={closeMenus}
                >
                  Browse All Categories
                </Link>
                {isMobileViewport && (
                  <Link
                    to="/categories"
                    className="nav-dropdown-item nav-dropdown-item-all"
                    onClick={closeMenus}
                  >
                    All Categories
                  </Link>
                )}
                {categoryTree.map((parent) => {
                  const children = parent.children || [];
                  const isExpanded = expandedCategoryId === parent._id;

                  return (
                  <div key={parent._id} className={`nav-dropdown-group${isExpanded ? ' expanded' : ''}`}>
                    {children.length > 0 ? (
                      <button
                        type="button"
                        className="nav-dropdown-item nav-dropdown-item-parent nav-category-expander"
                        aria-expanded={isExpanded}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setExpandedCategoryId((current) => (current === parent._id ? '' : parent._id));
                        }}
                      >
                        <span>{parent.name}</span>
                        <small>{isExpanded ? 'Hide' : `${children.length} sub`}</small>
                      </button>
                    ) : (
                      <Link
                        to={`/categories/${parent.slug || parent._id}`}
                        className="nav-dropdown-item nav-dropdown-item-parent nav-category-expander"
                        onClick={closeMenus}
                      >
                        <span>{parent.name}</span>
                        <small>Open</small>
                      </Link>
                    )}
                    {isExpanded && (
                      <div className="nav-subcategory-panel">
                        <Link
                          to={`/categories/${parent.slug || parent._id}`}
                          className="nav-dropdown-more"
                          onClick={closeMenus}
                        >
                          View all in {parent.name}
                        </Link>
                        {children.map((child) => (
                          <Link
                            key={child._id}
                            to={`/categories/${child.slug || child._id}`}
                            className="nav-dropdown-item nav-dropdown-item-child"
                            onClick={closeMenus}
                          >
                            {child.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                  );
                })}
              </div>
            )}
          </div>

          <NavLink to="/shop" onClick={() => setMobileNav(false)}>
            Products
          </NavLink>

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
