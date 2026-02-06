import { Link } from 'react-router-dom';

export function HomePage() {
  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-bg">
          <div className="hero-gradient"></div>
          <div className="hero-grid"></div>
        </div>
        <div className="hero-content">
          <div className="hero-badge">
            <span className="badge-dot"></span>
            Intelligent Workout Planning
          </div>
          <h1 className="hero-title">
            Build Your
            <span className="text-accent"> Perfect</span>
            <br />
            Gym Routine
          </h1>
          <p className="hero-description">
            Visualize muscle engagement, balance your training, and create
            weekly routines that actually work. Drag, drop, and dominate.
          </p>
          <div className="hero-cta">
            <Link to="/builder" className="btn-primary btn-lg">
              Start Building
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="5" y1="12" x2="19" y2="12"/>
                <polyline points="12 5 19 12 12 19"/>
              </svg>
            </Link>
            <Link to="/exercises" className="btn-outline btn-lg">
              Browse Exercises
            </Link>
          </div>
          <div className="hero-stats">
            <div className="stat">
              <span className="stat-value">1300+</span>
              <span className="stat-label">Exercises</span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat">
              <span className="stat-value">16</span>
              <span className="stat-label">Muscle Groups</span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat">
              <span className="stat-value">7</span>
              <span className="stat-label">Day Planning</span>
            </div>
          </div>
        </div>
        <div className="hero-visual">
          <div className="hero-card hero-card-1">
            <div className="mini-calendar">
              <div className="cal-header">Weekly Plan</div>
              <div className="cal-days">
                {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
                  <div key={i} className={`cal-day ${i < 5 ? 'active' : ''}`}>{d}</div>
                ))}
              </div>
            </div>
          </div>
          <div className="hero-card hero-card-2">
            <div className="mini-muscle">
              <div className="muscle-dot muscle-chest"></div>
              <div className="muscle-dot muscle-arms"></div>
              <div className="muscle-dot muscle-legs"></div>
              <svg viewBox="0 0 100 160" className="body-silhouette">
                <ellipse cx="50" cy="20" rx="15" ry="18" fill="currentColor" opacity="0.3"/>
                <rect x="35" y="38" width="30" height="45" rx="5" fill="currentColor" opacity="0.3"/>
                <rect x="20" y="40" width="12" height="40" rx="4" fill="currentColor" opacity="0.3"/>
                <rect x="68" y="40" width="12" height="40" rx="4" fill="currentColor" opacity="0.3"/>
                <rect x="35" y="85" width="12" height="50" rx="4" fill="currentColor" opacity="0.3"/>
                <rect x="53" y="85" width="12" height="50" rx="4" fill="currentColor" opacity="0.3"/>
              </svg>
            </div>
          </div>
          <div className="hero-card hero-card-3">
            <div className="mini-exercise">
              <div className="exercise-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M6.5 6.5h11M6.5 17.5h11M4 10h2.5v4H4zM17.5 10H20v4h-2.5zM6.5 11h11v2h-11z"/>
                </svg>
              </div>
              <span>Bench Press</span>
              <span className="exercise-sets">4 x 8</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="features-container">
          <div className="section-header">
            <span className="section-tag">Features</span>
            <h2 className="section-title">
              Everything You Need to
              <span className="text-accent"> Train Smarter</span>
            </h2>
          </div>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                  <line x1="16" y1="2" x2="16" y2="6"/>
                  <line x1="8" y1="2" x2="8" y2="6"/>
                  <line x1="3" y1="10" x2="21" y2="10"/>
                  <path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01"/>
                </svg>
              </div>
              <h3>Weekly Planner</h3>
              <p>Drag and drop exercises across 7 days. Build balanced routines with visual feedback on muscle distribution.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z"/>
                  <line x1="16" y1="8" x2="2" y2="22"/>
                  <line x1="17.5" y1="15" x2="9" y2="15"/>
                </svg>
              </div>
              <h3>Muscle Heatmap</h3>
              <p>Real-time visualization shows which muscles you're training and helps prevent overtraining or imbalances.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <circle cx="11" cy="11" r="8"/>
                  <path d="m21 21-4.35-4.35"/>
                  <path d="M11 8v6M8 11h6"/>
                </svg>
              </div>
              <h3>Exercise Library</h3>
              <p>Browse 1300+ exercises with GIF demonstrations, detailed instructions, and smart filtering by muscle or equipment.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                  <path d="m9 12 2 2 4-4"/>
                </svg>
              </div>
              <h3>Works Offline</h3>
              <p>Use as a guest with local storage, or create an account to sync your routines across devices.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-container">
          <div className="cta-content">
            <h2>Ready to Transform Your Training?</h2>
            <p>Start building your personalized workout routine today. No signup required.</p>
            <Link to="/builder" className="btn-primary btn-lg">
              Launch Routine Builder
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="5" y1="12" x2="19" y2="12"/>
                <polyline points="12 5 19 12 12 19"/>
              </svg>
            </Link>
          </div>
          <div className="cta-decoration">
            <div className="deco-ring deco-ring-1"></div>
            <div className="deco-ring deco-ring-2"></div>
            <div className="deco-ring deco-ring-3"></div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="site-footer">
        <div className="footer-container">
          <div className="footer-brand">
            <span className="brand-icon">
              <svg width="24" height="24" viewBox="0 0 32 32" fill="none">
                <rect x="2" y="12" width="28" height="8" rx="2" fill="currentColor"/>
                <rect x="6" y="8" width="4" height="16" rx="1" fill="currentColor"/>
                <rect x="22" y="8" width="4" height="16" rx="1" fill="currentColor"/>
              </svg>
            </span>
            <span>IronFlow &copy; 2026</span>
          </div>
          <div className="footer-copy">
            Built for lifters who take training seriously.
          </div>
        </div>
      </footer>
    </div>
  );
}
