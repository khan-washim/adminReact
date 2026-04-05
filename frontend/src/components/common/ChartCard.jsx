import React from 'react';

function ChartCard({ title, subtitle, children, style }) {
  return (
    <div className="chart-card" style={style}>
      <div className="chart-card-header">
        <h6>{title}</h6>
        {subtitle && <span>{subtitle}</span>}
      </div>
      {children}
    </div>
  );
}

export default ChartCard;
