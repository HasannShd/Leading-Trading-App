import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminContext } from '../../context/AdminContext';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const { admin, logout } = useContext(AdminContext);
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/.well-known/admin-access-sh123456');
  };

  const goTo = (path) => {
    setSidebarOpen(false);
    navigate(path);
  };

  return (
    <div className="admin-dashboard">
      {sidebarOpen && (
        <button
          className="admin-sidebar-backdrop"
          aria-label="Close admin menu"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
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
          <button
            className={`admin-nav-item ${activeSection === 'categories' ? 'active' : ''}`}
            onClick={() => goTo('/.well-known/admin-categories-sh123456')}
          >
            📁 Categories
          </button>
          <button
            className={`admin-nav-item ${activeSection === 'products' ? 'active' : ''}`}
            onClick={() => goTo('/.well-known/admin-products-sh123456')}
          >
            📦 Products
          </button>
          <button
            className={`admin-nav-item ${activeSection === 'import' ? 'active' : ''}`}
            onClick={() => goTo('/.well-known/admin-import-sh123456')}
          >
            📥 Import
          </button>
          <button
            className={`admin-nav-item ${activeSection === 'orders' ? 'active' : ''}`}
            onClick={() => goTo('/.well-known/admin-orders-sh123456')}
          >
            🧾 Orders
          </button>
          <button
            className={`admin-nav-item ${activeSection === 'marketing' ? 'active' : ''}`}
            onClick={() => goTo('/.well-known/admin-marketing-sh123456')}
          >
            📣 Marketing
          </button>
        </nav>

        <div className="admin-sidebar-footer">
          <div className="admin-user-info">
            <div className="admin-user-avatar">{admin?.username[0]?.toUpperCase()}</div>
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

      {/* Main Content */}
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
            <h1>Welcome, {admin?.username}!</h1>
          </div>
          <div className="admin-header-info">
            <span className="admin-status">✓ Admin Access Granted</span>
          </div>
        </div>

        <div className="admin-content">
          <div className="admin-overview-grid">
            <div className="admin-card">
              <div className="admin-card-icon">📁</div>
              <div className="admin-card-content">
                <h3>Categories</h3>
                <p className="admin-card-action">
                  <button onClick={() => goTo('/.well-known/admin-categories-sh123456')}>
                    Manage Categories →
                  </button>
                </p>
              </div>
            </div>

            <div className="admin-card">
              <div className="admin-card-icon">📦</div>
              <div className="admin-card-content">
                <h3>Products</h3>
                <p className="admin-card-action">
                  <button onClick={() => goTo('/.well-known/admin-products-sh123456')}>
                    Manage Products →
                  </button>
                </p>
              </div>
            </div>

            <div className="admin-card">
              <div className="admin-card-icon">📥</div>
              <div className="admin-card-content">
                <h3>Import</h3>
                <p className="admin-card-action">
                  <button onClick={() => goTo('/.well-known/admin-import-sh123456')}>
                    Import Products →
                  </button>
                </p>
              </div>
            </div>

            <div className="admin-card">
              <div className="admin-card-icon">🧾</div>
              <div className="admin-card-content">
                <h3>Orders</h3>
                <p className="admin-card-action">
                  <button onClick={() => goTo('/.well-known/admin-orders-sh123456')}>
                    Manage Orders →
                  </button>
                </p>
              </div>
            </div>

            <div className="admin-card">
              <div className="admin-card-icon">📣</div>
              <div className="admin-card-content">
                <h3>Marketing</h3>
                <p className="admin-card-action">
                  <button onClick={() => goTo('/.well-known/admin-marketing-sh123456')}>
                    Marketing List →
                  </button>
                </p>
              </div>
            </div>

            <div className="admin-card">
              <div className="admin-card-icon">👤</div>
              <div className="admin-card-content">
                <h3>Account</h3>
                <p className="admin-card-desc">Username: {admin?.username}</p>
              </div>
            </div>
          </div>

          <div className="admin-info-box">
            <h2>Quick Guide</h2>
            <ul>
              <li>Use the sidebar to navigate between different management areas</li>
              <li>Add, edit, or delete categories and products</li>
              <li>Changes are saved immediately to the database</li>
              <li>Your admin access is confirmed and active</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
