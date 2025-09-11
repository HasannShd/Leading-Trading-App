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
import About from './components/About/About'; // Import About component
import './components/Contact/ContactPage.css';

export default function App() {
  return (
    <Router>
      <div className="app">
        <Header />
        <main className="app-main">
          <Routes>
            <Route path="/" element={<HomePage />} />
            {/* No /categories page route, only dropdown */}
            <Route path="/categories/:slug" element={<CategoryDetails />} />
            <Route path="/products" element={<Categories />} />
            <Route path="/about" element={<About />} /> {/* Use About component in route */}
            <Route path="/careers" element={<Careers />} />
            <Route path="/contact" element={<ContactPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

