import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <section className="dashboard-page animate-fadeIn">
      <div className="glass-card p-6 not-found-panel">
        <p className="chip chip-warning">404</p>
        <h1 className="page-title">Route Not Found</h1>
        <p className="section-subtitle">The requested BMS dashboard route is not available.</p>
        <Link className="btn btn-primary" to="/building">Return to Command Center</Link>
      </div>
    </section>
  );
}
