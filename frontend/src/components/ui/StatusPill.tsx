import React from 'react';

type StatusType = 'active' | 'inactive' | 'warning' | 'error';

interface StatusPillProps {
  status: StatusType;
  text?: string;
  className?: string;
}

export const StatusPill: React.FC<StatusPillProps> = ({
  status,
  text,
  className = '',
}) => {
  const statusStyles = {
    active: 'bg-[#4CAF50] text-white',
    inactive: 'bg-[#9E9E9E] text-white',
    warning: 'bg-[#FFC107] text-primary-text',
    error: 'bg-[#F44336] text-white',
  };

  const defaultText = {
    active: 'Active',
    inactive: 'Inactive',
    warning: 'Warning',
    error: 'Error',
  };

  return (
    <span className={`
      inline-flex items-center px-3 py-1
      rounded-full text-sm font-medium
      ${statusStyles[status]}
      ${className}
    `}>
      <span className="w-2 h-2 rounded-full bg-current mr-2" />
      {text || defaultText[status]}
    </span>
  );
};