import React from 'react';

type StatusType = 'active' | 'inactive' | 'warning' | 'error' | 'verified' | 'unverified' | 'pending' | 'suspended' | string;

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
  const statusStyles: Record<string, string> = {
    active: 'bg-[#4CAF50] text-white',
    inactive: 'bg-[#9E9E9E] text-white',
    warning: 'bg-[#FFC107] text-primary-text',
    error: 'bg-[#F44336] text-white',
    verified: 'bg-[#2196F3] text-white',
    unverified: 'bg-[#FF9800] text-white',
    pending: 'bg-[#FFC107] text-primary-text',
    suspended: 'bg-[#F44336] text-white'
  };

  const defaultText: Record<string, string> = {
    active: 'Active',
    inactive: 'Inactive',
    warning: 'Warning',
    error: 'Error',
    verified: 'Verified',
    unverified: 'Unverified',
    pending: 'Pending',
    suspended: 'Suspended'
  };

  const style = statusStyles[status.toLowerCase()] || statusStyles.inactive;
  const displayText = text || defaultText[status.toLowerCase()] || status;

  return (
    <span className={`
      inline-flex items-center px-3 py-1
      rounded-full text-sm font-medium
      ${style}
      ${className}
    `}>
      <span className="w-2 h-2 rounded-full bg-current mr-2" />
      {displayText}
    </span>
  );
};