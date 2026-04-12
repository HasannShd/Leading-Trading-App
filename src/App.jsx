// src/App.jsx

import './App.css';
import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Header from './components/Header/Header.jsx';
import Footer from './components/Footer/Footer.jsx';
import HomePage from './components/Homepage/Homepage';
import Careers from './components/Careers/Careers';
import CategoryDetails from './components/Categories/CategoryDetails';
import ContactPage from './components/Contact/ContactPage';
import Categories from './components/Categories/Categories';
import About from './components/About/About';
import Shop from './components/Shop/Shop';
import ProductDetails from './components/Shop/ProductDetails';
import Cart from './components/Cart/Cart';
import Checkout from './components/Checkout/Checkout';
import Orders from './components/Orders/Orders';
import SignIn from './components/Auth/SignIn';
import SignUp from './components/Auth/SignUp';
import AdminLogin from './components/Admin/AdminLogin';
import AdminDashboard from './components/Admin/AdminDashboard';
import AdminCategories from './components/Admin/AdminCategories';
import AdminProducts from './components/Admin/AdminProducts';
import AdminImportProducts from './components/Admin/AdminImportProducts';
import AdminOrders from './components/Admin/AdminOrders';
import AdminMarketing from './components/Admin/AdminMarketing';
import AdminOrderDetails from './components/Admin/AdminOrderDetails';
import AdminAccount from './components/Admin/AdminAccount';
import ProtectedAdminRoute from './components/ProtectedAdminRoute';
import { AdminProvider } from './context/AdminContext';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import { StaffProvider } from './context/StaffContext';
import ProtectedStaffRoute from './components/ProtectedStaffRoute';
import StaffLayout from './components/Portal/StaffLayout';
import StaffLogin from './components/Portal/StaffLogin';
import StaffDashboard from './components/Portal/StaffDashboard';
import StaffAttendance from './components/Portal/StaffAttendance';
import StaffNotificationsPage from './components/Portal/StaffNotificationsPage';
import StaffResourcePage from './components/Portal/StaffResourcePage';
import StaffOrdersPage from './components/Portal/StaffOrdersPage';
import AdminStaffPage from './components/Portal/AdminStaffPage';
import AdminResourcePage from './components/Portal/AdminResourcePage';
import { staffModuleConfigs, adminModuleConfigs } from './components/Portal/portalConfigs';
import './components/Portal/PortalShell.css';

const AppShell = () => {
  const location = useLocation();
  const isHeroPage = location.pathname === '/';
  const isAdminRoute = location.pathname.startsWith('/.well-known/') || location.pathname.startsWith('/admin');
  const isPortalRoute = isAdminRoute || location.pathname.startsWith('/staff');

  return (
    <div className={`app${isHeroPage ? ' hero-page' : ''}${isPortalRoute ? ' admin-app' : ''}`}>
      {!isPortalRoute && <Header />}
      <main className="app-main">
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
          <Route path="/admin/notifications" element={<ProtectedAdminRoute element={<AdminResourcePage config={adminModuleConfigs.notifications} />} />} />
          <Route path="/admin/logs" element={<ProtectedAdminRoute element={<AdminResourcePage config={adminModuleConfigs.logs} />} />} />
        </Routes>
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
