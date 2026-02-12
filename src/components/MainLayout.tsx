import { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export function MainLayout() {
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileUserMenuOpen, setMobileUserMenuOpen] = useState(false);

  return (
    <div className="app-layout">
      <nav className="main-nav">
        <div className="nav-container">
          <div className="nav-brand">
            <NavLink to="/" className="brand-link">
              <span className="brand-icon">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                  <rect x="2" y="12" width="28" height="8" rx="2" fill="currentColor"/>
                  <rect x="6" y="8" width="4" height="16" rx="1" fill="currentColor"/>
                  <rect x="22" y="8" width="4" height="16" rx="1" fill="currentColor"/>
                  <rect x="0" y="10" width="4" height="12" rx="1" fill="currentColor" opacity="0.6"/>
                  <rect x="28" y="10" width="4" height="12" rx="1" fill="currentColor" opacity="0.6"/>
                </svg>
              </span>
              <span className="brand-text">IronFlow</span>
            </NavLink>
          </div>

          <div className="nav-tabs">
            <NavLink to="/" end className={({ isActive }) => `nav-tab ${isActive ? 'active' : ''}`}>
              <span className="tab-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                  <polyline points="9 22 9 12 15 12 15 22"/>
                </svg>
              </span>
              Home
            </NavLink>
            <NavLink to="/builder" className={({ isActive }) => `nav-tab ${isActive ? 'active' : ''}`}>
              <span className="tab-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                  <line x1="16" y1="2" x2="16" y2="6"/>
                  <line x1="8" y1="2" x2="8" y2="6"/>
                  <line x1="3" y1="10" x2="21" y2="10"/>
                </svg>
              </span>
              Routine Builder
            </NavLink>
            <NavLink to="/exercises" className={({ isActive }) => `nav-tab ${isActive ? 'active' : ''}`}>
              <span className="tab-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8"/>
                  <path d="m21 21-4.35-4.35"/>
                </svg>
              </span>
              Exercises
            </NavLink>
          </div>

          <button
            className="mobile-menu-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {mobileMenuOpen ? (
                <path d="M18 6L6 18M6 6l12 12"/>
              ) : (
                <path d="M3 12h18M3 6h18M3 18h18"/>
              )}
            </svg>
          </button>

          {/* Mobile user button - visible only on mobile via CSS */}
          <div className="mobile-user-btn-wrapper">
            {isAuthenticated ? (
              <button
                className="mobile-user-btn"
                onClick={() => setMobileUserMenuOpen(!mobileUserMenuOpen)}
                aria-label="User menu"
              >
                <span className="user-avatar">{user?.name?.charAt(0).toUpperCase()}</span>
              </button>
            ) : (
              <NavLink to="/login" className="mobile-user-btn" aria-label="Sign in">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
              </NavLink>
            )}
            {mobileUserMenuOpen && isAuthenticated && (
              <>
                <div className="mobile-user-backdrop" onClick={() => setMobileUserMenuOpen(false)} />
                <div className="mobile-user-dropdown">
                  <div className="mobile-user-dropdown-name">
                    <span className="user-avatar">{user?.name?.charAt(0).toUpperCase()}</span>
                    {user?.name}
                  </div>
                  <button
                    className="mobile-user-dropdown-item"
                    onClick={() => { logout(); setMobileUserMenuOpen(false); }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                      <polyline points="16 17 21 12 16 7"/>
                      <line x1="21" y1="12" x2="9" y2="12"/>
                    </svg>
                    Sign Out
                  </button>
                </div>
              </>
            )}
          </div>

          <div className="nav-actions">
            {isAuthenticated ? (
              <>
                <span className="user-greeting">
                  <span className="user-avatar">{user?.name?.charAt(0).toUpperCase()}</span>
                  {user?.name}
                </span>
                <button className="btn-ghost" onClick={logout}>
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <NavLink to="/login" className="btn-ghost">
                  Sign In
                </NavLink>
                <NavLink to="/register" className="btn-accent">
                  Get Started
                </NavLink>
              </>
            )}
          </div>
        </div>

        {/* Mobile Menu - only used on tablet (768-1024px) */}
        {mobileMenuOpen && (
          <div className="mobile-menu">
            <NavLink
              to="/"
              end
              className={({ isActive }) => `mobile-menu-item ${isActive ? 'active' : ''}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                <polyline points="9 22 9 12 15 12 15 22"/>
              </svg>
              Home
            </NavLink>
            <NavLink
              to="/builder"
              className={({ isActive }) => `mobile-menu-item ${isActive ? 'active' : ''}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
              Routine Builder
            </NavLink>
            <NavLink
              to="/exercises"
              className={({ isActive }) => `mobile-menu-item ${isActive ? 'active' : ''}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/>
                <path d="m21 21-4.35-4.35"/>
              </svg>
              Exercises
            </NavLink>
            <div className="mobile-menu-divider"></div>
            {isAuthenticated ? (
              <>
                <div className="mobile-menu-user">
                  <span className="user-avatar">{user?.name?.charAt(0).toUpperCase()}</span>
                  {user?.name}
                </div>
                <button className="mobile-menu-item" onClick={() => { logout(); setMobileMenuOpen(false); }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                    <polyline points="16 17 21 12 16 7"/>
                    <line x1="21" y1="12" x2="9" y2="12"/>
                  </svg>
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <NavLink
                  to="/login"
                  className="mobile-menu-item"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
                    <polyline points="10 17 15 12 10 7"/>
                    <line x1="15" y1="12" x2="3" y2="12"/>
                  </svg>
                  Sign In
                </NavLink>
                <NavLink
                  to="/register"
                  className="mobile-menu-item mobile-menu-cta"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                    <circle cx="8.5" cy="7" r="4"/>
                    <line x1="20" y1="8" x2="20" y2="14"/>
                    <line x1="23" y1="11" x2="17" y2="11"/>
                  </svg>
                  Get Started
                </NavLink>
              </>
            )}
          </div>
        )}
      </nav>

      <main className="main-content-area">
        <Outlet />
      </main>

      {/* Mobile Bottom Tab Bar - visible only on mobile via CSS */}
      <nav className="mobile-bottom-bar">
        <NavLink to="/" end className={({ isActive }) => `bottom-tab ${isActive ? 'active' : ''}`}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
            <polyline points="9 22 9 12 15 12 15 22"/>
          </svg>
          <span>Home</span>
        </NavLink>
        <NavLink to="/builder" className={({ isActive }) => `bottom-tab ${isActive ? 'active' : ''}`}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
            <line x1="16" y1="2" x2="16" y2="6"/>
            <line x1="8" y1="2" x2="8" y2="6"/>
            <line x1="3" y1="10" x2="21" y2="10"/>
          </svg>
          <span>Builder</span>
        </NavLink>
        <NavLink to="/exercises" className={({ isActive }) => `bottom-tab ${isActive ? 'active' : ''}`}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/>
            <path d="m21 21-4.35-4.35"/>
          </svg>
          <span>Exercises</span>
        </NavLink>
      </nav>
    </div>
  );
}
