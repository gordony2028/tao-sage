import React from 'react';

export interface SelectProps {
  value: string;
  onValueChange: (value: string) => void;
  disabled?: boolean;
  className?: string;
  children: React.ReactNode;
}

export default function Select({
  value,
  onValueChange,
  disabled = false,
  className = '',
  children,
}: SelectProps) {
  return (
    <select
      value={value}
      onChange={e => onValueChange(e.target.value)}
      disabled={disabled}
      className={`
        w-full rounded-md border border-stone-gray bg-white px-3 py-2 text-sm
        focus:border-flowing-water focus:outline-none focus:ring-2 focus:ring-flowing-water
        disabled:cursor-not-allowed disabled:bg-gentle-silver/20 disabled:opacity-50
        ${className}
      `}
    >
      {children}
    </select>
  );
}
