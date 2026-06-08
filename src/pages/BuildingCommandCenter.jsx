import { useCallback, useContext, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { BmsContext } from '../context/BmsContext';
import KPICard from '../components/common/KPICard.jsx';
import CircularGauge from '../components/common/CircularGauge.jsx';
import EnergyFlowSankey from '../components/sankey/EnergyFlowSankey.jsx';
import AlarmFeed from '../components/common/AlarmFeed.jsx';
import EventTimeline from '../components/common/EventTimeline.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';

export default function BuildingCommandCenter() {
  const { state } = useContext(BmsContext);
  const navigate = useNavigate();
  const building = state.building;
  const { totalLoadKW = 0, totalConsumptionKWh = 0, activeClients = 0, runningEquipment = 0, activeAlarms = 0, monthlyCostINR = 0, healthScore = 0, efficiencyPct = 0, epx = 0 } = building || {};
  const topEnergyFloors = useMemo(() => (
    Object.values(state.floors || {})
      .sort((a, b) => b.currentLoad - a.currentLoad)
      .slice(0, 5)
  ), [state.floors]);

  const kpiData = useMemo(() => [
    { label: 'Total Load (kW)', value: totalLoadKW, unit: 'kW', badge: 'healthy' },
    { label: 'Total Consumption (kWh)', value: totalConsumptionKWh, unit: 'kWh', badge: 'healthy' },
    { label: 'Active Clients', value: activeClients, unit: '', badge: 'healthy' },
    { label: 'Running Equipment', value: runningEquipment, unit: '', badge: 'healthy' },
    { label: 'Active Alarms', value: activeAlarms, unit: '', badge: 'warning' },
    { label: 'Monthly Cost', value: `₹${monthlyCostINR.toLocaleString('en-IN')}`, unit: '', badge: 'healthy' },
  ], [activeAlarms, activeClients, monthlyCostINR, runningEquipment, totalConsumptionKWh, totalLoadKW]);
  const openFloors = useCallback(() => navigate('/floors'), [navigate]);
  const openFloor = useCallback((floorId) => navigate(`/floor/${floorId}`), [navigate]);

  if (!building) return <LoadingSpinner />;

  return (
    <section className="dashboard-page animate-fadeIn">
      <div className="section-header">
        <div>
          <h1 className="page-title">{building.name}</h1>
          <p className="section-subtitle">Live command center with telemetry refresh every 3 seconds</p>
        </div>
        <button className="btn btn-primary" type="button" onClick={openFloors}>View Floors</button>
      </div>

      <div className="grid-3 mb-6">
        {kpiData.map((kpi) => (
          <KPICard key={kpi.label} label={kpi.label} value={kpi.value} unit={kpi.unit} status={kpi.badge} />
        ))}
      </div>

      <div className="command-grid mb-8">
        <div className="glass-card p-6 health-panel">
          <CircularGauge size={210} value={healthScore} max={100} label="Health Score" color="var(--accent)" />
          <div>
            <div className="text-2xl font-bold">{efficiencyPct}% Efficiency</div>
            <div className="text-sm text-muted mb-4">Energy Performance Index: {epx} kWh per client</div>
            <div className="status-strip">
              <span className="pulse-dot healthy" />
              <span>Live telemetry online</span>
            </div>
          </div>
        </div>

        <div className="glass-card p-6">
          <h2 className="section-title mb-4">Top Energy Floors</h2>
          <div className="rank-list">
            {topEnergyFloors.map((floor) => (
              <button key={floor.id} className="rank-row" type="button" onClick={() => openFloor(floor.id)}>
                <span>{floor.name}</span>
                <span className={`chip chip-${floor.status}`}>{floor.currentLoad} kW</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="glass-card p-6 mb-8">
        <h2 className="section-title">Energy Flow</h2>
        <EnergyFlowSankey />
      </div>

      <div className="grid-2 gap-6">
        <AlarmFeed alarms={state.alarms} />
        <EventTimeline events={state.recentEvents} />
      </div>
    </section>
  );
}
