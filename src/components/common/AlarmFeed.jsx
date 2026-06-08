const SEVERITY_MAP = {
  critical: { color: "var(--critical)", icon: "🔴" },
  warning:  { color: "var(--warning)",  icon: "🟠" },
  info:     { color: "var(--healthy)",   icon: "🟢" },
};

/**
 * AlarmFeed – renders a scrollable list of active alarms.
 * Props:
 *   alarms – Array<{ id, severity, message, timestamp }>
 */
export default function AlarmFeed({ alarms = [] }) {
  const items = alarms.length ? alarms : [
    { id: 1, severity: "critical", message: "Generator‑02 offline", timestamp: new Date().toLocaleTimeString() },
    { id: 2, severity: "warning",  message: "HVAC‑05 high temp",    timestamp: new Date().toLocaleTimeString() },
    { id: 3, severity: "info",     message: "Lift‑01 maintenance OK", timestamp: new Date().toLocaleTimeString() },
  ];

  return (
    <div className="glass-card" style={{ padding: "var(--space-5)", minHeight: 220 }}>
      <h3 style={{ margin: "0 0 var(--space-4) 0", fontWeight: 600, color: "var(--text-primary)" }}>
        Active Alarms
      </h3>

      <ul style={{ listStyle: "none", margin: 0, padding: 0, maxHeight: 200, overflowY: "auto" }}>
        {items.map((a) => {
          const sev = SEVERITY_MAP[a.severity] || SEVERITY_MAP.info;
          return (
            <li
              key={a.id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "var(--space-3)",
                padding: "var(--space-2) 0",
                borderBottom: "1px solid var(--border)",
              }}
            >
              <span>{sev.icon}</span>
              <span style={{ flex: 1, color: sev.color, fontWeight: 500 }}>{a.message}</span>
              <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{a.timestamp}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
