import { useCallback, useContext, useMemo } from 'react';
import { BmsContext } from '../context/BmsContext';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner.jsx';

export default function FloorOverview() {
  const { state } = useContext(BmsContext);
  const navigate = useNavigate();
  const floors = useMemo(() => Object.values(state.floors || {}), [state.floors]);
  const handleClick = useCallback((floorId) => {
    navigate(`/floor/${floorId}`);
  }, [navigate]);

  if (!state.floors) return <LoadingSpinner />;

  return (
    <section className="dashboard-page animate-fadeIn">
      <div className="section-header">
        <div>
          <h1 className="page-title">Floor Overview</h1>
          <p className="section-subtitle">Twenty floors with live load, energy, health and alarm density</p>
        </div>
      </div>
      <div className="grid-4">
        {floors.map((floor) => (
          <button
            key={floor.id}
            type="button"
            className={`glass-card-sm floor-card floor-${floor.status}`}
            onClick={() => handleClick(floor.id)}
          >
            <div className="flex-between mb-4">
              <span className="text-lg font-semibold text-primary">{floor.name}</span>
              <span className={`chip chip-${floor.status}`}>{floor.status}</span>
            </div>
            <div className="floor-load">{floor.currentLoad} kW</div>
            <div className="floor-meta">
              <span>{floor.dailyKWh} kWh</span>
              <span>{floor.health}% health</span>
            </div>
            <div className="floor-alarm-strip">
              <span>Alarms</span>
              <strong>{floor.alarmCount}</strong>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}
