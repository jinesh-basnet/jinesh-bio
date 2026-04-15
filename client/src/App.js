import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import ErrorBoundary from './components/common/ErrorBoundary';
import Home from './pages/Home';
import Projects from './pages/Projects';
import Blog from './pages/Blog';
import BlogDetail from './pages/BlogDetail';
import Contact from './pages/Contact';
import Timeline from './pages/Timeline';
import Testimonials from './pages/Testimonials';
import Login from './pages/Login';
import Signup from './pages/Signup';
import { Navigate } from 'react-router-dom';
import Admin from './pages/Admin';
import AdminLogin from './pages/AdminLogin';
import ViewerDashboard from './pages/ViewerDashboard';
import NavBar from './components/layout/NavBar';
import Footer from './components/layout/Footer';
import BackToTop from './components/common/BackToTop';
import './App.css';

function AppContent() {
  const location = useLocation();
  const isAdminPath = location.pathname.startsWith('/admin') || location.pathname === '/admin-login';

  return (
    <div className="App">
      {!isAdminPath && <NavBar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<Navigate to="/#about" replace />} />
        {/* About is now integrated into Home as #about section */}
        <Route path="/projects" element={<Projects />} />
        <Route path="/timeline" element={<Timeline />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:slug" element={<BlogDetail />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/testimonials" element={<Testimonials />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/dashboard" element={<ViewerDashboard />} />
      </Routes>
      {!isAdminPath && <Footer />}
      {!isAdminPath && <BackToTop />}
      <ToastContainer />
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <Router>
            <AppContent />
          </Router>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
