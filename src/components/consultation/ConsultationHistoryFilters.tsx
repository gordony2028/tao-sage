'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';

interface FilterState {
  search: string;
  hexagramNumber: number | undefined;
  status: 'active' | 'archived';
}

interface ConsultationHistoryFiltersProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
}

export default function ConsultationHistoryFilters({
  filters,
  onFiltersChange,
}: ConsultationHistoryFiltersProps) {
  const [localFilters, setLocalFilters] = useState(filters);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleApplyFilters = () => {
    onFiltersChange(localFilters);
  };

  const handleClearFilters = () => {
    const clearedFilters = {
      search: '',
      hexagramNumber: undefined,
      status: 'active' as const,
    };
    setLocalFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  const hasActiveFilters =
    localFilters.search ||
    localFilters.hexagramNumber ||
    localFilters.status !== 'active';

  return (
    <Card variant="default">
      <CardContent className="pt-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-medium text-ink-black">Filter Consultations</h3>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? 'Hide Filters' : 'Show Filters'}
          </Button>
        </div>

        {/* Quick Search (always visible) */}
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Search questions..."
            value={localFilters.search}
            onChange={e =>
              setLocalFilters({ ...localFilters, search: e.target.value })
            }
            onKeyDown={e => e.key === 'Enter' && handleApplyFilters()}
            className="flex-1 rounded-lg border border-stone-gray/30 px-3 py-2 text-sm focus:border-flowing-water focus:outline-none focus:ring-2 focus:ring-flowing-water/50"
          />
          <Button onClick={handleApplyFilters} size="sm">
            Search
          </Button>
        </div>

        {/* Advanced Filters (expandable) */}
        {isExpanded && (
          <div className="mt-4 space-y-4 border-t border-stone-gray/20 pt-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {/* Hexagram Filter */}
              <div>
                <label className="mb-2 block text-sm font-medium text-mountain-stone">
                  Hexagram Number
                </label>
                <select
                  value={localFilters.hexagramNumber || ''}
                  onChange={e =>
                    setLocalFilters({
                      ...localFilters,
                      hexagramNumber: e.target.value
                        ? parseInt(e.target.value)
                        : undefined,
                    })
                  }
                  className="w-full rounded-lg border border-stone-gray/30 px-3 py-2 text-sm focus:border-flowing-water focus:outline-none focus:ring-2 focus:ring-flowing-water/50"
                >
                  <option value="">All hexagrams</option>
                  {Array.from({ length: 64 }, (_, i) => i + 1).map(num => (
                    <option key={num} value={num}>
                      {num}. {getHexagramName(num)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Status Filter */}
              <div>
                <label className="mb-2 block text-sm font-medium text-mountain-stone">
                  Status
                </label>
                <select
                  value={localFilters.status}
                  onChange={e =>
                    setLocalFilters({
                      ...localFilters,
                      status: e.target.value as 'active' | 'archived',
                    })
                  }
                  className="w-full rounded-lg border border-stone-gray/30 px-3 py-2 text-sm focus:border-flowing-water focus:outline-none focus:ring-2 focus:ring-flowing-water/50"
                >
                  <option value="active">Active</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 pt-2">
              <Button onClick={handleApplyFilters} size="sm">
                Apply Filters
              </Button>
              {hasActiveFilters && (
                <Button
                  onClick={handleClearFilters}
                  variant="outline"
                  size="sm"
                >
                  Clear All
                </Button>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Helper function to get hexagram names (simplified version)
function getHexagramName(number: number): string {
  const names: Record<number, string> = {
    1: 'The Creative',
    2: 'The Receptive',
    3: 'Difficulty at the Beginning',
    4: 'Youthful Folly',
    5: 'Waiting',
    6: 'Conflict',
    7: 'The Army',
    8: 'Holding Together',
    9: 'Small Taming',
    10: 'Treading',
    11: 'Peace',
    12: 'Standstill',
    13: 'Fellowship',
    14: 'Great Possession',
    15: 'Modesty',
    16: 'Enthusiasm',
    17: 'Following',
    18: 'Work on the Decayed',
    19: 'Approach',
    20: 'Contemplation',
    21: 'Biting Through',
    22: 'Grace',
    23: 'Splitting Apart',
    24: 'Return',
    25: 'Innocence',
    26: 'Great Taming',
    27: 'Nourishment',
    28: 'Great Preponderance',
    29: 'The Abysmal',
    30: 'The Clinging',
    31: 'Influence',
    32: 'Duration',
    33: 'Retreat',
    34: 'Great Power',
    35: 'Progress',
    36: 'Darkening of Light',
    37: 'The Family',
    38: 'Opposition',
    39: 'Obstruction',
    40: 'Deliverance',
    41: 'Decrease',
    42: 'Increase',
    43: 'Breakthrough',
    44: 'Coming to Meet',
    45: 'Gathering Together',
    46: 'Pushing Upward',
    47: 'Oppression',
    48: 'The Well',
    49: 'Revolution',
    50: 'The Caldron',
    51: 'The Arousing',
    52: 'Keeping Still',
    53: 'Development',
    54: 'The Marrying Maiden',
    55: 'Abundance',
    56: 'The Wanderer',
    57: 'The Gentle',
    58: 'The Joyous',
    59: 'Dispersion',
    60: 'Limitation',
    61: 'Inner Truth',
    62: 'Small Preponderance',
    63: 'After Completion',
    64: 'Before Completion',
  };

  return names[number] || 'Unknown';
}
