import React from 'react';

interface StatusBadgeProps {
  status: 'critical' | 'warning' | 'normal' | 'success';
  children: React.ReactNode;
}

export function StatusBadge({ status, children }: StatusBadgeProps) {
  const styles = {
    critical: 'bg-red-50 text-status-critical border-red-200',
    warning: 'bg-amber-50 text-status-warning border-amber-200',
    normal: 'bg-gray-50 text-gray-700 border-gray-200',
    success: 'bg-green-50 text-status-normal border-green-200',
  };

  return (
    <span className={`inline-flex items-center px-2 py-0.5 text-xs font-medium border ${styles[status]}`}>
      {children}
    </span>
  );
}
