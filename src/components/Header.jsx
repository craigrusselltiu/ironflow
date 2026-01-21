export function Header({ onClearRoutine }) {
  return (
    <header className="app-header">
      <div className="header-content">
        <h1>IronFlow</h1>
        <p className="tagline">Build your perfect gym routine</p>
      </div>
      <button className="clear-btn" onClick={onClearRoutine}>
        Clear Routine
      </button>
    </header>
  );
}
