'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import HexagramCard, { type HexagramData } from './HexagramCard';

interface HexagramGridProps {
  hexagrams: HexagramData[];
  searchable?: boolean;
  filterable?: boolean;
  onHexagramStudy?: (hexagram: HexagramData) => void;
  showStudyButton?: boolean;
  compact?: boolean;
  maxResults?: number;
}

interface Category {
  id: string;
  name: string;
  count: number;
  icon: string;
}

export default function HexagramGrid({
  hexagrams,
  searchable = true,
  filterable = true,
  onHexagramStudy,
  showStudyButton = false,
  compact = false,
  maxResults,
}: HexagramGridProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'number' | 'name' | 'difficulty'>('number');

  // Generate categories with counts
  const categories: Category[] = useMemo(() => {
    const categoryMap = new Map<string, { name: string; icon: string; count: number }>();
    
    // Initialize all categories
    [
      { id: 'all', name: 'All Categories', icon: '📚' },
      { id: 'self', name: 'Self Development', icon: '🧘' },
      { id: 'relationships', name: 'Relationships', icon: '❤️' },
      { id: 'work', name: 'Work & Career', icon: '💼' },
      { id: 'growth', name: 'Growth & Learning', icon: '🌱' },
      { id: 'change', name: 'Change & Transition', icon: '🔄' },
      { id: 'timing', name: 'Timing & Patience', icon: '⏰' },
    ].forEach(cat => {
      categoryMap.set(cat.id, { 
        name: cat.name, 
        icon: cat.icon, 
        count: cat.id === 'all' ? hexagrams.length : 0 
      });
    });

    // Count hexagrams in each category
    hexagrams.forEach(hexagram => {
      const existing = categoryMap.get(hexagram.category);
      if (existing) {
        existing.count++;
      }
    });

    return Array.from(categoryMap.entries()).map(([id, data]) => ({
      id,
      name: data.name,
      count: data.count,
      icon: data.icon,
    }));
  }, [hexagrams]);

  // Filter and sort hexagrams
  const filteredAndSortedHexagrams = useMemo(() => {
    let filtered = hexagrams.filter(hexagram => {
      const matchesSearch = searchTerm === '' || 
        hexagram.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        hexagram.chinese.includes(searchTerm) ||
        hexagram.keywords.some(keyword => keyword.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesCategory = selectedCategory === 'all' || hexagram.category === selectedCategory;
      const matchesDifficulty = selectedDifficulty === 'all' || hexagram.difficulty === selectedDifficulty;
      
      return matchesSearch && matchesCategory && matchesDifficulty;
    });

    // Sort hexagrams
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'difficulty':
          const difficultyOrder = { beginner: 1, intermediate: 2, advanced: 3 };
          return difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty];
        case 'number':
        default:
          return a.number - b.number;
      }
    });

    // Apply max results if specified
    if (maxResults && maxResults > 0) {
      filtered = filtered.slice(0, maxResults);
    }

    return filtered;
  }, [hexagrams, searchTerm, selectedCategory, selectedDifficulty, sortBy, maxResults]);

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setSelectedDifficulty('all');
  };

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      {(searchable || filterable) && (
        <Card variant="default">
          <CardContent className="pt-6">
            <div className="grid gap-4">
              {/* Search and Sort Row */}
              {searchable && (
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-mountain-stone mb-2">
                      Search Hexagrams
                    </label>
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search by name, keywords..."
                      className="w-full px-3 py-2 border border-stone-gray/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-flowing-water"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-mountain-stone mb-2">
                      Sort By
                    </label>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as 'number' | 'name' | 'difficulty')}
                      className="w-full px-3 py-2 border border-stone-gray/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-flowing-water"
                    >
                      <option value="number">Hexagram Number</option>
                      <option value="name">Name (A-Z)</option>
                      <option value="difficulty">Difficulty Level</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Filter Row */}
              {filterable && (
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-mountain-stone mb-2">
                      Category
                    </label>
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="w-full px-3 py-2 border border-stone-gray/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-flowing-water"
                    >
                      {categories.map(category => (
                        <option key={category.id} value={category.id}>
                          {category.name} ({category.count})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-mountain-stone mb-2">
                      Difficulty
                    </label>
                    <select
                      value={selectedDifficulty}
                      onChange={(e) => setSelectedDifficulty(e.target.value)}
                      className="w-full px-3 py-2 border border-stone-gray/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-flowing-water"
                    >
                      <option value="all">All Levels</option>
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Quick Filter Buttons */}
              {filterable && (
                <div className="flex flex-wrap gap-2">
                  {categories.slice(0, 7).map(category => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                        selectedCategory === category.id
                          ? 'bg-flowing-water text-white'
                          : 'bg-gentle-silver/20 text-mountain-stone hover:bg-gentle-silver/30'
                      }`}
                    >
                      <span>{category.icon}</span>
                      {category.name}
                      <span className="text-xs opacity-75">({category.count})</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-soft-gray">
          Showing {filteredAndSortedHexagrams.length} hexagram{filteredAndSortedHexagrams.length !== 1 ? 's' : ''}
          {maxResults && filteredAndSortedHexagrams.length === maxResults && ` (limited to ${maxResults})`}
        </div>
        
        {(searchTerm || selectedCategory !== 'all' || selectedDifficulty !== 'all') && (
          <Button variant="outline" size="sm" onClick={clearFilters}>
            Clear Filters
          </Button>
        )}
      </div>

      {/* Hexagram Grid */}
      {filteredAndSortedHexagrams.length > 0 ? (
        <div className={`grid gap-6 ${
          compact 
            ? 'md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5'
            : 'md:grid-cols-2 lg:grid-cols-3'
        }`}>
          {filteredAndSortedHexagrams.map((hexagram) => (
            <HexagramCard
              key={hexagram.number}
              hexagram={hexagram}
              onStudy={onHexagramStudy}
              showStudyButton={showStudyButton}
              compact={compact}
            />
          ))}
        </div>
      ) : (
        <Card variant="default" className="text-center py-12">
          <CardContent>
            <div className="text-4xl mb-4">🔍</div>
            <h3 className="text-xl font-medium text-mountain-stone mb-2">
              No hexagrams found
            </h3>
            <p className="text-soft-gray mb-4">
              Try adjusting your search terms or filters to find relevant hexagrams.
            </p>
            <Button variant="outline" onClick={clearFilters}>
              Clear All Filters
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}