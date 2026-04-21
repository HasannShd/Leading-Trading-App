import { useState } from 'react';
import { Link } from 'react-router-dom';
import { authFetch } from '../../services/authFetch';
import './PortalShell.css';

const websiteLinks = [
  { label: 'Categories', to: '/admin/catalog/categories', meta: 'Structure catalog', icon: '□' },
  { label: 'Products', to: '/admin/catalog/products', meta: 'Manage stock list', icon: '◇' },
  { label: 'Import', to: '/admin/catalog/import', meta: 'Bulk upload', icon: '↥' },
  { label: 'Website Orders', to: '/admin/site-orders', meta: 'Customer orders', icon: '▥' },
  { label: 'Marketing', to: '/admin/marketing', meta: 'Lead contacts', icon: '✦' },
  { label: 'Account', to: '/admin/account', meta: 'Security + profile', icon: '⚙' },
];

const getDownloadFilename = (response) => {
  const header = response.headers.get('content-disposition') || '';
  const match = header.match(/filename="([^"]+)"/i);
  return match?.[1] || 'lte-full-export.xlsx';
};

const AdminWebsitePage = () => {
  const [downloading, setDownloading] = useState(false);
  const [downloadingRecovery, setDownloadingRecovery] = useState(false);
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');

  const downloadFullExport = async () => {
    setDownloading(true);
    setStatus('');
    setError('');
    try {
      const response = await authFetch('/admin-portal/full-export', { scope: 'admin' });
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.message || data.err || 'Failed to generate full export.');
      }
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = getDownloadFilename(response);
      anchor.click();
      window.URL.revokeObjectURL(url);
      setStatus('Full export downloaded.');
    } catch (downloadError) {
      setError(downloadError.message || 'Failed to generate full export.');
    } finally {
      setDownloading(false);
    }
  };

  const downloadRecoveryExport = async () => {
    setDownloadingRecovery(true);
    setStatus('');
    setError('');
    try {
      const response = await authFetch('/admin-portal/full-recovery-export', { scope: 'admin' });
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.message || data.err || 'Failed to generate recovery export.');
      }
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = getDownloadFilename(response);
      anchor.click();
      window.URL.revokeObjectURL(url);
      setStatus('Recovery export downloaded.');
    } catch (downloadError) {
      setError(downloadError.message || 'Failed to generate recovery export.');
    } finally {
      setDownloadingRecovery(false);
    }
  };

  return (
    <section className="portal-page portal-admin-dashboard">
      <div className="portal-card portal-admin-tile-section">
        <div className="portal-section-head">
          <div>
            <div className="portal-brand-kicker">Website Control</div>
            <h1 className="portal-section-title portal-admin-panel-title">Catalog and site tools</h1>
          </div>
        </div>
        <div className="portal-card" style={{ marginTop: '1rem' }}>
          <div className="portal-section-head">
            <div>
              <div className="portal-brand-kicker">Manual Export</div>
              <h2 className="portal-section-title" style={{ fontSize: '1.45rem' }}>Download full system workbook</h2>
            </div>
            <button className="portal-inline-button secondary" type="button" onClick={downloadFullExport} disabled={downloading}>
              {downloading ? 'Preparing export...' : 'Download Full Export'}
            </button>
          </div>
          {status ? <div className="portal-message-banner success">{status}</div> : null}
          {error ? <div className="portal-message-banner">{error}</div> : null}
        </div>
        <div className="portal-card" style={{ marginTop: '1rem' }}>
          <div className="portal-section-head">
            <div>
              <div className="portal-brand-kicker">Recovery Export</div>
              <h2 className="portal-section-title" style={{ fontSize: '1.45rem' }}>Download round-trip recovery archive</h2>
            </div>
            <button className="portal-inline-button secondary" type="button" onClick={downloadRecoveryExport} disabled={downloadingRecovery}>
              {downloadingRecovery ? 'Preparing archive...' : 'Download Recovery Archive'}
            </button>
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
};

export default AdminWebsitePage;
