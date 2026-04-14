import { useDeferredValue, useEffect, useMemo, useState } from 'react';
import AdminTopNav from './AdminTopNav';
import './AdminCategories.css';
import './AdminImport.css';
import { authFetch, API_URL } from '../../services/authFetch';

const parseCsvText = (text) => {
  const rows = [];
  let currentCell = '';
  let currentRow = [];
  let inQuotes = false;

  const pushCell = () => {
    currentRow.push(currentCell.trim());
    currentCell = '';
  };

  const pushRow = () => {
    if (currentRow.some((cell) => cell)) {
      rows.push(currentRow);
    }
    currentRow = [];
  };

  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    const nextChar = text[index + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        currentCell += '"';
        index += 1;
        continue;
      }
      inQuotes = !inQuotes;
      continue;
    }

    if (!inQuotes && char === ',') {
      pushCell();
      continue;
    }

    if (!inQuotes && (char === '\n' || char === '\r')) {
      pushCell();
      pushRow();
      if (char === '\r' && nextChar === '\n') {
        index += 1;
      }
      continue;
    }

    currentCell += char;
  }

  if (currentCell || currentRow.length) {
    pushCell();
    pushRow();
  }

  return rows;
};

const AdminImportProducts = () => {
  const [categories, setCategories] = useState([]);
  const [columns, setColumns] = useState([]);
  const [rows, setRows] = useState([]);
  const [nameCol, setNameCol] = useState('');
  const [categoryCol, setCategoryCol] = useState('');
  const [categorySlugCol, setCategorySlugCol] = useState('');
  const [brandCol, setBrandCol] = useState('');
  const [imageCol, setImageCol] = useState('');
  const [priceCol, setPriceCol] = useState('');
  const [descriptionCol, setDescriptionCol] = useState('');
  const [useHeadings, setUseHeadings] = useState(true);
  const [createMissing, setCreateMissing] = useState(false);
  const [error, setError] = useState('');
  const [status, setStatus] = useState('');
  const [importing, setImporting] = useState(false);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${API_URL}/categories`);
        const data = await response.json();
        setCategories(Array.isArray(data) ? data : []);
      } catch (err) {
        setError('Failed to load categories');
      }
    };
    fetchCategories();
  }, []);

  const normalize = (value) =>
    String(value || '')
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

  const categoryMap = useMemo(() => {
    const map = new Map();
    categories.forEach(cat => {
      if (cat?.name) map.set(normalize(cat.name), cat._id);
      if (cat?.slug) map.set(normalize(cat.slug), cat._id);
    });
    return map;
  }, [categories]);

  const colLabel = (index) => {
    const letter = String.fromCharCode(65 + (index % 26));
    const prefix = index >= 26 ? String.fromCharCode(64 + Math.floor(index / 26)) : '';
    return `${prefix}${letter}`;
  };

  const detectHeader = (row) => {
    const values = row.map(cell => String(cell || '').toLowerCase());
    const hasCategory = values.some(v => v.includes('category'));
    const hasName = values.some(v => v.includes('product') || v.includes('name') || v.includes('item'));
    return hasCategory || hasName;
  };

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError('');
    setStatus('');
    setRows([]);
    setColumns([]);
    setNameCol('');
    setCategoryCol('');
    setCategorySlugCol('');
    setBrandCol('');
    setImageCol('');
    setPriceCol('');
    setDescriptionCol('');

    try {
      if (!file.name.toLowerCase().endsWith('.csv')) {
        setError('Only CSV imports are supported now. Export the spreadsheet as .csv and upload it again.');
        return;
      }

      const text = await file.text();
      const raw = parseCsvText(text.replace(/^\uFEFF/, ''));
      const cleaned = raw
        .map(row => row.map(cell => (cell ?? '').toString().trim()))
        .filter(row => row.some(cell => cell));

      if (!cleaned.length) {
        setError('No rows found in file.');
        return;
      }

      const headerPresent = detectHeader(cleaned[0]);
      const maxCols = Math.max(...cleaned.map(r => r.length), 0);
      const headerRow = cleaned[0] || [];
      const options = Array.from({ length: maxCols }, (_, i) => ({
        value: String(i),
        label: headerPresent ? (headerRow[i] || `Column ${colLabel(i)}`) : `Column ${colLabel(i)}`,
      }));

      setColumns(options);
      setRows(cleaned.slice(headerPresent ? 1 : 0));

      const findByLabel = (needle) =>
        options.find(opt => opt.label.toLowerCase().includes(needle))?.value ?? '';

      const defaultName = findByLabel('product') || findByLabel('name') || findByLabel('item') || '0';
      const defaultCategory = findByLabel('category') || (maxCols > 1 ? '1' : '');
      setNameCol(defaultName);
      setCategoryCol(defaultCategory);
      setCategorySlugCol(findByLabel('categoryslug') || findByLabel('category slug') || '');
      setBrandCol(findByLabel('brand') || '');
      setImageCol(findByLabel('image') || '');
      setPriceCol(findByLabel('price') || findByLabel('baseprice') || findByLabel('base price') || '');
      setDescriptionCol(findByLabel('description') || findByLabel('desc') || '');
    } catch (err) {
      setError('Failed to read the file. Please upload a valid CSV file.');
    }
  };

  const parsedRows = useMemo(() => {
    if (nameCol === '') return [];
    const nameIndex = Number(nameCol);
    const categoryIndex = categoryCol === '' ? null : Number(categoryCol);
    const categorySlugIndex = categorySlugCol === '' ? null : Number(categorySlugCol);
    const brandIndex = brandCol === '' ? null : Number(brandCol);
    const imageIndex = imageCol === '' ? null : Number(imageCol);
    const priceIndex = priceCol === '' ? null : Number(priceCol);
    const descriptionIndex = descriptionCol === '' ? null : Number(descriptionCol);
    let currentCategoryId = '';
    let currentCategoryRaw = '';

    return rows.reduce((acc, row) => {
      const name = String(row[nameIndex] || '').trim();
      const categoryRaw = categoryIndex === null ? '' : String(row[categoryIndex] || '').trim();
      const categorySlugRaw = categorySlugIndex === null ? '' : String(row[categorySlugIndex] || '').trim();
      const categoryLookup = categorySlugRaw || categoryRaw;
      const categoryIdDirect = categoryMap.get(normalize(categoryLookup)) || '';
      const categoryIdFromName = categoryMap.get(normalize(name)) || '';
      const brand = brandIndex === null ? '' : String(row[brandIndex] || '').trim();
      const image = imageIndex === null ? '' : String(row[imageIndex] || '').trim();
      const basePrice = priceIndex === null ? '' : String(row[priceIndex] || '').trim();
      const description = descriptionIndex === null ? '' : String(row[descriptionIndex] || '').trim();

      if (!categoryRaw && useHeadings && categoryIdFromName) {
        currentCategoryId = categoryIdFromName;
        currentCategoryRaw = name;
        return acc;
      }

      const finalCategoryId = categoryIdDirect || (useHeadings ? currentCategoryId : '');
      const finalCategoryRaw = categoryRaw || categorySlugRaw || (useHeadings ? currentCategoryRaw : '');
      if (!name && !finalCategoryRaw) return acc;

      acc.push({
        name,
        categoryRaw: finalCategoryRaw,
        categoryId: finalCategoryId,
        brand,
        image,
        basePrice,
        description,
      });
      return acc;
    }, []);
  }, [rows, nameCol, categoryCol, categorySlugCol, brandCol, imageCol, priceCol, descriptionCol, categoryMap, useHeadings]);
  const deferredParsedRows = useDeferredValue(parsedRows);

  const matchedRows = parsedRows.filter(row => row.name && row.categoryId);
  const unmatchedRows = parsedRows.filter(row => row.name && !row.categoryId);
  const creatableRows = parsedRows.filter(row => row.name && row.categoryRaw);
  const importReadyCount = createMissing ? creatableRows.length : matchedRows.length;

  const handleImport = async () => {
    setImporting(true);
    setError('');
    setStatus('');
    try {
      let mergedCategoryMap = categoryMap;
      if (createMissing) {
        const missingNames = Array.from(new Set(
          parsedRows
            .filter(row => row.name && row.categoryRaw && !row.categoryId)
            .map(row => row.categoryRaw)
        ));
        if (missingNames.length > 0) {
          const created = await Promise.all(missingNames.map(async (name) => {
            const response = await authFetch('/categories', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              scope: 'admin',
              body: JSON.stringify({ name }),
            });
            const data = await response.json().catch(() => ({}));
            if (!response.ok) {
              throw new Error(data.message || `Failed to create category "${name}"`);
            }
            return data;
          }));
          const nextMap = new Map(categoryMap);
          created.forEach(cat => {
            if (cat?.name) nextMap.set(normalize(cat.name), cat._id);
            if (cat?.slug) nextMap.set(normalize(cat.slug), cat._id);
          });
          mergedCategoryMap = nextMap;
        }
      }

      const items = parsedRows
        .filter(row => row.name)
        .map(row => {
          const categoryId = row.categoryId || mergedCategoryMap.get(normalize(row.categoryRaw)) || '';
          return { ...row, categoryId };
        })
        .filter(row => row.categoryId)
        .map(row => ({
          name: row.name,
          categorySlug: row.categoryId,
          brand: row.brand || undefined,
          image: row.image || undefined,
          basePrice: row.basePrice || undefined,
          description: row.description || undefined,
          featured: false,
          isActive: true,
        }));

      if (!items.length) {
        setError(createMissing ? 'No rows with category names available to import.' : 'No matched rows to import.');
        return;
      }

      const response = await authFetch('/products/import', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        scope: 'admin',
        body: JSON.stringify({
          items,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.message || 'Import failed.');
        return;
      }
      setStatus(`Imported ${data.inserted ?? items.length} products.`);
    } catch (err) {
      setError(err?.message || 'Import failed. Please try again.');
    } finally {
      setImporting(false);
    }
  };

  const handleDownload = async () => {
    setDownloading(true);
    setError('');
    setStatus('');
    try {
      const response = await authFetch('/products/admin/export', { scope: 'admin' });
      if (!response.ok) {
        const data = await response.json().catch(() => null);
        setError(data?.message || 'Download failed.');
        return;
      }
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'products-categories.xlsx';
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      setStatus('Downloaded current product list.');
    } catch (err) {
      setError('Download failed. Please try again.');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="admin-import admin-surface">
      <AdminTopNav />
      <div className="admin-import-shell">
        <section className="admin-surface-hero">
          <div className="admin-surface-eyebrow">Catalog Operations</div>
          <div className="admin-surface-hero-row">
            <div className="admin-surface-copy">
              <h1>Import products with a cleaner mapping workflow.</h1>
              <p>
                Upload a spreadsheet, map the columns once, and review matched versus unmatched rows before importing into the visible catalog.
              </p>
            </div>
            {rows.length > 0 && (
              <div className="admin-surface-actions">
                <div className="admin-import-badge">
                  {rows.length.toLocaleString()} source rows loaded
                </div>
              </div>
            )}
          </div>
          <div className="admin-surface-stats">
            <div className="admin-surface-stat">
              <strong>{parsedRows.length}</strong>
              <span>Parsed rows</span>
            </div>
            <div className="admin-surface-stat">
              <strong>{matchedRows.length}</strong>
              <span>Matched rows</span>
            </div>
            <div className="admin-surface-stat">
              <strong>{unmatchedRows.length}</strong>
              <span>Unmatched rows</span>
            </div>
            <div className="admin-surface-stat">
              <strong>{importReadyCount}</strong>
              <span>Ready to import</span>
            </div>
          </div>
        </section>

        {error && <div className="admin-error">{error}</div>}
        {status && <div className="admin-success">{status}</div>}

        <div className="admin-surface-grid">
          <div className="admin-side-stack">
        <div className="admin-import-panel">
          <div className="admin-import-upload">
            <label className="admin-import-label">Upload CSV</label>
            <input type="file" accept=".csv,text/csv" onChange={handleFile} />
            <p className="admin-import-help">
              Upload a CSV export that includes a product name column and a category column.
              Categories are matched to the existing categories in the website by name or slug.
            </p>
            <button
              className="admin-btn-secondary"
              type="button"
              onClick={handleDownload}
              disabled={downloading}
            >
              {downloading ? 'Downloading...' : 'Download current list'}
            </button>
          </div>

          {rows.length > 0 && (
            <div className="admin-import-map">
              <div className="admin-import-field">
                <label>Product name column</label>
                <select value={nameCol} onChange={(e) => setNameCol(e.target.value)}>
                  <option value="">Select column</option>
                  {columns.map(col => (
                    <option key={`name-${col.value}`} value={col.value}>{col.label}</option>
                  ))}
                </select>
              </div>
              <div className="admin-import-field">
                <label>Category column</label>
                <select value={categoryCol} onChange={(e) => setCategoryCol(e.target.value)}>
                  <option value="">Select column</option>
                  {columns.map(col => (
                    <option key={`cat-${col.value}`} value={col.value}>{col.label}</option>
                  ))}
                </select>
              </div>
              <div className="admin-import-field">
                <label>Category slug column (optional)</label>
                <select value={categorySlugCol} onChange={(e) => setCategorySlugCol(e.target.value)}>
                  <option value="">Select column</option>
                  {columns.map(col => (
                    <option key={`catslug-${col.value}`} value={col.value}>{col.label}</option>
                  ))}
                </select>
              </div>
              <div className="admin-import-field">
                <label>Brand column (optional)</label>
                <select value={brandCol} onChange={(e) => setBrandCol(e.target.value)}>
                  <option value="">Select column</option>
                  {columns.map(col => (
                    <option key={`brand-${col.value}`} value={col.value}>{col.label}</option>
                  ))}
                </select>
              </div>
              <div className="admin-import-field">
                <label>Image column (optional)</label>
                <select value={imageCol} onChange={(e) => setImageCol(e.target.value)}>
                  <option value="">Select column</option>
                  {columns.map(col => (
                    <option key={`image-${col.value}`} value={col.value}>{col.label}</option>
                  ))}
                </select>
              </div>
              <div className="admin-import-field">
                <label>Price column (optional)</label>
                <select value={priceCol} onChange={(e) => setPriceCol(e.target.value)}>
                  <option value="">Select column</option>
                  {columns.map(col => (
                    <option key={`price-${col.value}`} value={col.value}>{col.label}</option>
                  ))}
                </select>
              </div>
              <div className="admin-import-field">
                <label>Description column (optional)</label>
                <select value={descriptionCol} onChange={(e) => setDescriptionCol(e.target.value)}>
                  <option value="">Select column</option>
                  {columns.map(col => (
                    <option key={`desc-${col.value}`} value={col.value}>{col.label}</option>
                  ))}
                </select>
              </div>
              <label className="admin-import-checkbox">
                <input
                  type="checkbox"
                  checked={useHeadings}
                  onChange={(e) => setUseHeadings(e.target.checked)}
                />
                Treat category-only rows as section headings (useful for lists grouped by category)
              </label>
              <label className="admin-import-checkbox">
                <input
                  type="checkbox"
                  checked={createMissing}
                  onChange={(e) => setCreateMissing(e.target.checked)}
                />
                Create missing categories from the file before importing
              </label>
            </div>
          )}

        {parsedRows.length > 0 && (
          <div className="admin-import-summary">
            <div>
              <strong>Total rows:</strong> {parsedRows.length}
            </div>
            <div>
              <strong>Matched:</strong> {matchedRows.length}
            </div>
            <div>
              <strong>Unmatched:</strong> {unmatchedRows.length}
            </div>
            <button
              className="admin-btn-primary"
              onClick={handleImport}
              disabled={importing || importReadyCount === 0}
            >
              {importing ? 'Importing...' : createMissing ? 'Create Categories & Import Products' : 'Import Matched Products'}
            </button>
          </div>
        )}

          {parsedRows.length > 0 && (
            <div className="admin-import-preview">
              <div className="admin-import-preview-header">
                <div>
                  <h3>Imported File Preview</h3>
                  <p className="admin-import-help">
                    Showing all {parsedRows.length.toLocaleString()} parsed rows from the uploaded file.
                  </p>
                </div>
              </div>
              <div className="categories-table-wrapper admin-import-table-wrap">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Category</th>
                      <th>Matched</th>
                    </tr>
                  </thead>
                  <tbody>
                    {deferredParsedRows.map((row, index) => (
                      <tr key={`${row.name}-${index}`}>
                        <td>{row.name || '-'}</td>
                        <td>{row.categoryRaw || '-'}</td>
                        <td>{row.categoryId ? 'Yes' : 'No'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {unmatchedRows.length > 0 && (
                <p className="admin-import-warning">
                  Unmatched rows are skipped. Update your category names or fix the file and re-upload.
                  {createMissing && ' Missing categories will be created on import.'}
                </p>
              )}
            </div>
          )}
        </div>
          </div>
          <aside className="admin-side-stack">
            <div className="admin-note-card">
              <h3>Import Checklist</h3>
              <ul>
                <li>Make sure the file has a reliable product name column and category column.</li>
                <li>Check unmatched rows before importing so products do not disappear into the wrong category.</li>
                <li>Use “create missing categories” only when the file structure is already clean.</li>
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default AdminImportProducts;
