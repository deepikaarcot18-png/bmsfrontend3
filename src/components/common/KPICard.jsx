import PropTypes from 'prop-types';
import classNames from 'classnames';
import { memo } from 'react';

function KPICard({ label, value, unit, status }) {
  const statusClass = {
    healthy: 'chip-healthy',
    warning: 'chip-warning',
    critical: 'chip-critical',
    neutral: 'chip-neutral',
  }[status] || 'chip-neutral';

  return (
    <div className={classNames('glass-card-sm kpi-card animate-fadeInUp', `kpi-${status || 'neutral'}`)}>
      <span className="text-sm text-muted mb-1">{label}</span>
      <div className="flex items-baseline gap-1">
        <span className="text-2xl font-bold text-primary">{value}</span>
        {unit && <span className="text-sm text-muted">{unit}</span>}
      </div>
      <div className={classNames('chip', statusClass)}>{status?.toUpperCase()}</div>
    </div>
  );
}

export default memo(KPICard);

KPICard.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  unit: PropTypes.string,
  status: PropTypes.oneOf(['healthy', 'warning', 'critical', 'neutral']),
};

KPICard.defaultProps = {
  unit: '',
  status: 'neutral',
};
