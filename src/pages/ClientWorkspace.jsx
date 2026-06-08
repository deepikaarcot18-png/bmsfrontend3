import { useCallback, useContext, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { BmsContext } from '../context/BmsContext';
import KPICard from '../components/common/KPICard.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';

export default function ClientWorkspace() {
  const { clientId } = useParams();
  const navigate = useNavigate();
  const { state } = useContext(BmsContext);

  const client = state.clients?.[clientId];
  const equipment = useMemo(() => (client?.equipmentIds || []).map((id) => state.equipment?.[id]).filter(Boolean), [client, state.equipment]);
  const trendData = useMemo(() => equipment.slice(0, 8).map((item, index) => ({
    slot: `${index + 9}:00`,
    load: item.currentLoad,
    health: item.health,
  })), [equipment]);
  const openFloor = useCallback(() => navigate(`/floor/${client?.floorId}`), [client?.floorId, navigate]);
  const openScada = useCallback((id) => navigate(`/scada/${encodeURIComponent(id)}`), [navigate]);

  if (!state.clients) return <LoadingSpinner />;
  if (!client) return <div className="glass-card p-6">Client not found.</div>;

  return (
    <section className="dashboard-page animate-fadeIn">
      <div className="section-header">
        <div>
          <h1 className="page-title">{client.name} Workspace</h1>
          <p className="section-subtitle">Floor {client.floorId} tenant equipment, alarms and consumption trend</p>
        </div>
        <button className="btn btn-secondary" type="button" onClick={openFloor}>Back to Floor</button>
      </div>

      <div className="grid-4 mb-6">
        <KPICard label="Client Load" value={client.currentLoad} unit="kW" status={client.status} />
        <KPICard label="Daily Energy" value={client.dailyKWh} unit="kWh" status="healthy" />
        <KPICard label="Health" value={client.health} unit="%" status={client.status} />
        <KPICard label="Active Alarms" value={client.alarmCount} unit="" status={client.alarmCount ? 'warning' : 'healthy'} />
      </div>

      <div className="client-layout">
        <div className="glass-card p-6">
          <h2 className="section-title mb-4">Equipment Grid</h2>
          <div className="equipment-grid">
            {equipment.map((item) => (
              <button
                key={item.id}
                type="button"
                className={`equipment-tile equipment-${item.status}`}
                onClick={() => openScada(item.id)}
              >
                <span className="font-semibold">{item.type}</span>
                <span className="text-sm text-muted">{item.currentLoad} kW load</span>
                <span className="text-sm text-muted">{item.health}% health</span>
                <span className={`chip chip-${item.status}`}>{item.running ? item.status : 'offline'}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="glass-card p-6">
          <h2 className="section-title mb-4">Consumption Trend</h2>
          <div className="chart-box">
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="slot" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="load" stroke="var(--accent)" fill="rgba(37,99,235,0.18)" isAnimationActive={false} />
                <Area type="monotone" dataKey="health" stroke="var(--healthy)" fill="rgba(16,185,129,0.12)" isAnimationActive={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </section>
  );
}
