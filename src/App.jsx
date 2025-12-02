// src/App.jsx

import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header/Header.jsx';
import Footer from './components/Footer/Footer.jsx';
import HomePage from './components/Homepage/Homepage';
import Careers from './components/Careers/Careers';
import CategoryDetails from './components/Categories/CategoryDetails';
import ContactPage from './components/Contact/ContactPage';
import Categories from './components/Categories/Categories';
import About from './components/About/About';
import AdminLogin from './components/Admin/AdminLogin';
import AdminDashboard from './components/Admin/AdminDashboard';
import AdminCategories from './components/Admin/AdminCategories';
import AdminProducts from './components/Admin/AdminProducts';
import ProtectedAdminRoute from './components/ProtectedAdminRoute';
import { AdminProvider } from './context/AdminContext';
import './components/Contact/ContactPage.css';

export default function App() {
  return (
    <Router>
      <AdminProvider>
        <div className="app">
          <Header />
          <main className="app-main">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/categories/:slug" element={<CategoryDetails />} />
              <Route path="/products" element={<Categories />} />
              <Route path="/about" element={<About />} />
              <Route path="/careers" element={<Careers />} />
              <Route path="/contact" element={<ContactPage />} />

              {/* Admin Routes - Hidden */}
              <Route path="/.well-known/admin-access-sh123456" element={<AdminLogin />} />
              <Route path="/.well-known/admin-dashboard-sh123456" element={<ProtectedAdminRoute element={<AdminDashboard />} />} />
              <Route path="/.well-known/admin-categories-sh123456" element={<ProtectedAdminRoute element={<AdminCategories />} />} />
              <Route path="/.well-known/admin-products-sh123456" element={<ProtectedAdminRoute element={<AdminProducts />} />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </AdminProvider>
    </Router>
  );
}

