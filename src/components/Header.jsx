import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export function Header({ onClearRoutine, showBrowseLink = true }) {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <header className="app-header">
      <div className="header-content">
        <h1>IronFlow</h1>
        <p className="tagline">Build your perfect gym routine</p>
      </div>
      <div className="header-actions">
        {showBrowseLink && (
          <Link to="/exercises" className="nav-link">
            Browse Exercises
          </Link>
        )}
        <button className="clear-btn" onClick={onClearRoutine}>
          Clear Routine
        </button>
        {isAuthenticated ? (
          <>
            <span className="user-info">{user?.name}</span>
            <button className="logout-btn" onClick={logout}>
              Logout
            </button>
          </>
        ) : (
          <Link to="/login" className="login-btn">
            Login
          </Link>
        )}
      </div>
    </header>
  );
}
