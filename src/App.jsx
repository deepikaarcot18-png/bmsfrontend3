import { BrowserRouter as Router, NavLink } from 'react-router-dom';
import AppRoutes from './routes.jsx';

function App() {
  return (
    <Router>
      <div className="app-shell">
        <aside className="sidebar">
          <div className="brand-lockup">
            <div className="brand-mark">BMS</div>
            <div>
              <strong>building</strong>
              <span>Command Suite</span>
            </div>
          </div>
          <nav className="sidebar-nav">
            <NavLink to="/building">Command Center</NavLink>
            <NavLink to="/floors">Floor Overview</NavLink>
            <NavLink to="/floor/1">Floor Dashboard</NavLink>
            <NavLink to="/client/11">Client Workspace</NavLink>
            <NavLink to="/scada/11-AHU">SCADA Diagnostics</NavLink>
          </nav>
          <div className="sidebar-footer">
            <span className="pulse-dot healthy" />
            <div>
              <strong>Live BMS Feed</strong>
              <span>Optimized telemetry</span>
            </div>
          </div>
        </aside>
        <main className="app-content">
          <header className="topbar">
            <div>
              <span className="eyebrow">Enterprise Building Management</span>
              <strong>Real-time operations dashboard</strong>
            </div>
            <div className="topbar-actions">
              <span className="chip chip-accent">Auto</span>
              <span className="chip chip-healthy">Online</span>
            </div>
          </header>
          <AppRoutes />
        </main>
      </div>
    </Router>
  );
}

export default App;
