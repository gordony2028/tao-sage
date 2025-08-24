'use client';

import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Button from '@/components/ui/Button';

export interface HexagramData {
  number: number;
  name: string;
  chinese: string;
  lines: ('yin' | 'yang')[];
  keywords: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category: 'self' | 'relationships' | 'work' | 'growth' | 'change' | 'timing';
}

interface HexagramCardProps {
  hexagram: HexagramData;
  onStudy?: (hexagram: HexagramData) => void;
  showStudyButton?: boolean;
  compact?: boolean;
}

export default function HexagramCard({ 
  hexagram, 
  onStudy, 
  showStudyButton = true, 
  compact = false 
}: HexagramCardProps) {
  const renderHexagramLines = (lines: ('yin' | 'yang')[]) => {
    return (
      <div className="flex flex-col items-center space-y-1">
        {lines.slice().reverse().map((line, index) => (
          <div
            key={index}
            className={`${compact ? 'w-6 h-0.5' : 'w-8 h-1'} ${
              line === 'yang' 
                ? 'bg-mountain-stone' 
                : 'bg-mountain-stone flex justify-center'
            }`}
          >
            {line === 'yin' && <div className={`${compact ? 'w-1.5 h-0.5' : 'w-2 h-1'} bg-paper-white`}></div>}
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

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'self': return '🧘';
      case 'relationships': return '❤️';
      case 'work': return '💼';
      case 'growth': return '🌱';
      case 'change': return '🔄';
      case 'timing': return '⏰';
      default: return '📖';
    }
  };

  return (
    <Card variant="default" className="hover:shadow-lg transition-shadow h-full">
      <CardHeader className={compact ? 'pb-2' : 'pb-4'}>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3 flex-1">
            <div className={`bg-flowing-water text-white rounded-full ${
              compact ? 'w-8 h-8 text-xs' : 'w-10 h-10 text-sm'
            } flex items-center justify-center font-bold flex-shrink-0`}>
              {hexagram.number}
            </div>
            <div className="min-w-0 flex-1">
              <CardTitle className={`${compact ? 'text-base' : 'text-lg'} leading-tight`}>
                {hexagram.name}
              </CardTitle>
              <div className={`${compact ? 'text-base' : 'text-lg'} text-soft-gray`}>
                {hexagram.chinese}
              </div>
            </div>
          </div>
          <div className="ml-4 flex-shrink-0">
            {renderHexagramLines(hexagram.lines)}
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-3">
          {/* Category & Difficulty */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm">{getCategoryIcon(hexagram.category)}</span>
              <span className="text-xs text-soft-gray capitalize">{hexagram.category}</span>
            </div>
            <span className={`text-xs px-2 py-1 rounded-full border ${getDifficultyColor(hexagram.difficulty)}`}>
              {hexagram.difficulty}
            </span>
          </div>

          {/* Keywords */}
          <div>
            <div className="text-sm text-soft-gray mb-1">Keywords:</div>
            <div className="flex flex-wrap gap-1">
              {hexagram.keywords.slice(0, compact ? 2 : 5).map((keyword) => (
                <span
                  key={keyword}
                  className="text-xs px-2 py-1 bg-gentle-silver/20 text-mountain-stone rounded-full"
                >
                  {keyword}
                </span>
              ))}
              {hexagram.keywords.length > (compact ? 2 : 5) && (
                <span className="text-xs px-2 py-1 bg-gentle-silver/20 text-soft-gray rounded-full">
                  +{hexagram.keywords.length - (compact ? 2 : 5)} more
                </span>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-2">
            <div className="flex gap-2">
              <Link href={`/learn/hexagrams/${hexagram.number}`} className="flex-1">
                <Button variant="outline" size={compact ? 'sm' : 'sm'} className="w-full">
                  Study Hexagram
                </Button>
              </Link>
              
              {showStudyButton && onStudy && (
                <Button 
                  variant="outline" 
                  size={compact ? 'sm' : 'sm'}
                  onClick={() => onStudy(hexagram)}
                  className="flex-shrink-0"
                >
                  📚
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}