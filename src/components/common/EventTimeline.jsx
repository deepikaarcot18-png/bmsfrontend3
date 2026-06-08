/**
 * EventTimeline – renders a vertical timeline of recent building events.
 * Props:
 *   events – Array<{ id, label, detail, time }>
 */
export default function EventTimeline({ events = [] }) {
  const items = events.length ? events : [
    { id: 1, label: "System Boot",       detail: "BMS controller restarted",      time: "08:00 AM" },
    { id: 2, label: "Alarm Cleared",     detail: "HVAC‑03 temp normalized",       time: "09:15 AM" },
    { id: 3, label: "Schedule Change",   detail: "Lighting schedule updated (F12)", time: "10:30 AM" },
    { id: 4, label: "Energy Milestone",  detail: "Daily peak demand < 450 kW",     time: "11:45 AM" },
  ];

  return (
    <div className="glass-card" style={{ padding: "var(--space-5)", minHeight: 220 }}>
      <h3 style={{ margin: "0 0 var(--space-4) 0", fontWeight: 600, color: "var(--text-primary)" }}>
        Recent Events
      </h3>

      <ol style={{ listStyle: "none", margin: 0, padding: 0, position: "relative", maxHeight: 200, overflowY: "auto" }}>
        {/* vertical line */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            left: 7,
            top: 4,
            bottom: 4,
            width: 2,
            background: "var(--border)",
            borderRadius: 1,
          }}
        />

        {items.map((e) => (
          <li
            key={e.id}
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: "var(--space-3)",
              paddingBottom: "var(--space-3)",
              position: "relative",
            }}
          >
            {/* dot */}
            <span
              style={{
                width: 14,
                height: 14,
                borderRadius: "50%",
                background: "var(--accent)",
                border: "2px solid var(--card-bg)",
                flexShrink: 0,
                marginTop: 3,
                zIndex: 1,
              }}
            />
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, fontSize: "0.875rem", color: "var(--text-primary)" }}>{e.label}</div>
              <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{e.detail}</div>
            </div>
            <span style={{ fontSize: "0.7rem", color: "var(--text-muted)", whiteSpace: "nowrap" }}>{e.time}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}
