// src/App.jsx

import './App.css';
import { Suspense, lazy, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Header from './components/Header/Header.jsx';
import Footer from './components/Footer/Footer.jsx';
import ProtectedAdminRoute from './components/ProtectedAdminRoute';
import { AdminProvider } from './context/AdminContext';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import { StaffProvider } from './context/StaffContext';
import ProtectedStaffRoute from './components/ProtectedStaffRoute';
import { staffModuleConfigs, adminModuleConfigs } from './components/Portal/portalConfigs';
import './components/Portal/PortalShell.css';

const HomePage = lazy(() => import('./components/Homepage/Homepage'));
const Careers = lazy(() => import('./components/Careers/Careers'));
const CategoryDetails = lazy(() => import('./components/Categories/CategoryDetails'));
const ContactPage = lazy(() => import('./components/Contact/ContactPage'));
const Categories = lazy(() => import('./components/Categories/Categories'));
const About = lazy(() => import('./components/About/About'));
const Shop = lazy(() => import('./components/Shop/Shop'));
const ProductDetails = lazy(() => import('./components/Shop/ProductDetails'));
const Cart = lazy(() => import('./components/Cart/Cart'));
const Checkout = lazy(() => import('./components/Checkout/Checkout'));
const Orders = lazy(() => import('./components/Orders/Orders'));
const SignIn = lazy(() => import('./components/Auth/SignIn'));
const SignUp = lazy(() => import('./components/Auth/SignUp'));
const AdminLogin = lazy(() => import('./components/Admin/AdminLogin'));
const AdminDashboard = lazy(() => import('./components/Admin/AdminDashboard'));
const AdminCategories = lazy(() => import('./components/Admin/AdminCategories'));
const AdminProducts = lazy(() => import('./components/Admin/AdminProducts'));
const AdminImportProducts = lazy(() => import('./components/Admin/AdminImportProducts'));
const AdminOrders = lazy(() => import('./components/Admin/AdminOrders'));
const AdminMarketing = lazy(() => import('./components/Admin/AdminMarketing'));
const AdminOrderDetails = lazy(() => import('./components/Admin/AdminOrderDetails'));
const AdminAccount = lazy(() => import('./components/Admin/AdminAccount'));
const StaffLayout = lazy(() => import('./components/Portal/StaffLayout'));
const StaffLogin = lazy(() => import('./components/Portal/StaffLogin'));
const StaffDashboard = lazy(() => import('./components/Portal/StaffDashboard'));
const StaffAttendance = lazy(() => import('./components/Portal/StaffAttendance'));
const StaffNotificationsPage = lazy(() => import('./components/Portal/StaffNotificationsPage'));
const StaffMessagesPage = lazy(() => import('./components/Portal/StaffMessagesPage'));
const StaffResourcePage = lazy(() => import('./components/Portal/StaffResourcePage'));
const StaffOrdersPage = lazy(() => import('./components/Portal/StaffOrdersPage'));
const AdminStaffPage = lazy(() => import('./components/Portal/AdminStaffPage'));
const AdminResourcePage = lazy(() => import('./components/Portal/AdminResourcePage'));
const AdminMessagesPage = lazy(() => import('./components/Portal/AdminMessagesPage'));

const AppShell = () => {
  const location = useLocation();
  const isHeroPage = location.pathname === '/';
  const isAdminRoute = location.pathname.startsWith('/.well-known/') || location.pathname.startsWith('/admin');
  const isPortalRoute = isAdminRoute || location.pathname.startsWith('/staff');

  return (
    <div className={`app${isHeroPage ? ' hero-page' : ''}${isPortalRoute ? ' admin-app' : ''}`}>
      {!isPortalRoute && <Header />}
      <main className="app-main">
        <Suspense fallback={<div className="app-route-shell"><div className="app-route-shell-card">Loading workspace...</div></div>}>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/categories/:slug" element={<CategoryDetails />} />
            <Route path="/products" element={<Navigate to="/categories" replace />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/about" element={<About />} />
            <Route path="/careers" element={<Careers />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/sign-in" element={<SignIn />} />
            <Route path="/sign-up" element={<SignUp />} />

            {/* Protected customer routes */}
            <Route path="/checkout" element={<ProtectedRoute element={<Checkout />} />} />
            <Route path="/orders" element={<ProtectedRoute element={<Orders />} />} />

            {/* Admin Routes - Hidden */}
            <Route path="/.well-known/admin-access-sh123456" element={<AdminLogin />} />
            <Route path="/.well-known/admin-dashboard-sh123456" element={<ProtectedAdminRoute element={<AdminDashboard />} />} />
            <Route path="/.well-known/admin-categories-sh123456" element={<ProtectedAdminRoute element={<AdminCategories />} />} />
            <Route path="/.well-known/admin-products-sh123456" element={<ProtectedAdminRoute element={<AdminProducts />} />} />
            <Route path="/.well-known/admin-import-sh123456" element={<ProtectedAdminRoute element={<AdminImportProducts />} />} />
            <Route path="/.well-known/admin-orders-sh123456" element={<ProtectedAdminRoute element={<AdminOrders />} />} />
            <Route path="/.well-known/admin-orders/:id" element={<ProtectedAdminRoute element={<AdminOrderDetails />} />} />
            <Route path="/.well-known/admin-marketing-sh123456" element={<ProtectedAdminRoute element={<AdminMarketing />} />} />
            <Route path="/.well-known/admin-account-sh123456" element={<ProtectedAdminRoute element={<AdminAccount />} />} />

            {/* Staff portal */}
            <Route path="/staff/login" element={<StaffLogin />} />
            <Route
              path="/staff"
              element={<ProtectedStaffRoute element={<StaffLayout />} />}
            >
              <Route index element={<Navigate to="/staff/dashboard" replace />} />
              <Route path="dashboard" element={<StaffDashboard />} />
              <Route path="attendance" element={<StaffAttendance />} />
              <Route path="reports" element={<StaffResourcePage config={staffModuleConfigs.reports} />} />
              <Route path="orders" element={<StaffOrdersPage />} />
              <Route path="clients" element={<StaffResourcePage config={staffModuleConfigs.clients} />} />
              <Route path="visits" element={<StaffResourcePage config={staffModuleConfigs.visits} />} />
              <Route path="messages" element={<StaffMessagesPage />} />
              <Route path="notifications" element={<StaffNotificationsPage />} />
            </Route>

            {/* Visible admin routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="/admin/dashboard" element={<ProtectedAdminRoute element={<AdminDashboard />} />} />
            <Route path="/admin/catalog" element={<ProtectedAdminRoute element={<AdminDashboard />} />} />
            <Route path="/admin/catalog/categories" element={<ProtectedAdminRoute element={<AdminCategories />} />} />
            <Route path="/admin/catalog/products" element={<ProtectedAdminRoute element={<AdminProducts />} />} />
            <Route path="/admin/catalog/import" element={<ProtectedAdminRoute element={<AdminImportProducts />} />} />
            <Route path="/admin/site-orders" element={<ProtectedAdminRoute element={<AdminOrders />} />} />
            <Route path="/admin/site-orders/:id" element={<ProtectedAdminRoute element={<AdminOrderDetails />} />} />
            <Route path="/admin/marketing" element={<ProtectedAdminRoute element={<AdminMarketing />} />} />
            <Route path="/admin/account" element={<ProtectedAdminRoute element={<AdminAccount />} />} />
            <Route path="/admin/staff" element={<ProtectedAdminRoute element={<AdminStaffPage />} />} />
            <Route path="/admin/attendance" element={<ProtectedAdminRoute element={<AdminResourcePage config={{ ...adminModuleConfigs.attendance, exportKey: 'attendance' }} />} />} />
            <Route path="/admin/reports" element={<ProtectedAdminRoute element={<AdminResourcePage config={{ ...adminModuleConfigs.reports, exportKey: 'reports' }} />} />} />
            <Route path="/admin/orders" element={<ProtectedAdminRoute element={<AdminResourcePage config={{ ...adminModuleConfigs.orders, exportKey: 'orders' }} />} />} />
            <Route path="/admin/clients" element={<ProtectedAdminRoute element={<AdminResourcePage config={adminModuleConfigs.clients} />} />} />
            <Route path="/admin/visits" element={<ProtectedAdminRoute element={<AdminResourcePage config={{ ...adminModuleConfigs.visits, exportKey: 'visits' }} />} />} />
            <Route path="/admin/messages" element={<ProtectedAdminRoute element={<AdminMessagesPage />} />} />
            <Route path="/admin/notifications" element={<ProtectedAdminRoute element={<AdminResourcePage config={adminModuleConfigs.notifications} />} />} />
            <Route path="/admin/logs" element={<ProtectedAdminRoute element={<AdminResourcePage config={adminModuleConfigs.logs} />} />} />
          </Routes>
        </Suspense>
      </main>
      {!isPortalRoute && <Footer />}
    </div>
  );
};

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [pathname]);

  return null;
};

export default function App() {
  return (
    <Router>
      <ScrollToTop />
      <AuthProvider>
        <AdminProvider>
          <StaffProvider>
            <AppShell />
          </StaffProvider>
        </AdminProvider>
      </AuthProvider>
    </Router>
  );
}
