// src/App.jsx

import './App.css';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
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
import AdminOrders from './components/Admin/AdminOrders';
import AdminMarketing from './components/Admin/AdminMarketing';
import AdminOrderDetails from './components/Admin/AdminOrderDetails';
import AdminAccount from './components/Admin/AdminAccount';
import ProtectedAdminRoute from './components/ProtectedAdminRoute';
import { AdminProvider } from './context/AdminContext';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import './components/Contact/ContactPage.css';

const AppShell = () => {
  const location = useLocation();
  const isHeroPage = location.pathname === '/';
  const isAdminRoute = location.pathname.startsWith('/.well-known/');

  return (
    <div className={`app${isHeroPage ? ' hero-page' : ''}${isAdminRoute ? ' admin-app' : ''}`}>
      {!isAdminRoute && <Header />}
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
          <Route path="/.well-known/admin-orders-sh123456" element={<ProtectedAdminRoute element={<AdminOrders />} />} />
          <Route path="/.well-known/admin-orders/:id" element={<ProtectedAdminRoute element={<AdminOrderDetails />} />} />
          <Route path="/.well-known/admin-marketing-sh123456" element={<ProtectedAdminRoute element={<AdminMarketing />} />} />
          <Route path="/.well-known/admin-account-sh123456" element={<ProtectedAdminRoute element={<AdminAccount />} />} />
        </Routes>
      </main>
      {!isAdminRoute && <Footer />}
    </div>
  );
};

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <AdminProvider>
          <AppShell />
        </AdminProvider>
      </AuthProvider>
    </Router>
  );
}
