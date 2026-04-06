export const getCategoryParentId = (category) => category?.parent?._id || category?.parent || '';

export const buildCategoryTree = (categories) => {
  const roots = categories.filter((category) => !getCategoryParentId(category));

  return roots.map((parent) => ({
    ...parent,
    children: categories.filter((category) => getCategoryParentId(category) === parent._id),
  }));
};

export const getLeafCategories = (categories) =>
  categories.filter((category) =>
    !categories.some((candidate) => getCategoryParentId(candidate) === category._id)
  );
