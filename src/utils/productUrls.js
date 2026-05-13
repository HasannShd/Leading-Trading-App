export const slugify = (value = '') =>
  String(value)
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);

export const buildProductPath = (productOrId, fallbackName = '') => {
  const id = typeof productOrId === 'object'
    ? productOrId?._id || productOrId?.id
    : productOrId;
  if (!id) return '/shop';

  const name = typeof productOrId === 'object'
    ? productOrId?.name || productOrId?.slug || productOrId?.sku || fallbackName
    : fallbackName;
  const slug = slugify(name);
  return slug ? `/product/${id}/${slug}` : `/product/${id}`;
};
