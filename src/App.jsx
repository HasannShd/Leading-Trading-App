// src/App.jsx

import './App.css';
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
import AdminPortalLayout from './components/Portal/AdminPortalLayout';
import StaffLogin from './components/Portal/StaffLogin';
import StaffDashboard from './components/Portal/StaffDashboard';
import StaffAttendance from './components/Portal/StaffAttendance';
import StaffSchedulePage from './components/Portal/StaffSchedulePage';
import StaffNotificationsPage from './components/Portal/StaffNotificationsPage';
import StaffResourcePage from './components/Portal/StaffResourcePage';
import AdminDashboardPage from './components/Portal/AdminDashboardPage';
import AdminStaffPage from './components/Portal/AdminStaffPage';
import AdminSchedulesPage from './components/Portal/AdminSchedulesPage';
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
          <Route path="/categories/:slug" element={<CategoryDetails />} />
          <Route path="/products" element={<Categories />} />
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
            <Route path="schedule" element={<StaffSchedulePage />} />
            <Route path="reports" element={<StaffResourcePage config={staffModuleConfigs.reports} />} />
            <Route path="orders" element={<StaffResourcePage config={staffModuleConfigs.orders} />} />
            <Route path="expenses" element={<StaffResourcePage config={staffModuleConfigs.expenses} />} />
            <Route path="clients" element={<StaffResourcePage config={staffModuleConfigs.clients} />} />
            <Route path="visits" element={<StaffResourcePage config={staffModuleConfigs.visits} />} />
            <Route path="followups" element={<StaffResourcePage config={staffModuleConfigs.followups} />} />
            <Route path="quotations" element={<StaffResourcePage config={staffModuleConfigs.quotations} />} />
            <Route path="collections" element={<StaffResourcePage config={staffModuleConfigs.collections} />} />
            <Route path="requests" element={<StaffResourcePage config={staffModuleConfigs.requests} />} />
            <Route path="demand" element={<StaffResourcePage config={staffModuleConfigs.demand} />} />
            <Route path="issues" element={<StaffResourcePage config={staffModuleConfigs.issues} />} />
            <Route path="notifications" element={<StaffNotificationsPage />} />
          </Route>

          {/* Admin operations portal */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<ProtectedAdminRoute element={<AdminPortalLayout />} />}>
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboardPage />} />
            <Route path="catalog" element={<AdminDashboard />} />
            <Route path="catalog/categories" element={<AdminCategories />} />
            <Route path="catalog/products" element={<AdminProducts />} />
            <Route path="catalog/import" element={<AdminImportProducts />} />
            <Route path="site-orders" element={<AdminOrders />} />
            <Route path="site-orders/:id" element={<AdminOrderDetails />} />
            <Route path="marketing" element={<AdminMarketing />} />
            <Route path="account" element={<AdminAccount />} />
            <Route path="staff" element={<AdminStaffPage />} />
            <Route path="attendance" element={<AdminResourcePage config={{ ...adminModuleConfigs.attendance, exportKey: 'attendance' }} />} />
            <Route path="schedules" element={<AdminSchedulesPage />} />
            <Route path="reports" element={<AdminResourcePage config={{ ...adminModuleConfigs.reports, exportKey: 'reports' }} />} />
            <Route path="orders" element={<AdminResourcePage config={{ ...adminModuleConfigs.orders, exportKey: 'orders' }} />} />
            <Route path="expenses" element={<AdminResourcePage config={{ ...adminModuleConfigs.expenses, exportKey: 'expenses' }} />} />
            <Route path="clients" element={<AdminResourcePage config={adminModuleConfigs.clients} />} />
            <Route path="visits" element={<AdminResourcePage config={{ ...adminModuleConfigs.visits, exportKey: 'visits' }} />} />
            <Route path="followups" element={<AdminResourcePage config={{ ...adminModuleConfigs.followups, exportKey: 'followups' }} />} />
            <Route path="quotations" element={<AdminResourcePage config={adminModuleConfigs.quotations} />} />
            <Route path="collections" element={<AdminResourcePage config={adminModuleConfigs.collections} />} />
            <Route path="requests" element={<AdminResourcePage config={adminModuleConfigs.requests} />} />
            <Route path="demand" element={<AdminResourcePage config={adminModuleConfigs.demand} />} />
            <Route path="issues" element={<AdminResourcePage config={adminModuleConfigs.issues} />} />
            <Route path="notifications" element={<AdminResourcePage config={adminModuleConfigs.notifications} />} />
            <Route path="logs" element={<AdminResourcePage config={adminModuleConfigs.logs} />} />
          </Route>
        </Routes>
      </main>
      {!isPortalRoute && <Footer />}
    </div>
  );
};

export default function App() {
  return (
    <Router>
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
