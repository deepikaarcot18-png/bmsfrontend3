import { memo, useContext, useMemo } from 'react';
import { BmsContext } from '../../context/BmsContext';

function EnergyFlowSankey() {
  const { state } = useContext(BmsContext);
  const floors = useMemo(() => Object.values(state.floors || {}).slice(0, 5), [state.floors]);
  const total = useMemo(() => floors.reduce((sum, floor) => sum + floor.currentLoad, 0) || 1, [floors]);

  return (
    <div className="energy-flow-card">
      <svg width="100%" height="260" viewBox="0 0 840 260" role="img" aria-label="Animated energy flow diagram">
        <defs>
          <linearGradient id="energy-main" x1="0%" x2="100%">
            <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.9" />
            <stop offset="100%" stopColor="var(--healthy)" stopOpacity="0.85" />
          </linearGradient>
          <filter id="flow-glow">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <rect x="24" y="94" width="150" height="72" rx="8" className="flow-node" />
        <text x="99" y="124" textAnchor="middle" className="flow-label">Grid Incomer</text>
        <text x="99" y="148" textAnchor="middle" className="flow-value">{state.building?.totalLoadKW || 0} kW</text>

        <rect x="320" y="84" width="160" height="92" rx="8" className="flow-node flow-node-strong" />
        <text x="400" y="123" textAnchor="middle" className="flow-label">BMS Bus</text>
        <text x="400" y="149" textAnchor="middle" className="flow-value">{state.building?.efficiencyPct || 0}% efficient</text>

        <path d="M174 130 C235 130 258 130 320 130" className="flow-path flow-path-main" />
        <circle r="5" className="flow-pulse">
          <animateMotion dur="2.8s" repeatCount="indefinite" path="M174 130 C235 130 258 130 320 130" />
        </circle>

        {floors.map((floor, index) => {
          const y = 36 + index * 45;
          const width = Math.max(8, (floor.currentLoad / total) * 130);
          return (
            <g key={floor.id}>
              <path d={`M480 130 C555 130 562 ${y + 18} 626 ${y + 18}`} className={`flow-path flow-${floor.status}`} />
              <circle r="4" className={`flow-pulse flow-pulse-${floor.status}`}>
                <animateMotion
                  dur={`${2.2 + index * 0.25}s`}
                  repeatCount="indefinite"
                  path={`M480 130 C555 130 562 ${y + 18} 626 ${y + 18}`}
                />
              </circle>
              <rect x="626" y={y} width="168" height="36" rx="8" className="flow-node" />
              <rect x="638" y={y + 24} width={width} height="4" rx="2" className={`flow-bar flow-bar-${floor.status}`} />
              <text x="642" y={y + 16} className="flow-small-label">{floor.name}</text>
              <text x="782" y={y + 16} textAnchor="end" className="flow-small-value">{floor.currentLoad} kW</text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

export default memo(EnergyFlowSankey);
