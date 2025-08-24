'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Button from '@/components/ui/Button';

import { HEXAGRAMS, type HexagramData } from '@/data/hexagrams';

export default function HexagramsOverviewPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
    };
    getUser();
  }, []);

  // Use the complete 64 hexagrams database
  const hexagrams: HexagramData[] = HEXAGRAMS;

  const categories = [
    { id: 'all', name: 'All Categories', count: hexagrams.length },
    { id: 'self', name: 'Self Development', count: hexagrams.filter(h => h.category === 'self').length },
    { id: 'relationships', name: 'Relationships', count: hexagrams.filter(h => h.category === 'relationships').length },
    { id: 'work', name: 'Work & Career', count: hexagrams.filter(h => h.category === 'work').length },
    { id: 'growth', name: 'Growth & Learning', count: hexagrams.filter(h => h.category === 'growth').length },
    { id: 'change', name: 'Change & Transition', count: hexagrams.filter(h => h.category === 'change').length },
    { id: 'timing', name: 'Timing & Patience', count: hexagrams.filter(h => h.category === 'timing').length },
  ];

  const filteredHexagrams = hexagrams.filter(hexagram => {
    const matchesSearch = searchTerm === '' || 
      hexagram.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      hexagram.chinese.includes(searchTerm) ||
      hexagram.keywords.some(keyword => keyword.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || hexagram.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === 'all' || hexagram.difficulty === selectedDifficulty;
    
    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  const renderHexagramLines = (lines: ('yin' | 'yang')[]) => {
    return (
      <div className="flex flex-col items-center space-y-1">
        {lines.slice().reverse().map((line, index) => (
          <div key={index} className="w-8 h-1">
            {line === 'yang' ? (
              // Yang line: solid line
              <div className="w-full h-full bg-mountain-stone rounded-sm"></div>
            ) : (
              // Yin line: broken line with gap
              <div className="flex justify-between items-center h-full">
                <div className="w-3 h-full bg-mountain-stone rounded-sm"></div>
                <div className="w-3 h-full bg-mountain-stone rounded-sm"></div>
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-700 border-green-200';
      case 'intermediate': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'advanced': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gentle-silver/20 text-soft-gray border-stone-gray/20';
    }
  };

  const startTrigramStudy = async () => {
    if (!user) return;

    try {
      await fetch('/api/cultural/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: user.id,
          action: 'complete_concept_study',
          data: {
            concept_id: 'trigrams',
            study_duration: 5, // Initial exposure time
            completed_at: new Date().toISOString(),
          },
        }),
      });
    } catch (error) {
      console.error('Failed to track trigram study:', error);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-flowing-water"></div>
        <p className="text-soft-gray">Loading 64 hexagrams...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="mb-4 text-3xl font-bold text-ink-black">
          The 64 Hexagrams
        </h1>
        <p className="text-lg text-soft-gray mb-6">
          Explore the complete collection of I Ching hexagrams, each representing 
          a unique life situation and offering timeless wisdom for guidance.
        </p>
      </div>

      {/* Trigram Learning Section */}
      <Card variant="elevated" className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="text-xl">⚏</span>
            Understanding Trigrams
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <p className="text-soft-gray mb-4">
                Each hexagram is composed of two trigrams (three-line symbols). Understanding 
                trigrams is essential for deeper I Ching study, as they represent fundamental 
                forces and energies in nature.
              </p>
              
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-4 p-2 bg-gentle-silver/10 rounded">
                  <div className="w-8">
                    <div className="flex flex-col space-y-1">
                      <div className="w-6 h-0.5 bg-mountain-stone"></div>
                      <div className="w-6 h-0.5 bg-mountain-stone"></div>
                      <div className="w-6 h-0.5 bg-mountain-stone"></div>
                    </div>
                  </div>
                  <div>
                    <strong>Heaven 乾:</strong> Creative, strong, active
                  </div>
                </div>
                
                <div className="flex items-center gap-4 p-2 bg-gentle-silver/10 rounded">
                  <div className="w-8">
                    <div className="flex flex-col space-y-1">
                      <div className="w-6 h-0.5 bg-mountain-stone flex justify-center">
                        <div className="w-1.5 h-0.5 bg-paper-white"></div>
                      </div>
                      <div className="w-6 h-0.5 bg-mountain-stone flex justify-center">
                        <div className="w-1.5 h-0.5 bg-paper-white"></div>
                      </div>
                      <div className="w-6 h-0.5 bg-mountain-stone flex justify-center">
                        <div className="w-1.5 h-0.5 bg-paper-white"></div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <strong>Earth 坤:</strong> Receptive, yielding, nurturing
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-center">
              <div className="text-center">
                <div className="text-4xl mb-4">📚</div>
                {user && (
                  <Button onClick={startTrigramStudy} variant="outline">
                    Start Trigram Study
                  </Button>
                )}
                {!user && (
                  <Button variant="outline" disabled>
                    Sign in to track progress
                  </Button>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Search and Filters */}
      <Card variant="default" className="mb-8">
        <CardContent className="pt-6">
          <div className="grid md:grid-cols-3 gap-4">
            {/* Search */}
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

            {/* Category Filter */}
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

            {/* Difficulty Filter */}
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
        </CardContent>
      </Card>

      {/* Results Count */}
      <div className="text-sm text-soft-gray mb-4">
        Showing {filteredHexagrams.length} hexagrams
      </div>

      {/* Hexagram Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredHexagrams.map((hexagram) => (
          <Card key={hexagram.number} variant="default" className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-flowing-water text-white rounded-full w-10 h-10 flex items-center justify-center text-sm font-bold">
                    {hexagram.number}
                  </div>
                  <div>
                    <CardTitle className="text-lg leading-tight">
                      {hexagram.name}
                    </CardTitle>
                    <div className="text-lg text-soft-gray">{hexagram.chinese}</div>
                  </div>
                </div>
                <div className="ml-4">
                  {renderHexagramLines(hexagram.lines)}
                </div>
              </div>
            </CardHeader>

            <CardContent>
              <div className="space-y-3">
                {/* Keywords */}
                <div>
                  <div className="text-sm text-soft-gray mb-1">Keywords:</div>
                  <div className="flex flex-wrap gap-1">
                    {hexagram.keywords.map((keyword) => (
                      <span
                        key={keyword}
                        className="text-xs px-2 py-1 bg-gentle-silver/20 text-mountain-stone rounded-full"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Difficulty */}
                <div>
                  <span className={`text-xs px-2 py-1 rounded-full border ${getDifficultyColor(hexagram.difficulty)}`}>
                    {hexagram.difficulty}
                  </span>
                </div>

                {/* Action Button */}
                <div className="pt-2">
                  <Link href={`/learn/hexagrams/${hexagram.number}`}>
                    <Button variant="outline" size="sm" className="w-full">
                      Study Hexagram
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* No Results */}
      {filteredHexagrams.length === 0 && (
        <Card variant="default" className="text-center py-12">
          <CardContent>
            <div className="text-4xl mb-4">🔍</div>
            <h3 className="text-xl font-medium text-mountain-stone mb-2">
              No hexagrams found
            </h3>
            <p className="text-soft-gray mb-4">
              Try adjusting your search terms or filters to find relevant hexagrams.
            </p>
            <Button 
              variant="outline"
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
                setSelectedDifficulty('all');
              }}
            >
              Clear Filters
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Study Progress Note */}
      {user && (
        <Card variant="elevated" className="mt-8 border-blue-200 bg-blue-50">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <span className="text-xl">📈</span>
              <div>
                <h3 className="font-medium text-blue-800 mb-2">
                  Track Your Hexagram Learning
                </h3>
                <p className="text-sm text-blue-700">
                  As you study individual hexagrams, your progress will be tracked in your 
                  Cultural Progress dashboard. Mastering hexagram patterns contributes to 
                  understanding trigrams and advancing your I Ching knowledge.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}