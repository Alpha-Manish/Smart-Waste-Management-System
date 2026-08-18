import React from 'react';

interface DashboardContainerProps {
  children: React.ReactNode;
  className?: string;
}

export function DashboardContainer({ children, className = '' }: DashboardContainerProps) {
  return (
    <div className={`max-w-7xl mx-auto w-full ${className}`}>
      {children}
    </div>
  );
}
