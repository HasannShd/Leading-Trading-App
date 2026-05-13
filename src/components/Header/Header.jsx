import { useState, useEffect, useRef, useContext, useCallback, useMemo } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { asCategoryArray, buildCategoryTree } from '../../utils/categoryTree';
import './Header.css';

// Header: Top navigation bar with dropdown for categories
const Header = () => {
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  const { user, logout } = useContext(AuthContext);
  const { isArabic, t, categoryName, toggleLanguage } = useLanguage();
  const location = useLocation();

  // State
  const [categories, setCategories] = useState([]);
  const [dropdown, setDropdown] = useState(false);
  const [mobileNav, setMobileNav] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [expandedCategoryGroups, setExpandedCategoryGroups] = useState({});
  const [isMobileViewport, setIsMobileViewport] = useState(
    typeof window !== 'undefined' ? window.innerWidth <= 780 : false
  );

  const navRef = useRef(null);
  const isHome = location.pathname === '/';
  const isCategoriesActive = location.pathname === '/categories' || location.pathname.startsWith('/categories/');
  const categoryTree = useMemo(() => buildCategoryTree(categories), [categories]);

  const fetchCategories = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/categories`);
      const data = await res.json();
      setCategories(asCategoryArray(data));
    } catch (err) {
      console.error('Failed to load categories:', err);
    }
  }, [API_URL]);

  // Fetch categories once
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // Close open navigation surfaces on outside click.
  useEffect(() => {
    if (!mobileNav && !dropdown) return;

    function handleClick(e) {
      if (navRef.current && !navRef.current.contains(e.target)) {
        setMobileNav(false);
        setDropdown(false);
        setExpandedCategoryGroups({});
      }
    }

    document.addEventListener('pointerdown', handleClick);
    return () => document.removeEventListener('pointerdown', handleClick);
  }, [mobileNav, dropdown]);

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
    setExpandedCategoryGroups({});
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
      if (open) setDropdown(false);
      if (open) setExpandedCategoryGroups({});
      return !open;
    });
  };

  const closeMenus = () => {
    setDropdown(false);
    setMobileNav(false);
    setExpandedCategoryGroups({});
  };

  const openDropdown = () => {
    setDropdown(true);
  };

  const toggleDropdown = () => {
    setDropdown((open) => !open);
  };

  const toggleCategoryGroup = (categoryId) => {
    setExpandedCategoryGroups((current) => ({
      ...current,
      [categoryId]: !current[categoryId],
    }));
  };

  return (
    <header className={`header${isHome ? ' header-home' : ''}${isScrolled ? ' scrolled' : ''}${mobileNav ? ' mobile-open' : ''}`}>
      <div className="container header-row">
        <Link className="brand" to="/">
          <span className="brand-mark">
            <img src={`${import.meta.env.BASE_URL}company-logo.png`} alt="Leading Trading Est" />
          </span>
          <span className="brand-copy">
            <strong>{t('Leading Trading Est')}</strong>
            <span>{t('Medical, dental & industrial supply')}</span>
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
            {t('Home')}
          </NavLink>

          {/* Categories Dropdown */}
          <div
            className="nav-dropdown-wrapper"
            onMouseEnter={!isMobileViewport ? openDropdown : undefined}
          >
            {isMobileViewport ? (
              <button
                type="button"
                className="nav-dropdown-toggle nav-dropdown-button"
                aria-expanded={dropdown}
                aria-controls="mobile-categories-menu"
                onClick={(e) => {
                  e.stopPropagation();
                  setDropdown((d) => !d);
                }}
              >
                {t('Categories')} ▾
              </button>
            ) : (
              <button
                type="button"
                className={`nav-dropdown-toggle nav-category-trigger${isCategoriesActive ? ' active' : ''}`}
                aria-expanded={dropdown}
                aria-controls="desktop-categories-menu"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  toggleDropdown();
                }}
              >
                {t('Categories')} ▾
              </button>
            )}

            {dropdown && (
              <div
                id={isMobileViewport ? 'mobile-categories-menu' : 'desktop-categories-menu'}
                className="nav-dropdown-menu"
                onMouseEnter={!isMobileViewport ? openDropdown : undefined}
                onWheel={(event) => event.stopPropagation()}
              >
                <Link
                  to="/categories"
                  className="nav-dropdown-item nav-dropdown-item-all"
                  onClick={closeMenus}
                >
                  {t('Browse All Categories')}
                </Link>
                {isMobileViewport && (
                  <Link
                    to="/categories"
                    className="nav-dropdown-item nav-dropdown-item-all"
                    onClick={closeMenus}
                  >
                    {t('All Categories')}
                  </Link>
                )}
                {categoryTree.map((parent) => {
                  const isConsumablesGroup = (parent.slug || '').toLowerCase() === 'consumables-disposables';
                  const hasChildren = Boolean(parent.children?.length);
                  const childrenExpanded = !isConsumablesGroup || expandedCategoryGroups[parent._id];

                  return (
                  <div key={parent._id} className="nav-dropdown-group">
                    <div className="nav-dropdown-parent-row">
                      <Link
                        to={`/categories/${parent.slug || parent._id}`}
                        className="nav-dropdown-item nav-dropdown-item-parent"
                        onClick={closeMenus}
                      >
                        {categoryName(parent.name)}
                      </Link>
                    </div>
                    {isConsumablesGroup && hasChildren && !childrenExpanded ? (
                      <button
                        type="button"
                        className="nav-dropdown-child-hint"
                        onClick={(event) => {
                          event.preventDefault();
                          event.stopPropagation();
                          toggleCategoryGroup(parent._id);
                        }}
                      >
                        {t('Open PPE, gowns, dressings, tapes, first aid, and sutures.')}
                      </button>
                    ) : isConsumablesGroup && hasChildren ? (
                      <button
                        type="button"
                        className="nav-dropdown-child-hint nav-dropdown-child-hint-compact"
                        onClick={(event) => {
                          event.preventDefault();
                          event.stopPropagation();
                          toggleCategoryGroup(parent._id);
                        }}
                      >
                        {t('Hide consumables subcategories')}
                      </button>
                    ) : null}
                    {childrenExpanded ? parent.children?.map((child) => (
                        <Link
                          key={child._id}
                          to={`/categories/${child.slug || child._id}`}
                          className="nav-dropdown-item nav-dropdown-item-child"
                          onClick={closeMenus}
                        >
                          {categoryName(child.name)}
                        </Link>
                      )) : null}
                  </div>
                  );
                })}
              </div>
            )}
          </div>

          <NavLink to="/catalog" onClick={() => setMobileNav(false)}>
            {t('Catalog')}
          </NavLink>

          <NavLink to="/careers" onClick={() => setMobileNav(false)}>
            {t('Careers')}
          </NavLink>

          <NavLink to="/contact" onClick={() => setMobileNav(false)}>
            {t('Contact')}
          </NavLink>

          <NavLink to="/cart" onClick={() => setMobileNav(false)}>
            {t('Cart')}
          </NavLink>

          {user && (
            <NavLink to="/orders" onClick={() => setMobileNav(false)}>
              {t('Orders')}
            </NavLink>
          )}

          <button
            type="button"
            className="language-toggle nav-language-toggle"
            onClick={toggleLanguage}
            aria-label={isArabic ? 'Switch language to English' : 'تغيير اللغة إلى العربية'}
          >
            {isArabic ? 'EN' : 'عربي'}
          </button>

          {/* Mobile actions */}
          {mobileNav && (
            <div className="nav-mobile-actions">
              <a className="btn" href="tel:+97339939582">{t('Call')}</a>
              <a
                className="btn primary"
                href="https://wa.me/97317210665"
                target="_blank"
                rel="noreferrer"
              >
                {t('WhatsApp')}
              </a>
              {user ? (
                <>
                  <Link className="btn" to="/orders">{t('Orders')}</Link>
                  <button className="btn" onClick={logout}>{t('Logout')}</button>
                </>
              ) : (
                <Link className="btn" to="/sign-in">{t('Sign In')}</Link>
              )}
            </div>
          )}
        </nav>

        <div className="header-flex-spacer" />

        {/* Desktop actions */}
        <div className="header-actions-desktop">
          <button
            type="button"
            className="language-toggle"
            onClick={toggleLanguage}
            aria-label={isArabic ? 'Switch language to English' : 'تغيير اللغة إلى العربية'}
          >
            {isArabic ? 'EN' : 'عربي'}
          </button>
          <a className="btn" href="tel:+97339939582">{t('Call')}</a>
          <a
            className="btn primary"
            href="https://wa.me/97317210665"
            target="_blank"
            rel="noreferrer"
          >
            {t('WhatsApp')}
          </a>
          {user ? (
            <button className="btn" onClick={logout}>{t('Logout')}</button>
          ) : (
            <Link className="btn" to="/sign-in">{t('Sign In')}</Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
