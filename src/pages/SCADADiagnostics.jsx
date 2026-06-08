import { useCallback, useContext, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import CircularGauge from '../components/common/CircularGauge.jsx';
import EventTimeline from '../components/common/EventTimeline.jsx';
import { BmsContext } from '../context/BmsContext';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import './SCADADiagnostics.css';

const sensorNames = ['Supply Temp', 'Return Temp', 'Vibration', 'Pressure', 'Runtime', 'Voltage'];

export default function SCADADiagnostics() {
  const { equipmentId } = useParams();
  const navigate = useNavigate();
  const { state } = useContext(BmsContext);

  const id = decodeURIComponent(equipmentId || '');
  const equipment = state.equipment?.[id];
  const client = equipment ? state.clients?.[equipment.clientId] : null;
  const sensors = useMemo(() => sensorNames.map((name, index) => {
    const value = Math.max(1, Math.round(((equipment?.currentLoad || 0) + (equipment?.health || 0) + index * 9) % 100));
    const status = value > 85 ? 'warning' : equipment?.status || 'neutral';
    return { name, value, status };
  }), [equipment]);
  const alarmRows = useMemo(() => [
    { id: `${equipment?.id || 'equipment'}-1`, priority: equipment?.alarm ? 'critical' : 'info', text: equipment?.alarm ? `${equipment.type} requires operator review` : `${equipment?.type || 'Equipment'} telemetry normal`, time: equipment?.lastUpdated ? new Date(equipment.lastUpdated).toLocaleTimeString() : 'Pending' },
    { id: `${equipment?.id || 'equipment'}-2`, priority: equipment?.status === 'warning' ? 'warning' : 'info', text: 'Last controller heartbeat received', time: equipment?.lastUpdated ? new Date(equipment.lastUpdated).toLocaleTimeString() : 'Pending' },
  ], [equipment]);
  const timeline = useMemo(() => [
    { id: 1, label: 'Telemetry Update', detail: `${equipment?.currentLoad || 0} kW sampled from ${equipment?.type || 'equipment'}`, time: equipment?.lastUpdated ? new Date(equipment.lastUpdated).toLocaleTimeString() : 'Pending' },
    { id: 2, label: 'Health Check', detail: `${equipment?.health || 0}% diagnostic score`, time: 'Live' },
    { id: 3, label: 'Operator Mode', detail: equipment?.running ? 'Automatic control enabled' : 'Manual inspection required', time: 'Now' },
  ], [equipment]);
  const openClient = useCallback(() => navigate(`/client/${equipment?.clientId}`), [equipment?.clientId, navigate]);

  if (!state.equipment) return <LoadingSpinner />;
  if (!equipment) return <div className="glass-card p-6">Equipment not found.</div>;

  return (
    <section className="dashboard-page scada-page animate-fadeIn">
      <div className="section-header">
        <div>
          <h1 className="page-title">{equipment.type} Diagnostics</h1>
          <p className="section-subtitle">{client?.name || 'Client'} SCADA endpoint: {equipment.id}</p>
        </div>
        <button className="btn btn-secondary" type="button" onClick={openClient}>Back to Client</button>
      </div>

      <div className="scada-grid">
        <div className="glass-card p-6 scada-gauge-panel">
          <CircularGauge size={210} value={equipment.health} max={100} label="Equipment Health" color={equipment.status === 'critical' ? 'var(--critical)' : 'var(--accent)'} />
          <div>
            <span className={`chip chip-${equipment.status}`}>{equipment.running ? equipment.status : 'offline'}</span>
            <div className="text-2xl font-bold mt-3">{equipment.currentLoad} kW</div>
            <div className="text-sm text-muted">Current electrical load</div>
          </div>
        </div>

        <div className="glass-card p-6">
          <h2 className="section-title mb-4">Sensor Matrix</h2>
          <div className="sensor-matrix">
            {sensors.map((sensor) => (
              <div key={sensor.name} className={`sensor-cell sensor-${sensor.status}`}>
                <span>{sensor.name}</span>
                <strong>{sensor.value}</strong>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card p-6">
          <h2 className="section-title mb-4">Alarm Table</h2>
          <table className="data-table">
            <thead>
              <tr>
                <th>Priority</th>
                <th>Event</th>
                <th>Time</th>
              </tr>
            </thead>
            <tbody>
              {alarmRows.map((alarm) => (
                <tr key={alarm.id}>
                  <td><span className={`chip chip-${alarm.priority === 'info' ? 'healthy' : alarm.priority}`}>{alarm.priority}</span></td>
                  <td>{alarm.text}</td>
                  <td>{alarm.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <EventTimeline events={timeline} />

        <div className="glass-card p-6">
          <h2 className="section-title mb-4">Maintenance Panel</h2>
          <div className="maintenance-list">
            <div><span>Next PM</span><strong>72 hours</strong></div>
            <div><span>Runtime</span><strong>{Math.round(equipment.health * 12.4)} h</strong></div>
            <div><span>Last Updated</span><strong>{new Date(equipment.lastUpdated).toLocaleString()}</strong></div>
          </div>
        </div>

        <div className="glass-card p-6">
          <h2 className="section-title mb-4">Manual Control</h2>
          <div className="control-row">
            <button className="btn btn-success" type="button">Start</button>
            <button className="btn btn-warning" type="button">Hold</button>
            <button className="btn btn-danger" type="button">Trip</button>
            <button className="btn btn-secondary" type="button">Reset</button>
          </div>
        </div>
      </div>
    </section>
  );
}
