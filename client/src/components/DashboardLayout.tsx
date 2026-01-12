import { Link, Outlet, useLocation } from 'react-router-dom';
import { useState } from 'react';
import './DashboardLayout.css';

export default function DashboardLayout() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="dashboard-container">
      <button 
        className="mobile-menu-toggle"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        aria-label="Toggle menu"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          {mobileMenuOpen ? (
            <path d="M18 6L6 18M6 6l12 12" />
          ) : (
            <path d="M3 12h18M3 6h18M3 18h18" />
          )}
        </svg>
      </button>
      
      {mobileMenuOpen && (
        <div 
          className="mobile-overlay"
          onClick={() => setMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}
      
      <aside className={`sidebar ${mobileMenuOpen ? 'mobile-open' : ''}`}>
        <div className="sidebar-header">
          <div className="logo-container">
            <div className="logo">
              <svg viewBox="0 0 420 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="bagGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#60a5fa"/>
                    <stop offset="100%" stopColor="#3b82f6"/>
                  </linearGradient>
                </defs>
                <rect x="20" y="30" rx="12" ry="12" width="80" height="70" fill="url(#bagGradient)"/>
                <path d="M35 30 C35 15, 85 15, 85 30" stroke="#2563eb" strokeWidth="6" fill="none"/>
                <rect x="30" y="40" width="60" height="18" rx="4" fill="#FFFFFF"/>
                <path d="M30 40 h12 v18 h-12z M42 40 h12 v18 h-12z M54 40 h12 v18 h-12z M66 40 h12 v18 h-12z M78 40 h12 v18 h-12z" fill="#E5E7EB"/>
                <rect x="50" y="65" width="20" height="25" rx="3" fill="#FFFFFF"/>
                <text x="120" y="82" fontFamily="Inter, Segoe UI, Helvetica, Arial, sans-serif" fontSize="48" fontWeight="600" fill="#60a5fa">Shopio</text>
              </svg>
            </div>
          </div>
        </div>
        <nav className="sidebar-nav">
          <Link 
            to="/orders" 
            className={`nav-link ${isActive('/orders') ? 'active' : ''}`}
            onClick={() => setMobileMenuOpen(false)}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 11l3 3L22 4"></path>
              <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
            </svg>
            Orders
          </Link>
          <Link 
            to="/inventory" 
            className={`nav-link ${isActive('/inventory') ? 'active' : ''}`}
            onClick={() => setMobileMenuOpen(false)}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="9" y1="9" x2="15" y2="9"></line>
              <line x1="9" y1="15" x2="15" y2="15"></line>
            </svg>
            Inventory
          </Link>
          <Link 
            to="/catalog" 
            className={`nav-link ${isActive('/catalog') ? 'active' : ''}`}
            onClick={() => setMobileMenuOpen(false)}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <path d="M16 10a4 4 0 0 1-8 0"></path>
            </svg>
            Product Catalog
          </Link>
        </nav>
      </aside>
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}


