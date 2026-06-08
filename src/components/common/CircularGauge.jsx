import PropTypes from 'prop-types';

export default function CircularGauge({ size = 200, value = 0, max = 100, label = '', color = 'var(--accent)' }) {
  const radius = size / 2 - 10;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / max) * circumference;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="animate-fadeInUp">
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke="var(--bg-secondary)"
        strokeWidth="12"
        fill="none"
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke={color}
        strokeWidth="12"
        fill="none"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        className="animate-float"
      />
      <text
        x="50%"
        y="50%"
        dominantBaseline="middle"
        textAnchor="middle"
        className="text-2xl font-bold"
        fill="var(--text-primary)"
      >
        {Math.round(value)}
      </text>
      {label && (
        <text
          x="50%"
          y="70%"
          dominantBaseline="middle"
          textAnchor="middle"
          className="text-sm text-muted"
        >
          {label}
        </text>
      )}
    </svg>
  );
}

CircularGauge.propTypes = {
  size: PropTypes.number,
  value: PropTypes.number,
  max: PropTypes.number,
  label: PropTypes.string,
  color: PropTypes.string,
};
