import React from 'react';

export interface ToggleProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
}

export default function Toggle({
  checked,
  onCheckedChange,
  disabled = false,
  className = '',
}: ToggleProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      className={`
        relative inline-flex h-6 w-11 items-center rounded-full transition-colors
        focus:outline-none focus:ring-2 focus:ring-flowing-water focus:ring-offset-2
        ${
          checked
            ? 'bg-flowing-water'
            : disabled
              ? 'bg-stone-gray'
              : 'bg-stone-gray hover:bg-soft-gray'
        }
        ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
        ${className}
      `}
      onClick={() => !disabled && onCheckedChange(!checked)}
    >
      <span
        className={`
          inline-block h-4 w-4 transform rounded-full bg-white transition-transform
          ${checked ? 'translate-x-6' : 'translate-x-1'}
        `}
      />
    </button>
  );
}
