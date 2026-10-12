import React from 'react';

const Badge = ({ status, className = '' }) => {
  let styles = 'bg-gray-100 text-gray-800 border-gray-200';

  switch (status?.toLowerCase()) {
    case 'confirmed':
      styles = 'bg-emerald-50 text-brand-shade3 border-emerald-200';
      break;
    case 'in progress':
      styles = 'bg-sky-50 text-brand-info border-sky-200';
      break;
    case 'completed':
      styles = 'bg-emerald-100 text-brand-shade4 border-emerald-300 font-bold';
      break;
    case 'pending':
      styles = 'bg-amber-50 text-amber-700 border-amber-200';
      break;
    case 'cancelled':
      styles = 'bg-rose-50 text-rose-700 border-rose-200';
      break;
    case 'available':
      styles = 'bg-emerald-50 text-brand-primary border-emerald-200';
      break;
    case 'full':
      styles = 'bg-rose-50 text-brand-error border-rose-200';
      break;
    case 'disabled':
      styles = 'bg-gray-100 text-gray-500 border-gray-200';
      break;
    default:
      styles = 'bg-gray-100 text-brand-dGrey border-gray-200';
  }

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${styles} ${className}`}
    >
      <span className="w-1.5 h-1.5 rounded-full mr-1.5 bg-current opacity-70"></span>
      {status}
    </span>
  );
};

export default Badge;
