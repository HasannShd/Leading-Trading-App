export const getAdminPaths = (isVisibleAdminRoute = false) => {
  if (isVisibleAdminRoute) {
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
  }

  return {
    login: '/.well-known/admin-access-sh123456',
    dashboard: '/.well-known/admin-dashboard-sh123456',
    catalogOverview: '/.well-known/admin-dashboard-sh123456',
    categories: '/.well-known/admin-categories-sh123456',
    products: '/.well-known/admin-products-sh123456',
    import: '/.well-known/admin-import-sh123456',
    siteOrders: '/.well-known/admin-orders-sh123456',
    siteOrderDetails: (id) => `/.well-known/admin-orders/${id}`,
    marketing: '/.well-known/admin-marketing-sh123456',
    account: '/.well-known/admin-account-sh123456',
  };
};
