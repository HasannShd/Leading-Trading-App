import './SkeletonGrid.css';

/**
 * Shimmer skeleton grid that mirrors the shop product card layout.
 * Used as a loading replacement for the shop product grid.
 */
export default function SkeletonGrid({ count = 12 }) {
  return (
    <div className="skeleton-grid" aria-busy="true" aria-label="Loading products">
      {Array.from({ length: count }).map((_, i) => (
        <div className="skeleton-card" key={i}>
          <div className="skeleton-media skeleton-shimmer" />
          <div className="skeleton-body">
            <div className="skeleton-row">
              <div className="skeleton-line skeleton-line--xs skeleton-shimmer" style={{ width: '38%' }} />
              <div className="skeleton-line skeleton-line--xs skeleton-shimmer" style={{ width: '22%' }} />
            </div>
            <div className="skeleton-line skeleton-shimmer" style={{ width: '90%' }} />
            <div className="skeleton-line skeleton-shimmer" style={{ width: '70%' }} />
            <div className="skeleton-line skeleton-shimmer" style={{ width: '55%' }} />
            <div className="skeleton-footer">
              <div className="skeleton-line skeleton-line--sm skeleton-shimmer" style={{ width: '32%' }} />
              <div className="skeleton-line skeleton-line--sm skeleton-shimmer" style={{ width: '24%' }} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
