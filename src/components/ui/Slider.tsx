import React from 'react';

export interface SliderProps {
  value: number;
  onValueChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  className?: string;
}

export default function Slider({
  value,
  onValueChange,
  min = 0,
  max = 100,
  step = 1,
  disabled = false,
  className = '',
}: SliderProps) {
  return (
    <input
      type="range"
      value={value}
      onChange={e => onValueChange(parseFloat(e.target.value))}
      min={min}
      max={max}
      step={step}
      disabled={disabled}
      className={`
        slider-thumb:appearance-none slider-thumb:w-4 slider-thumb:h-4 slider-thumb:rounded-full slider-thumb:bg-flowing-water slider-thumb:cursor-pointer
        slider-thumb:shadow-md h-2 w-full
        cursor-pointer appearance-none
        rounded-lg bg-stone-gray focus:outline-none 
        focus:ring-2 focus:ring-flowing-water
        disabled:cursor-not-allowed disabled:opacity-50
        ${className}
      `}
      style={{
        background: `linear-gradient(to right, #4a90a4 0%, #4a90a4 ${
          ((value - min) / (max - min)) * 100
        }%, #d1d5db ${((value - min) / (max - min)) * 100}%, #d1d5db 100%)`,
      }}
    />
  );
}
