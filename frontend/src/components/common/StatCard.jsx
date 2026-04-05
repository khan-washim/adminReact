import React from 'react';
import { useCountUp } from '../../hooks/useCountUp.js';

function StatCard({ icon, label, value, color = 'blue', suffix = '', badge, badgeType = 'up' }) {
  const count = useCountUp(Number(value) || 0);

  return (
    <div className="stat-card">
      <div className={`stat-icon ${color}`}>{icon}</div>
      <div className="stat-info">
        <h3>
          {count.toLocaleString()}
          {suffix && <span style={{ fontSize: '1rem', fontWeight: 600 }}>{suffix}</span>}
        </h3>
        <p>{label}</p>
      </div>
      {badge && (
        <span className={`stat-badge ${badgeType}`}>{badge}</span>
      )}
    </div>
  );
}

export default StatCard;
