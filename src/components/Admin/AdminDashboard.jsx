import { useContext, useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AdminContext } from '../../context/AdminContext';
import { getAdminPaths } from './adminPaths';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const { admin, logout } = useContext(AdminContext);
  const navigate = useNavigate();
  const location = useLocation();
  const isVisibleAdminRoute = location.pathname.startsWith('/admin');
  const adminPaths = getAdminPaths(isVisibleAdminRoute);
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  const token = localStorage.getItem('adminToken');

  const [activeSection, setActiveSection] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [metrics, setMetrics] = useState({
    categories: 0,
    products: 0,
    activeProducts: 0,
    incompleteProducts: 0,
    orders: 0,
    marketingUsers: 0,
  });
  const [loadingMetrics, setLoadingMetrics] = useState(true);

  const handleLogout = () => {
    logout();
    navigate(adminPaths.login);
  };

  const goTo = (path) => {
    setSidebarOpen(false);
    navigate(path);
  };

  const fetchMetrics = useCallback(async () => {
    setLoadingMetrics(true);
    try {
      const [categoriesRes, productsRes, ordersRes, marketingRes] = await Promise.all([
        fetch(`${API_URL}/categories`),
        fetch(`${API_URL}/products/admin/all`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${API_URL}/orders/admin`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${API_URL}/users/marketing`, { headers: { Authorization: `Bearer ${token}` } }),
      ]);

      const [categoriesData, productsData, ordersData, marketingData] = await Promise.all([
        categoriesRes.json().catch(() => []),
        productsRes.json().catch(() => []),
        ordersRes.json().catch(() => []),
        marketingRes.json().catch(() => []),
      ]);

      const categoryList = Array.isArray(categoriesData) ? categoriesData : [];
      const productList = Array.isArray(productsData) ? productsData : [];
      const orderList = Array.isArray(ordersData) ? ordersData : [];
      const marketingList = Array.isArray(marketingData) ? marketingData : [];

      setMetrics({
        categories: categoryList.length,
        products: productList.length,
        activeProducts: productList.filter((product) => product.isActive !== false).length,
        incompleteProducts: productList.filter((product) =>
          !product.description?.trim() ||
          !(product.image || product.images?.[0]) ||
          !product.categorySlug
        ).length,
        orders: orderList.length,
        marketingUsers: marketingList.length,
      });
    } catch (err) {
      console.error('Failed to load admin metrics', err);
    } finally {
      setLoadingMetrics(false);
    }
  }, [API_URL, token]);

  useEffect(() => {
    fetchMetrics();
  }, [fetchMetrics]);

  const overviewCards = [
    {
      icon: '📁',
      title: 'Categories',
      value: metrics.categories,
      description: 'Keep the catalog structure clean and buyer-friendly.',
      action: () => goTo(adminPaths.categories),
      label: 'Manage Categories',
    },
    {
      icon: '📦',
      title: 'Products',
      value: metrics.products,
      description: `${metrics.activeProducts} active products currently visible in the catalog.`,
      action: () => goTo(adminPaths.products),
      label: 'Manage Products',
    },
    {
      icon: '📥',
      title: 'Import',
      value: loadingMetrics ? '...' : 'Bulk',
      description: 'Bring catalog changes in faster with mapped imports and validation.',
      action: () => goTo(adminPaths.import),
      label: 'Open Import',
    },
    {
      icon: '🧾',
      title: 'Orders',
      value: metrics.orders,
      description: 'Monitor the current order volume and move quickly on new requests.',
      action: () => goTo(adminPaths.siteOrders),
      label: 'Manage Orders',
    },
    {
      icon: '📣',
      title: 'Marketing',
      value: metrics.marketingUsers,
      description: 'Review opted-in contacts and reuse the list for outreach.',
      action: () => goTo(adminPaths.marketing),
      label: 'Open Marketing',
    },
    {
      icon: '⚠️',
      title: 'Needs Attention',
      value: metrics.incompleteProducts,
      description: 'Products missing descriptions, images, or category data.',
      action: () => goTo(adminPaths.products),
      label: 'Review Products',
    },
  ];

  return (
    <div className="admin-dashboard">
      {sidebarOpen && (
        <button
          className="admin-sidebar-backdrop"
          aria-label="Close admin menu"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside className={`admin-sidebar${sidebarOpen ? ' open' : ''}`}>
        <div className="admin-sidebar-header">
          <h2>Admin Panel</h2>
          <button
            className="admin-sidebar-close"
            aria-label="Close admin menu"
            onClick={() => setSidebarOpen(false)}
          >
            ✕
          </button>
        </div>

        <nav className="admin-nav">
          <button
            className={`admin-nav-item ${activeSection === 'overview' ? 'active' : ''}`}
            onClick={() => {
              setActiveSection('overview');
              setSidebarOpen(false);
            }}
          >
            📊 Overview
          </button>
          <button className="admin-nav-item" onClick={() => goTo(adminPaths.categories)}>📁 Categories</button>
          <button className="admin-nav-item" onClick={() => goTo(adminPaths.products)}>📦 Products</button>
          <button className="admin-nav-item" onClick={() => goTo(adminPaths.import)}>📥 Import</button>
          <button className="admin-nav-item" onClick={() => goTo(adminPaths.siteOrders)}>🧾 Orders</button>
          <button className="admin-nav-item" onClick={() => goTo(adminPaths.marketing)}>📣 Marketing</button>
        </nav>

        <div className="admin-sidebar-footer">
          <div className="admin-user-info">
            <div className="admin-user-avatar">{admin?.username?.[0]?.toUpperCase()}</div>
            <div>
              <div className="admin-user-name">{admin?.username}</div>
              <div className="admin-user-role">Admin</div>
            </div>
          </div>
          <button className="admin-logout-btn" onClick={handleLogout}>
            🚪 Logout
          </button>
        </div>
      </aside>

      <main className="admin-main">
        <div className="admin-header">
          <div className="admin-header-row">
            <button
              className="admin-sidebar-toggle"
              aria-label="Open admin menu"
              onClick={() => setSidebarOpen(true)}
            >
              ☰
            </button>
            <h1>Welcome, {admin?.username}</h1>
          </div>
          <div className="admin-header-info">
            <span className="admin-status">{loadingMetrics ? 'Refreshing metrics...' : '✓ Admin Access Granted'}</span>
          </div>
        </div>

        <div className="admin-content">
          <div className="admin-overview-grid">
            {overviewCards.map((card) => (
              <div className="admin-card" key={card.title}>
                <div className="admin-card-icon">{card.icon}</div>
                <div className="admin-card-content">
                  <div className="admin-card-metric">{card.value}</div>
                  <h3>{card.title}</h3>
                  <p className="admin-card-desc">{card.description}</p>
                  <p className="admin-card-action">
                    <button onClick={card.action}>{card.label} →</button>
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="admin-info-grid">
            <div className="admin-info-box">
              <h2>Priority Checklist</h2>
              <ul>
                <li>Clean up incomplete products before they reach buyers</li>
                <li>Use imports for larger catalog moves, not manual repetition</li>
                <li>Review orders and marketing entries from the same dashboard rhythm</li>
                <li>Keep categories buyer-readable so navigation stays clear</li>
              </ul>
            </div>

            <div className="admin-info-box admin-info-box--accent">
              <h2>Current Snapshot</h2>
              <ul>
                <li>{metrics.categories} active catalog categories</li>
                <li>{metrics.products} total products across the catalog</li>
                <li>{metrics.activeProducts} currently active customer-facing products</li>
                <li>{metrics.incompleteProducts} products need better content hygiene</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
