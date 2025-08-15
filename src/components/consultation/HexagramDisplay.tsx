'use client';

import type { Hexagram, LineValue } from '@/types/iching';

interface HexagramDisplayProps {
  hexagram: Hexagram;
  size?: 'sm' | 'md' | 'lg';
  showDetails?: boolean;
}

const getLineDescription = (value: LineValue) => {
  switch (value) {
    case 6:
      return {
        name: 'Old Yin',
        symbol: '⚋',
        changing: true,
        description: 'Broken line, changing to solid',
        color: 'text-sunset-gold',
      };
    case 7:
      return {
        name: 'Young Yang',
        symbol: '⚊',
        changing: false,
        description: 'Solid line, stable',
        color: 'text-mountain-stone',
      };
    case 8:
      return {
        name: 'Young Yin',
        symbol: '⚋',
        changing: false,
        description: 'Broken line, stable',
        color: 'text-mountain-stone',
      };
    case 9:
      return {
        name: 'Old Yang',
        symbol: '⚊',
        changing: true,
        description: 'Solid line, changing to broken',
        color: 'text-sunset-gold',
      };
  }
};

const sizeClasses = {
  sm: 'text-2xl',
  md: 'text-4xl',
  lg: 'text-6xl',
};

export default function HexagramDisplay({
  hexagram,
  size = 'md',
  showDetails = false,
}: HexagramDisplayProps) {
  // Lines are displayed from top to bottom (traditional order)
  const displayLines = [...hexagram.lines].reverse();

  return (
    <div className="text-center">
      {/* Hexagram Title */}
      <div className="mb-4">
        <h3 className="mb-2 text-2xl font-bold text-ink-black">
          Hexagram {hexagram.number}
        </h3>
        <h4 className="text-xl text-gentle-silver">{hexagram.name}</h4>
      </div>

      {/* Hexagram Symbol */}
      <div className={`mb-4 font-mono leading-none ${sizeClasses[size]}`}>
        {displayLines.map((lineValue, index) => {
          const lineInfo = getLineDescription(lineValue);
          const actualLineNumber = 6 - index; // Convert display index to actual line number
          const isChanging = hexagram.changingLines.includes(actualLineNumber);

          return (
            <div
              key={index}
              className={`${lineInfo.color} ${
                isChanging ? 'animate-pulse' : ''
              }`}
              title={`Line ${actualLineNumber}: ${lineInfo.name}${
                isChanging ? ' (changing)' : ''
              }`}
            >
              {lineInfo.symbol}
            </div>
          );
        })}
      </div>

      {/* Changing Lines Indicator */}
      {hexagram.changingLines.length > 0 && (
        <div className="mb-4">
          <p className="text-sm font-medium text-sunset-gold">
            Changing Lines: {hexagram.changingLines.join(', ')}
          </p>
          <p className="text-xs text-gentle-silver">
            These lines indicate transformation and movement
          </p>
        </div>
      )}

      {/* Detailed Line Information */}
      {showDetails && (
        <div className="mt-6 space-y-3">
          <h5 className="font-medium text-ink-black">
            Line Details (bottom to top):
          </h5>
          {[...hexagram.lines].reverse().map((lineValue, displayIndex) => {
            const lineInfo = getLineDescription(lineValue);
            const actualIndex = hexagram.lines.length - 1 - displayIndex;
            const lineNumber = actualIndex + 1;
            const isChanging = hexagram.changingLines.includes(lineNumber);

            return (
              <div
                key={displayIndex}
                className={`flex items-center justify-between rounded-lg border p-3 ${
                  isChanging
                    ? 'border-sunset-gold/30 bg-sunset-gold/5'
                    : 'border-stone-gray/30 bg-cloud-white'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <span className="w-12 text-sm font-medium text-gentle-silver">
                    Line {lineNumber}
                  </span>
                  <span className={`text-2xl ${lineInfo.color}`}>
                    {lineInfo.symbol}
                  </span>
                  <span className="text-sm text-ink-black">
                    {lineInfo.name}
                  </span>
                </div>
                {isChanging && (
                  <span className="text-xs font-medium text-sunset-gold">
                    Changing
                  </span>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Traditional Context */}
      <div className="mt-6 rounded-lg border border-bamboo-green/20 bg-bamboo-green/5 p-4">
        <p className="text-xs text-gentle-silver">
          <strong>Traditional Reading:</strong> Hexagrams are read from bottom
          (Line 1) to top (Line 6). Changing lines (Old Yin/Yang) indicate areas
          of transformation in your situation.
        </p>
      </div>
    </div>
  );
}
