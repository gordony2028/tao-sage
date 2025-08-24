'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { HEXAGRAMS, getHexagram, type HexagramData } from '@/data/hexagrams';

interface HexagramDetail {
  number: number;
  name: string;
  chinese: string;
  pinyin: string;
  lines: ('yin' | 'yang')[];
  upperTrigram: {
    name: string;
    chinese: string;
    meaning: string;
    lines: ('yin' | 'yang')[];
  };
  lowerTrigram: {
    name: string;
    chinese: string;
    meaning: string;
    lines: ('yin' | 'yang')[];
  };
  keywords: string[];
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  judgment: string;
  image: string;
  interpretation: {
    general: string;
    relationships: string;
    career: string;
    personal: string;
  };
  historical: string;
  relatedHexagrams: number[];
}

// Using complete hexagram database from /src/data/hexagrams.ts

export default function HexagramDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [studyStartTime, setStudyStartTime] = useState<Date | null>(null);
  const [isBookmarked, setIsBookmarked] = useState(false);

  const hexagramNumber = parseInt(params.number as string);
  const baseHexagram = getHexagram(hexagramNumber);
  
  // Adapt our simple database to match the expected interface
  const hexagram = baseHexagram ? {
    ...baseHexagram,
    upperTrigram: { 
      name: baseHexagram.upperTrigram, 
      chinese: baseHexagram.upperTrigram, 
      meaning: 'Traditional trigram', 
      lines: baseHexagram.lines.slice(3) as ('yin' | 'yang')[]
    },
    lowerTrigram: { 
      name: baseHexagram.lowerTrigram, 
      chinese: baseHexagram.lowerTrigram, 
      meaning: 'Traditional trigram', 
      lines: baseHexagram.lines.slice(0, 3) as ('yin' | 'yang')[]
    },
    judgment: `The ${baseHexagram.name} brings guidance through ${baseHexagram.keywords.slice(0, 2).join(' and ')}.`,
    image: `This hexagram represents ${baseHexagram.keywords[0]} and teaches us about ${baseHexagram.keywords.slice(1, 3).join(' and ')}.`,
    interpretation: {
      general: `${baseHexagram.name} represents ${baseHexagram.keywords.join(', ')}. This hexagram is categorized under ${baseHexagram.category} and is considered ${baseHexagram.difficulty} level for study.`,
      career: `In career matters, ${baseHexagram.name} suggests focusing on ${baseHexagram.keywords[0]} and ${baseHexagram.keywords[1] || 'personal growth'}.`,
      relationships: `For relationships, this hexagram emphasizes ${baseHexagram.keywords[1] || 'understanding'} and ${baseHexagram.keywords[2] || 'harmony'}.`,
      personal: `For personal development, ${baseHexagram.name} encourages ${baseHexagram.keywords.slice(-2).join(' and ')}.`
    },
    historical: `Hexagram ${baseHexagram.number} (${baseHexagram.chinese}) is one of the 64 traditional hexagrams of the I Ching, representing the interplay between ${baseHexagram.upperTrigram} and ${baseHexagram.lowerTrigram}.`,
    relatedHexagrams: [1, 2, 3].filter(n => n !== baseHexagram.number) // Simple related hexagrams
  } : null;

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
    };
    getUser();
  }, []);

  useEffect(() => {
    // Start study session when page loads
    setStudyStartTime(new Date());
  }, []);

  const renderHexagramLines = (lines: ('yin' | 'yang')[], showLabels = false) => {
    return (
      <div className="flex flex-col items-center space-y-2">
        {lines.slice().reverse().map((line, index) => (
          <div key={index} className="flex items-center gap-3">
            {showLabels && (
              <span className="text-xs text-soft-gray w-12 text-right">
                Line {6 - index}
              </span>
            )}
            <div className="w-12 h-1.5">
              {line === 'yang' ? (
                // Yang line: solid line
                <div className="w-full h-full bg-mountain-stone rounded-sm"></div>
              ) : (
                // Yin line: broken line with clear gap
                <div className="flex justify-between items-center h-full">
                  <div className="w-5 h-full bg-mountain-stone rounded-sm"></div>
                  <div className="w-5 h-full bg-mountain-stone rounded-sm"></div>
                </div>
              )}
            </div>
            {showLabels && (
              <span className="text-xs text-soft-gray w-16">
                {line === 'yang' ? 'Yang ⚊' : 'Yin ⚋'}
              </span>
            )}
          </div>
        ))}
      </div>
    );
  };

  const renderTrigram = (trigram: { name: string; chinese: string; meaning: string; lines: ('yin' | 'yang')[] }) => {
    return (
      <div className="text-center">
        <div className="mb-2">
          {renderHexagramLines(trigram.lines)}
        </div>
        <div className="text-sm font-medium text-mountain-stone">{trigram.name}</div>
        <div className="text-lg text-soft-gray">{trigram.chinese}</div>
        <div className="text-xs text-soft-gray">{trigram.meaning}</div>
      </div>
    );
  };

  const completeHexagramStudy = async () => {
    if (!user || !studyStartTime) return;

    const duration = Math.round((new Date().getTime() - studyStartTime.getTime()) / (1000 * 60));

    try {
      // Track hexagram study completion
      await fetch('/api/cultural/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: user.id,
          action: 'complete_concept_study',
          data: {
            concept_id: 'trigrams', // Studying individual hexagrams contributes to trigram understanding
            study_duration: duration,
            completed_at: new Date().toISOString(),
          },
        }),
      });
    } catch (error) {
      console.error('Failed to track hexagram study:', error);
    }
  };

  if (!hexagram) {
    return (
      <div className="max-w-4xl mx-auto text-center py-12">
        <div className="text-4xl mb-4">❓</div>
        <h1 className="text-2xl font-bold text-mountain-stone mb-4">
          Hexagram {hexagramNumber} Not Found
        </h1>
        <p className="text-soft-gray mb-6">
          The hexagram you're looking for is not yet available in our educational database.
        </p>
        <div className="flex justify-center gap-4">
          <Link href="/learn/hexagrams">
            <Button variant="primary">Browse All Hexagrams</Button>
          </Link>
          <Button variant="outline" onClick={() => router.back()}>
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-flowing-water"></div>
        <p className="text-soft-gray">Loading hexagram details...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-sm text-soft-gray mb-4">
          <Link href="/learn" className="hover:text-flowing-water">Learn</Link>
          <span>›</span>
          <Link href="/learn/hexagrams" className="hover:text-flowing-water">64 Hexagrams</Link>
          <span>›</span>
          <span>Hexagram {hexagram.number}</span>
        </div>
        
        <div className="text-center">
          <div className="flex justify-center mb-6">
            {renderHexagramLines(hexagram.lines, true)}
          </div>
          
          <h1 className="text-3xl font-bold text-ink-black mb-2">
            {hexagram.name}
          </h1>
          <div className="text-2xl text-soft-gray mb-2">{hexagram.chinese}</div>
          <div className="text-sm text-soft-gray mb-4">Hexagram {hexagram.number} • {hexagram.pinyin}</div>
          
          <div className="flex justify-center gap-4 mb-6">
            <span className="text-xs px-3 py-1 bg-gentle-silver/20 text-mountain-stone rounded-full">
              {hexagram.category}
            </span>
            <span className={`text-xs px-3 py-1 rounded-full ${
              hexagram.difficulty === 'beginner' ? 'bg-green-100 text-green-700' :
              hexagram.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-700' :
              'bg-red-100 text-red-700'
            }`}>
              {hexagram.difficulty}
            </span>
          </div>

          <div className="flex flex-wrap justify-center gap-2">
            {hexagram.keywords.map((keyword) => (
              <span
                key={keyword}
                className="text-sm px-3 py-1 bg-flowing-water/10 text-flowing-water rounded-full"
              >
                {keyword}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Trigram Structure */}
      <Card variant="elevated" className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="text-xl">⚏</span>
            Trigram Structure
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-medium text-mountain-stone mb-4 text-center">
                Upper Trigram (Heaven)
              </h3>
              {renderTrigram(hexagram.upperTrigram)}
            </div>
            <div>
              <h3 className="text-lg font-medium text-mountain-stone mb-4 text-center">
                Lower Trigram (Earth)
              </h3>
              {renderTrigram(hexagram.lowerTrigram)}
            </div>
          </div>
          
          <div className="mt-6 pt-6 border-t border-stone-gray/20 text-center">
            <p className="text-sm text-soft-gray">
              The interaction between these trigrams creates the unique energy and meaning of this hexagram.
              Understanding trigram combinations deepens your I Ching knowledge.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Classical Texts */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <Card variant="default">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-lg">⚖️</span>
              The Judgment
            </CardTitle>
          </CardHeader>
          <CardContent>
            <blockquote className="text-mountain-stone italic text-lg leading-relaxed border-l-4 border-flowing-water pl-4">
              "{hexagram.judgment}"
            </blockquote>
          </CardContent>
        </Card>

        <Card variant="default">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-lg">🖼️</span>
              The Image
            </CardTitle>
          </CardHeader>
          <CardContent>
            <blockquote className="text-mountain-stone italic text-lg leading-relaxed border-l-4 border-flowing-water pl-4">
              "{hexagram.image}"
            </blockquote>
          </CardContent>
        </Card>
      </div>

      {/* Interpretations */}
      <Card variant="default" className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="text-xl">💭</span>
            Modern Interpretations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-mountain-stone mb-3 flex items-center gap-2">
                <span className="text-sm">🎯</span> General Guidance
              </h3>
              <p className="text-sm text-soft-gray leading-relaxed mb-4">
                {hexagram.interpretation.general}
              </p>

              <h3 className="font-medium text-mountain-stone mb-3 flex items-center gap-2">
                <span className="text-sm">💼</span> Career & Work
              </h3>
              <p className="text-sm text-soft-gray leading-relaxed">
                {hexagram.interpretation.career}
              </p>
            </div>

            <div>
              <h3 className="font-medium text-mountain-stone mb-3 flex items-center gap-2">
                <span className="text-sm">❤️</span> Relationships
              </h3>
              <p className="text-sm text-soft-gray leading-relaxed mb-4">
                {hexagram.interpretation.relationships}
              </p>

              <h3 className="font-medium text-mountain-stone mb-3 flex items-center gap-2">
                <span className="text-sm">🌱</span> Personal Growth
              </h3>
              <p className="text-sm text-soft-gray leading-relaxed">
                {hexagram.interpretation.personal}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Historical Context */}
      <Card variant="default" className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="text-xl">📚</span>
            Historical Context
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-soft-gray leading-relaxed">
            {hexagram.historical}
          </p>
        </CardContent>
      </Card>

      {/* Related Hexagrams */}
      {hexagram.relatedHexagrams.length > 0 && (
        <Card variant="default" className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-xl">🔗</span>
              Related Hexagrams
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              {hexagram.relatedHexagrams.map((num) => (
                <Link key={num} href={`/learn/hexagrams/${num}`}>
                  <Button variant="outline" size="sm">
                    Hexagram {num}
                  </Button>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Actions */}
      <Card variant="elevated" className="mb-8">
        <CardContent className="pt-6">
          <div className="flex flex-wrap justify-center gap-4">
            {user && (
              <Button onClick={completeHexagramStudy} variant="primary">
                Complete Study Session
              </Button>
            )}
            <Link href="/consultation">
              <Button variant="outline">
                Consult with this Hexagram
              </Button>
            </Link>
            <Link href="/learn/hexagrams">
              <Button variant="outline">
                Browse All Hexagrams
              </Button>
            </Link>
            {user && (
              <Button 
                variant="outline"
                onClick={() => setIsBookmarked(!isBookmarked)}
                className={isBookmarked ? 'bg-yellow-50 text-yellow-700 border-yellow-200' : ''}
              >
                {isBookmarked ? '⭐ Bookmarked' : '☆ Bookmark'}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Study Progress Note */}
      {user && studyStartTime && (
        <Card variant="default" className="border-blue-200 bg-blue-50">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <span className="text-xl">📈</span>
              <div>
                <h3 className="font-medium text-blue-800 mb-2">
                  Study Session Active
                </h3>
                <p className="text-sm text-blue-700">
                  Started at {studyStartTime.toLocaleTimeString()}. 
                  Studying individual hexagrams contributes to your trigram mastery and 
                  overall I Ching knowledge progression.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}