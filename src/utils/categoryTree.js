export const asCategoryArray = (categories) => (Array.isArray(categories) ? categories : []);

export const getCategoryId = (category) => {
  if (!category) return '';
  const rawId = category._id || category.id || '';
  return typeof rawId === 'object' ? String(rawId._id || rawId.id || '') : String(rawId);
};

export const getCategoryParentId = (category) => {
  const parent = category?.parent;
  if (!parent) return '';
  if (typeof parent === 'object') return getCategoryId(parent);
  return String(parent);
};

export const buildCategoryTree = (categories) => {
  const categoryList = asCategoryArray(categories);
  const roots = categoryList.filter((category) => !getCategoryParentId(category));

  return roots.map((parent) => ({
    ...parent,
    children: categoryList.filter((category) => getCategoryParentId(category) === getCategoryId(parent)),
  }));
};

export const getLeafCategories = (categories) =>
  asCategoryArray(categories).filter((category) =>
    !asCategoryArray(categories).some((candidate) => getCategoryParentId(candidate) === getCategoryId(category))
  );
