export const getAdminPaths = () => {
  return {
    login: '/admin/login',
    dashboard: '/admin/dashboard',
    catalogOverview: '/admin/catalog',
    categories: '/admin/catalog/categories',
    products: '/admin/catalog/products',
    import: '/admin/catalog/import',
    siteOrders: '/admin/site-orders',
    siteOrderDetails: (id) => `/admin/site-orders/${id}`,
    marketing: '/admin/marketing',
    account: '/admin/account',
  };
};
