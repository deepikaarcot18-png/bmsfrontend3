import { useCallback, useContext, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { BmsContext } from '../context/BmsContext';
import KPICard from '../components/common/KPICard.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';

export default function FloorDashboard() {
  const { floorId } = useParams();
  const navigate = useNavigate();
  const { state } = useContext(BmsContext);

  const floor = state.floors?.[floorId];
  const clients = useMemo(() => (floor?.clientIds || []).map((cid) => state.clients?.[cid]).filter(Boolean), [floor, state.clients]);
  const chartData = useMemo(() => clients.map((client) => ({
    name: client.name.replace('Client ', 'C'),
    load: client.currentLoad,
    energy: client.dailyKWh,
    health: client.health,
  })), [clients]);
  const trendData = useMemo(() => chartData.map((item, index) => ({
    slot: `${8 + index * 2}:00`,
    load: Math.max(20, item.load + (index % 2 ? 18 : -12)),
    energy: item.energy,
  })), [chartData]);
  const openFloors = useCallback(() => navigate('/floors'), [navigate]);
  const openClient = useCallback((id) => navigate(`/client/${id}`), [navigate]);

  if (!state.floors) return <LoadingSpinner />;
  if (!floor) return <div className="glass-card p-6">Floor not found.</div>;

  return (
    <section className="dashboard-page animate-fadeIn">
      <div className="section-header">
        <div>
          <h1 className="page-title">{floor.name} Dashboard</h1>
          <p className="section-subtitle">Client zones, live load, health and consumption profile</p>
        </div>
        <button className="btn btn-secondary" type="button" onClick={openFloors}>All Floors</button>
      </div>

      <div className="grid-3 gap-4 mb-6">
        <KPICard label="Floor Load" value={floor.currentLoad} unit="kW" status="healthy" />
        <KPICard label="Daily Energy" value={floor.dailyKWh} unit="kWh" status="healthy" />
        <KPICard label="Health" value={floor.health} unit="%" status={floor.status} />
        <KPICard label="Active Alarms" value={floor.alarmCount} unit="" status={floor.alarmCount > 0 ? "warning" : "healthy"} />
      </div>

      <div className="floor-layout">
        <div className="glass-card p-6">
          <h2 className="section-title mb-4">2x2 Client Zone Map</h2>
          <div className="zone-map">
            {clients.map((client) => (
              <button
                key={client.id}
                type="button"
                className={`zone-tile zone-${client.status}`}
                onClick={() => openClient(client.id)}
                title={`Open ${client.name}`}
              >
                <span className="zone-name">{client.name}</span>
                <span className="zone-load">{client.currentLoad} kW</span>
                <span className={`chip chip-${client.status}`}>{client.status}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="glass-card p-6">
          <h2 className="section-title mb-4">Consumption Charts</h2>
          <div className="chart-box">
            <ResponsiveContainer width="100%" height={210}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="energy" fill="var(--accent)" radius={[6, 6, 0, 0]} isAnimationActive={false} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="chart-box">
            <ResponsiveContainer width="100%" height={180}>
              <AreaChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="slot" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="load" stroke="var(--healthy)" fill="rgba(16,185,129,0.18)" isAnimationActive={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </section>
  );
}
