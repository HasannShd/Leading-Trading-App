// src/App.jsx

import './App.css';
import { Suspense, lazy, useContext, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import AppErrorBoundary from './components/AppErrorBoundary.jsx';
import Header from './components/Header/Header.jsx';
import Footer from './components/Footer/Footer.jsx';
import NotFoundPage from './components/NotFoundPage.jsx';
import ProtectedAdminRoute from './components/ProtectedAdminRoute';
import { AdminContext, AdminProvider } from './context/AdminContext';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import { StaffContext, StaffProvider } from './context/StaffContext';
import ProtectedStaffRoute from './components/ProtectedStaffRoute';
import { staffModuleConfigs, adminModuleConfigs } from './components/Portal/portalConfigs';
import PortalChatWidget from './components/Portal/PortalChatWidget';
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
const AdminPortalLayout = lazy(() => import('./components/Portal/AdminPortalLayout'));
const AdminDashboardPage = lazy(() => import('./components/Portal/AdminDashboardPage'));
const AdminMessagesPage = lazy(() => import('./components/Portal/AdminMessagesPage'));
const StaffLayout = lazy(() => import('./components/Portal/StaffLayout'));
const StaffLogin = lazy(() => import('./components/Portal/StaffLogin'));
const StaffDashboard = lazy(() => import('./components/Portal/StaffDashboard'));
const StaffAttendance = lazy(() => import('./components/Portal/StaffAttendance'));
const StaffNotificationsPage = lazy(() => import('./components/Portal/StaffNotificationsPage'));
const StaffResourcePage = lazy(() => import('./components/Portal/StaffResourcePage'));
const StaffOrdersPage = lazy(() => import('./components/Portal/StaffOrdersPage'));
const AdminStaffPage = lazy(() => import('./components/Portal/AdminStaffPage'));
const AdminResourcePage = lazy(() => import('./components/Portal/AdminResourcePage'));

const AppShell = () => {
  const location = useLocation();
  const { admin } = useContext(AdminContext);
  const { staff } = useContext(StaffContext);
  const isHeroPage = location.pathname === '/';
  const isAdminRoute = location.pathname.startsWith('/admin');
  const isPortalRoute = isAdminRoute || location.pathname.startsWith('/staff');
  const showAdminChat =
    admin &&
    isAdminRoute &&
    !location.pathname.endsWith('/login');
  const showStaffChat = staff && location.pathname.startsWith('/staff') && location.pathname !== '/staff/login';

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

            {/* Legacy hidden admin paths now redirect into the visible admin portal */}
            <Route path="/.well-known/admin-access-sh123456" element={<Navigate to="/admin/login" replace />} />
            <Route path="/.well-known/admin-dashboard-sh123456" element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="/.well-known/admin-categories-sh123456" element={<Navigate to="/admin/catalog/categories" replace />} />
            <Route path="/.well-known/admin-products-sh123456" element={<Navigate to="/admin/catalog/products" replace />} />
            <Route path="/.well-known/admin-import-sh123456" element={<Navigate to="/admin/catalog/import" replace />} />
            <Route path="/.well-known/admin-orders-sh123456" element={<Navigate to="/admin/site-orders" replace />} />
            <Route path="/.well-known/admin-orders/:id" element={<Navigate to="/admin/site-orders" replace />} />
            <Route path="/.well-known/admin-marketing-sh123456" element={<Navigate to="/admin/marketing" replace />} />
            <Route path="/.well-known/admin-account-sh123456" element={<Navigate to="/admin/account" replace />} />

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
              <Route path="notifications" element={<StaffNotificationsPage />} />
            </Route>

            {/* Visible admin routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<ProtectedAdminRoute element={<AdminPortalLayout />} />}>
              <Route index element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="dashboard" element={<AdminDashboardPage />} />
              <Route path="catalog" element={<Navigate to="/admin/catalog/products" replace />} />
              <Route path="catalog/categories" element={<AdminCategories />} />
              <Route path="catalog/products" element={<AdminProducts />} />
              <Route path="catalog/import" element={<AdminImportProducts />} />
              <Route path="site-orders" element={<AdminOrders />} />
              <Route path="site-orders/:id" element={<AdminOrderDetails />} />
              <Route path="marketing" element={<AdminMarketing />} />
              <Route path="account" element={<AdminAccount />} />
              <Route path="staff" element={<AdminStaffPage />} />
              <Route path="messages" element={<AdminMessagesPage />} />
              <Route path="attendance" element={<AdminResourcePage config={{ ...adminModuleConfigs.attendance, exportKey: 'attendance' }} />} />
              <Route path="reports" element={<AdminResourcePage config={{ ...adminModuleConfigs.reports, exportKey: 'reports' }} />} />
              <Route path="orders" element={<AdminResourcePage config={{ ...adminModuleConfigs.orders, exportKey: 'orders' }} />} />
              <Route path="clients" element={<AdminResourcePage config={adminModuleConfigs.clients} />} />
              <Route path="visits" element={<AdminResourcePage config={{ ...adminModuleConfigs.visits, exportKey: 'visits' }} />} />
              <Route path="notifications" element={<AdminResourcePage config={adminModuleConfigs.notifications} />} />
              <Route path="logs" element={<AdminResourcePage config={adminModuleConfigs.logs} />} />
            </Route>
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </main>
      {showAdminChat ? <PortalChatWidget role="admin" /> : null}
      {showStaffChat ? <PortalChatWidget role="sales_staff" /> : null}
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
      <AppErrorBoundary>
        <ScrollToTop />
        <AuthProvider>
          <AdminProvider>
            <StaffProvider>
              <AppShell />
            </StaffProvider>
          </AdminProvider>
        </AuthProvider>
      </AppErrorBoundary>
    </Router>
  );
}
