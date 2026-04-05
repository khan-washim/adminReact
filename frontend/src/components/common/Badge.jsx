import React from 'react';

function Badge({ label, variant }) {
  const variantMap = {
    Pass: 'pass', pass: 'pass', Active: 'active', active: 'active', Easy: 'easy', easy: 'easy',
    Fail: 'fail', fail: 'fail', Inactive: 'inactive', inactive: 'inactive', Hard: 'hard', hard: 'hard',
    Medium: 'medium', medium: 'medium', Admin: 'admin', admin: 'admin',
    User: 'user', user: 'user',
  };
  const cls = variant || variantMap[label] || 'medium';
  return <span className={`badge-pill ${cls}`}>{label}</span>;
}

export default Badge;
