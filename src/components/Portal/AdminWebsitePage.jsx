import { Link } from 'react-router-dom';
import './PortalShell.css';

const websiteLinks = [
  { label: 'Categories', to: '/admin/catalog/categories', meta: 'Structure catalog', icon: '□' },
  { label: 'Products', to: '/admin/catalog/products', meta: 'Manage stock list', icon: '◇' },
  { label: 'Import', to: '/admin/catalog/import', meta: 'Bulk upload', icon: '↥' },
  { label: 'Website Orders', to: '/admin/site-orders', meta: 'Customer orders', icon: '▥' },
  { label: 'Marketing', to: '/admin/marketing', meta: 'Lead contacts', icon: '✦' },
  { label: 'Account', to: '/admin/account', meta: 'Security + profile', icon: '⚙' },
];

const AdminWebsitePage = () => (
  <section className="portal-page portal-admin-dashboard">
    <div className="portal-card portal-admin-tile-section">
      <div className="portal-section-head">
        <div>
          <div className="portal-brand-kicker">Website Control</div>
          <h1 className="portal-section-title portal-admin-panel-title">Catalog and site tools</h1>
          <p className="portal-section-copy">
            Manage categories, products, imports, website orders, marketing, and account settings from one website workspace.
          </p>
        </div>
      </div>
      <div className="portal-admin-module-grid website">
        {websiteLinks.map((item) => (
          <Link key={item.to} to={item.to} className="portal-admin-module-card soft" style={{ textDecoration: 'none', color: 'inherit' }}>
            <div className="portal-admin-module-icon" aria-hidden="true">{item.icon}</div>
            <div className="portal-admin-module-copy">
              <strong>{item.label}</strong>
              <span>{item.meta}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  </section>
);

export default AdminWebsitePage;
