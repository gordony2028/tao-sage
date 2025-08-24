'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Button from '@/components/ui/Button';

interface PhilosophySection {
  id: string;
  title: string;
  concept?: string; // Concept ID for progress tracking
  icon: string;
  difficulty: number;
  prerequisite?: string;
  content: React.ReactNode;
}

export default function TaoistPhilosophyPage() {
  const [user, setUser] = useState<any>(null);
  const [userProgress, setUserProgress] = useState<{conceptsMastered: string[]} | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedSections, setExpandedSections] = useState<string[]>(['wu-wei']); // Start with Wu Wei expanded
  const [studySessions, setStudySessions] = useState<Record<string, Date>>({});

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      
      if (user) {
        // Fetch user progress for concept prerequisites
        try {
          const response = await fetch(`/api/cultural/progress?user_id=${user.id}`);
          if (response.ok) {
            const progressData = await response.json();
            setUserProgress({
              conceptsMastered: progressData.statistics.conceptsMastered
            });
          }
        } catch (error) {
          console.error('Failed to load progress:', error);
        }
      }
      setLoading(false);
    };
    getUser();
  }, []);

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => 
      prev.includes(sectionId)
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const startConceptStudy = (conceptId: string) => {
    setStudySessions(prev => ({
      ...prev,
      [conceptId]: new Date()
    }));
  };

  const completeConceptStudy = async (conceptId: string) => {
    if (!user || !studySessions[conceptId]) return;

    const duration = Math.round((new Date().getTime() - studySessions[conceptId].getTime()) / (1000 * 60));
    
    try {
      await fetch('/api/cultural/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: user.id,
          action: 'complete_concept_study',
          data: {
            concept_id: conceptId,
            study_duration: duration,
            completed_at: new Date().toISOString(),
          },
        }),
      });

      // Update local progress
      setUserProgress(prev => ({
        conceptsMastered: [...(prev?.conceptsMastered || []), conceptId]
      }));

      // Clear study session
      setStudySessions(prev => {
        const { [conceptId]: _, ...rest } = prev;
        return rest;
      });
    } catch (error) {
      console.error('Failed to track concept completion:', error);
    }
  };

  const isConceptAvailable = (prerequisite?: string) => {
    if (!prerequisite) return true;
    return userProgress?.conceptsMastered.includes(prerequisite) || false;
  };

  const isConceptMastered = (conceptId?: string) => {
    if (!conceptId) return false;
    return userProgress?.conceptsMastered.includes(conceptId) || false;
  };

  const philosophySections: PhilosophySection[] = [
    {
      id: 'wu-wei',
      title: 'Wu Wei - The Art of Non-Action',
      concept: 'wu-wei',
      icon: '🌊',
      difficulty: 2,
      prerequisite: 'yin-yang', // Requires understanding of yin-yang
      content: (
        <div className="space-y-6">
          <div className="text-center mb-6">
            <div className="text-4xl mb-4">🌊</div>
            <h3 className="text-2xl font-medium text-mountain-stone mb-2">
              Wu Wei 無為
            </h3>
            <p className="text-soft-gray">Effortless Action in Harmony with Nature</p>
          </div>

          <p className="text-soft-gray leading-relaxed">
            Wu Wei (無為) is often translated as "non-action" or "effortless action," but it's more accurately 
            understood as acting in accordance with the natural flow of the universe. It represents the Taoist 
            ideal of achieving maximum effectiveness with minimum force, much like water flowing around obstacles 
            rather than fighting them.
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-flowing-water/10 rounded-lg p-4">
              <h4 className="font-medium text-mountain-stone mb-3 flex items-center gap-2">
                <span className="text-lg">💧</span> The Water Principle
              </h4>
              <p className="text-sm text-soft-gray mb-3">
                Water exemplifies Wu Wei perfectly. It always finds the path of least resistance, yet over time 
                it can carve through the hardest rock. Water doesn't fight the container; it takes its shape while 
                maintaining its essential nature.
              </p>
              <div className="text-xs text-soft-gray bg-white/50 rounded p-2">
                <strong>Practical Application:</strong> In conflict, yield when appropriate rather than meeting 
                force with force. Sometimes stepping aside allows problems to resolve themselves.
              </div>
            </div>

            <div className="bg-gentle-silver/10 rounded-lg p-4">
              <h4 className="font-medium text-mountain-stone mb-3 flex items-center gap-2">
                <span className="text-lg">🌱</span> Natural Timing
              </h4>
              <p className="text-sm text-soft-gray mb-3">
                Wu Wei involves understanding the right time for action and inaction. Like a farmer who doesn't 
                force seeds to grow but creates conditions for natural growth, we work with natural rhythms 
                rather than against them.
              </p>
              <div className="text-xs text-soft-gray bg-white/50 rounded p-2">
                <strong>In Daily Life:</strong> Recognize when to push forward with projects and when to step 
                back and let things develop naturally. Not every moment requires active intervention.
              </div>
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <h4 className="font-medium text-amber-800 mb-2">
              🎯 Wu Wei in Modern Practice
            </h4>
            <div className="text-sm text-amber-700 space-y-2">
              <div>
                <strong>Leadership:</strong> Guide by example rather than force. Create environments where others 
                can flourish naturally.
              </div>
              <div>
                <strong>Problem-Solving:</strong> Sometimes the best solution emerges when we stop trying so hard 
                and allow space for insights.
              </div>
              <div>
                <strong>Relationships:</strong> Listen deeply and respond authentically rather than trying to 
                control outcomes.
              </div>
              <div>
                <strong>Creative Work:</strong> Balance focused effort with receptive openness to inspiration.
              </div>
            </div>
          </div>

          <blockquote className="border-l-4 border-flowing-water pl-4 italic text-mountain-stone text-lg">
            "The highest good is like water, which nourishes all things and does not compete." 
            <footer className="text-sm text-soft-gray mt-2">— Tao Te Ching, Chapter 8</footer>
          </blockquote>
        </div>
      ),
    },
    {
      id: 'timing',
      title: 'Divine Timing and Natural Cycles',
      concept: 'timing',
      icon: '⏰',
      difficulty: 3,
      prerequisite: 'wu-wei',
      content: (
        <div className="space-y-6">
          <div className="text-center mb-6">
            <div className="text-4xl mb-4">⏰</div>
            <h3 className="text-2xl font-medium text-mountain-stone mb-2">
              Timing and Natural Cycles
            </h3>
            <p className="text-soft-gray">Understanding the Rhythm of Life</p>
          </div>

          <p className="text-soft-gray leading-relaxed">
            Taoist philosophy recognizes that everything in the universe moves in cycles and seasons. 
            Understanding timing—knowing when to act, when to wait, when to advance, and when to retreat—
            is essential wisdom for living in harmony with the natural order.
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-medium text-mountain-stone flex items-center gap-2">
                <span className="text-lg">🔄</span> The Cycle of Change
              </h4>
              
              <div className="bg-gentle-silver/10 rounded-lg p-4">
                <div className="text-center mb-4">
                  <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-flowing-water/20">
                    <div className="text-2xl">🌸</div>
                  </div>
                </div>
                <h5 className="font-medium text-center mb-2">Spring - Beginning</h5>
                <p className="text-sm text-soft-gray text-center">
                  Time for new initiatives, planting seeds, fresh starts
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gentle-silver/10 rounded-lg p-3 text-center">
                  <div className="text-xl mb-1">☀️</div>
                  <h6 className="font-medium text-sm">Summer</h6>
                  <p className="text-xs text-soft-gray">Growth, expansion, action</p>
                </div>
                <div className="bg-gentle-silver/10 rounded-lg p-3 text-center">
                  <div className="text-xl mb-1">🍂</div>
                  <h6 className="font-medium text-sm">Autumn</h6>
                  <p className="text-xs text-soft-gray">Harvest, completion, reflection</p>
                </div>
              </div>

              <div className="bg-gentle-silver/10 rounded-lg p-4">
                <div className="text-center mb-4">
                  <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-mountain-stone/20">
                    <div className="text-2xl">❄️</div>
                  </div>
                </div>
                <h5 className="font-medium text-center mb-2">Winter - Rest</h5>
                <p className="text-sm text-soft-gray text-center">
                  Time for rest, contemplation, inner development
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium text-mountain-stone flex items-center gap-2">
                <span className="text-lg">🎯</span> Recognizing Right Timing
              </h4>

              <div className="space-y-3">
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <h5 className="font-medium text-green-800 mb-1">Signs of Right Timing</h5>
                  <ul className="text-sm text-green-700 space-y-1">
                    <li>• Opportunities align naturally</li>
                    <li>• Actions flow with minimal resistance</li>
                    <li>• Inner sense of readiness and confidence</li>
                    <li>• External conditions support your goals</li>
                  </ul>
                </div>

                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <h5 className="font-medium text-red-800 mb-1">Signs of Poor Timing</h5>
                  <ul className="text-sm text-red-700 space-y-1">
                    <li>• Constant obstacles and resistance</li>
                    <li>• Forcing outcomes that don't flow</li>
                    <li>• Inner doubt or unease about actions</li>
                    <li>• External circumstances working against you</li>
                  </ul>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <h5 className="font-medium text-blue-800 mb-1">Cultivating Timing Awareness</h5>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Practice patience and observation</li>
                    <li>• Develop sensitivity to subtle cues</li>
                    <li>• Study natural cycles in your own life</li>
                    <li>• Learn from the rhythm of seasons</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-flowing-water/10 rounded-lg p-4">
            <h4 className="font-medium text-mountain-stone mb-2">
              🌙 Personal Timing Patterns
            </h4>
            <p className="text-sm text-soft-gray mb-3">
              Just as nature has seasons, each person has natural rhythms for different types of activities. 
              Some people are most creative in the morning, others late at night. Some need periods of intense 
              activity followed by rest, others prefer steady, consistent effort.
            </p>
            <div className="text-sm text-soft-gray">
              <strong>Reflection Questions:</strong>
              <ul className="mt-1 ml-4">
                <li>• When do you feel most energetic and creative?</li>
                <li>• What time of year do you naturally want to start new projects?</li>
                <li>• How do you know when you're pushing too hard versus not hard enough?</li>
                <li>• What are your natural cycles of activity and rest?</li>
              </ul>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'five-elements',
      title: 'The Five Elements System',
      concept: 'five-elements',
      icon: '🌍',
      difficulty: 3,
      prerequisite: 'timing',
      content: (
        <div className="space-y-6">
          <div className="text-center mb-6">
            <div className="text-4xl mb-4">🌍</div>
            <h3 className="text-2xl font-medium text-mountain-stone mb-2">
              Five Elements 五行
            </h3>
            <p className="text-soft-gray">The Fundamental Forces of Nature</p>
          </div>

          <p className="text-soft-gray leading-relaxed">
            The Five Elements (Wu Xing 五行) represent five fundamental phases or energies that govern 
            all natural processes. Unlike static elements, these are dynamic forces that interact in 
            predictable cycles, providing a framework for understanding change and balance in all aspects of life.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="text-center mb-3">
                <div className="text-3xl mb-2">🌳</div>
                <h4 className="font-medium text-green-800">Wood 木</h4>
              </div>
              <div className="text-sm text-green-700 space-y-2">
                <div><strong>Season:</strong> Spring</div>
                <div><strong>Direction:</strong> East</div>
                <div><strong>Qualities:</strong> Growth, expansion, creativity</div>
                <div><strong>Emotion:</strong> Vision, planning, anger (imbalanced)</div>
                <div><strong>In Life:</strong> Starting new projects, learning, career growth</div>
              </div>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="text-center mb-3">
                <div className="text-3xl mb-2">🔥</div>
                <h4 className="font-medium text-red-800">Fire 火</h4>
              </div>
              <div className="text-sm text-red-700 space-y-2">
                <div><strong>Season:</strong> Summer</div>
                <div><strong>Direction:</strong> South</div>
                <div><strong>Qualities:</strong> Transformation, joy, communication</div>
                <div><strong>Emotion:</strong> Enthusiasm, connection, anxiety (imbalanced)</div>
                <div><strong>In Life:</strong> Relationships, self-expression, peak performance</div>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="text-center mb-3">
                <div className="text-3xl mb-2">🏔️</div>
                <h4 className="font-medium text-yellow-800">Earth 土</h4>
              </div>
              <div className="text-sm text-yellow-700 space-y-2">
                <div><strong>Season:</strong> Late Summer</div>
                <div><strong>Direction:</strong> Center</div>
                <div><strong>Qualities:</strong> Stability, nurturing, grounding</div>
                <div><strong>Emotion:</strong> Caring, worry (imbalanced)</div>
                <div><strong>In Life:</strong> Home, family, providing support to others</div>
              </div>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <div className="text-center mb-3">
                <div className="text-3xl mb-2">⚔️</div>
                <h4 className="font-medium text-gray-800">Metal 金</h4>
              </div>
              <div className="text-sm text-gray-700 space-y-2">
                <div><strong>Season:</strong> Autumn</div>
                <div><strong>Direction:</strong> West</div>
                <div><strong>Qualities:</strong> Structure, precision, letting go</div>
                <div><strong>Emotion:</strong> Clarity, grief (imbalanced)</div>
                <div><strong>In Life:</strong> Organization, completion, spiritual practice</div>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="text-center mb-3">
                <div className="text-3xl mb-2">💧</div>
                <h4 className="font-medium text-blue-800">Water 水</h4>
              </div>
              <div className="text-sm text-blue-700 space-y-2">
                <div><strong>Season:</strong> Winter</div>
                <div><strong>Direction:</strong> North</div>
                <div><strong>Qualities:</strong> Depth, wisdom, conservation</div>
                <div><strong>Emotion:</strong> Calm reflection, fear (imbalanced)</div>
                <div><strong>In Life:</strong> Rest, meditation, inner development</div>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mt-8">
            <div className="bg-flowing-water/10 rounded-lg p-4">
              <h4 className="font-medium text-mountain-stone mb-3 flex items-center gap-2">
                <span className="text-lg">🔄</span> Generative Cycle
              </h4>
              <p className="text-sm text-soft-gray mb-3">
                Elements support each other in natural sequence:
              </p>
              <div className="text-sm text-soft-gray space-y-1">
                <div>🌳 Wood feeds 🔥 Fire</div>
                <div>🔥 Fire creates 🏔️ Earth (ash)</div>
                <div>🏔️ Earth contains ⚔️ Metal</div>
                <div>⚔️ Metal collects 💧 Water</div>
                <div>💧 Water nourishes 🌳 Wood</div>
              </div>
            </div>

            <div className="bg-gentle-silver/10 rounded-lg p-4">
              <h4 className="font-medium text-mountain-stone mb-3 flex items-center gap-2">
                <span className="text-lg">⚡</span> Destructive Cycle
              </h4>
              <p className="text-sm text-soft-gray mb-3">
                Elements can also restrain each other when excessive:
              </p>
              <div className="text-sm text-soft-gray space-y-1">
                <div>🌳 Wood depletes 🏔️ Earth</div>
                <div>🏔️ Earth absorbs 💧 Water</div>
                <div>💧 Water extinguishes 🔥 Fire</div>
                <div>🔥 Fire melts ⚔️ Metal</div>
                <div>⚔️ Metal cuts 🌳 Wood</div>
              </div>
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <h4 className="font-medium text-amber-800 mb-2">
              🎯 Practical Application
            </h4>
            <div className="text-sm text-amber-700 space-y-3">
              <div>
                <strong>Personal Balance:</strong> Recognize which elements are strong or weak in your life. 
                Too much Fire energy might mean you're burned out and need Water (rest). Too much Wood 
                might mean you're scattered and need Earth (grounding).
              </div>
              <div>
                <strong>Seasonal Living:</strong> Align activities with elemental seasons. Spring (Wood) 
                for new projects, Summer (Fire) for social activities, Autumn (Metal) for completion 
                and organization, Winter (Water) for rest and reflection.
              </div>
              <div>
                <strong>Relationship Harmony:</strong> Understand how different elemental personalities 
                interact. Water people provide calm for Fire people, Earth people ground Wood people's 
                enthusiasm.
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'seasonal-wisdom',
      title: 'Seasonal Wisdom and Natural Harmony',
      concept: 'seasonal-wisdom',
      icon: '🌸',
      difficulty: 4,
      prerequisite: 'five-elements',
      content: (
        <div className="space-y-6">
          <div className="text-center mb-6">
            <div className="text-4xl mb-4">🌸</div>
            <h3 className="text-2xl font-medium text-mountain-stone mb-2">
              Seasonal Wisdom
            </h3>
            <p className="text-soft-gray">Living in Harmony with Natural Cycles</p>
          </div>

          <p className="text-soft-gray leading-relaxed">
            Seasonal wisdom involves understanding and aligning with the natural rhythms that govern all 
            life on Earth. This advanced concept integrates timing, elements, and natural cycles into a 
            comprehensive framework for living in harmony with the universe.
          </p>

          <div className="bg-flowing-water/10 rounded-lg p-4">
            <h4 className="font-medium text-mountain-stone mb-2">
              🌊 The Great Rhythm
            </h4>
            <p className="text-sm text-soft-gray">
              Just as the I Ching teaches about the rhythm of change through its hexagrams, seasonal wisdom 
              recognizes the great rhythm that underlies all natural processes. This wisdom helps us understand 
              when to act and when to rest, when to expand and when to contract, when to express and when to 
              conserve.
            </p>
          </div>
        </div>
      ),
    },
    {
      id: 'emptiness',
      title: 'Emptiness and the Fullness of Space',
      concept: 'emptiness',
      icon: '⭕',
      difficulty: 4,
      prerequisite: 'seasonal-wisdom',
      content: (
        <div className="space-y-6">
          <div className="text-center mb-6">
            <div className="text-4xl mb-4">⭕</div>
            <h3 className="text-2xl font-medium text-mountain-stone mb-2">
              Emptiness and Space
            </h3>
            <p className="text-soft-gray">The Fertile Void and Creative Potential</p>
          </div>

          <p className="text-soft-gray leading-relaxed">
            In Taoist philosophy, emptiness is not nothingness but the pregnant void that contains all 
            possibilities. Like the hollow of a bowl that makes it useful, or the space between spokes 
            that makes a wheel functional, emptiness is the source of all utility and creativity.
          </p>

          <blockquote className="border-l-4 border-flowing-water pl-4 italic text-mountain-stone text-lg">
            "Thirty spokes share the wheel's hub; It is the center hole that makes it useful." 
            <footer className="text-sm text-soft-gray mt-2">— Tao Te Ching, Chapter 11</footer>
          </blockquote>
        </div>
      ),
    },
    {
      id: 'dao',
      title: 'The Dao - The Way of All Things',
      concept: 'dao',
      icon: '☯️',
      difficulty: 5,
      prerequisite: 'emptiness',
      content: (
        <div className="space-y-6">
          <div className="text-center mb-6">
            <div className="text-4xl mb-4">☯️</div>
            <h3 className="text-2xl font-medium text-mountain-stone mb-2">
              The Dao 道
            </h3>
            <p className="text-soft-gray">The Way That Cannot Be Named</p>
          </div>

          <p className="text-soft-gray leading-relaxed">
            The Dao is the ultimate mystery—the source and pattern of all existence. It cannot be fully 
            described or grasped intellectually, only experienced and lived. The Dao is the way of nature, 
            the principle behind all change, and the unity that underlies apparent diversity.
          </p>

          <blockquote className="border-l-4 border-flowing-water pl-4 italic text-mountain-stone text-lg">
            "The Dao that can be named is not the eternal Dao." 
            <footer className="text-sm text-soft-gray mt-2">— Tao Te Ching, Chapter 1</footer>
          </blockquote>

          <div className="bg-flowing-water/10 rounded-lg p-4">
            <h4 className="font-medium text-mountain-stone mb-2">
              🏮 Living the Dao
            </h4>
            <p className="text-sm text-soft-gray">
              To live in accordance with the Dao means to align with the natural order, to act with 
              spontaneity and authenticity, and to recognize the fundamental interconnectedness of all things. 
              This represents the culmination of Taoist wisdom and the deepest understanding of the I Ching's teachings.
            </p>
          </div>
        </div>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-flowing-water"></div>
        <p className="text-soft-gray">Loading Taoist philosophy...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="mb-4 text-3xl font-bold text-ink-black">
          Taoist Philosophy
        </h1>
        <p className="text-lg text-soft-gray mb-6">
          Explore the philosophical foundations that give depth and meaning to I Ching wisdom
        </p>
      </div>

      {/* Learning Path Overview */}
      <Card variant="elevated" className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="text-xl">🗺️</span>
            Learning Path Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl mb-2">🌊</div>
              <h3 className="font-medium text-mountain-stone mb-1">Foundation</h3>
              <p className="text-sm text-soft-gray">Wu Wei, Timing</p>
              <p className="text-xs text-soft-gray">Difficulty 2-3</p>
            </div>
            <div>
              <div className="text-2xl mb-2">🌍</div>
              <h3 className="font-medium text-mountain-stone mb-1">Integration</h3>
              <p className="text-sm text-soft-gray">Five Elements, Seasonal Wisdom</p>
              <p className="text-xs text-soft-gray">Difficulty 3-4</p>
            </div>
            <div>
              <div className="text-2xl mb-2">☯️</div>
              <h3 className="font-medium text-mountain-stone mb-1">Mastery</h3>
              <p className="text-sm text-soft-gray">Emptiness, The Dao</p>
              <p className="text-xs text-soft-gray">Difficulty 4-5</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Philosophy Sections */}
      <div className="space-y-6">
        {philosophySections.map((section) => {
          const isExpanded = expandedSections.includes(section.id);
          const isAvailable = isConceptAvailable(section.prerequisite);
          const isMastered = isConceptMastered(section.concept);
          const hasActiveStudySession = section.concept && studySessions[section.concept];

          return (
            <Card 
              key={section.id} 
              variant="default" 
              className={`overflow-hidden ${!isAvailable ? 'opacity-60' : ''}`}
            >
              <CardHeader 
                className={`cursor-pointer transition-colors ${
                  isAvailable 
                    ? 'hover:bg-gentle-silver/10' 
                    : 'cursor-not-allowed'
                }`}
                onClick={() => isAvailable && toggleSection(section.id)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">{section.icon}</span>
                    <div>
                      <CardTitle className="text-lg leading-tight">
                        {section.title}
                      </CardTitle>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-xs px-2 py-1 bg-gentle-silver/20 text-soft-gray rounded-full">
                          Difficulty {section.difficulty}
                        </span>
                        {section.prerequisite && (
                          <span className="text-xs text-soft-gray">
                            Requires: {section.prerequisite}
                          </span>
                        )}
                        {isMastered && (
                          <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full">
                            ✓ Mastered
                          </span>
                        )}
                        {hasActiveStudySession && (
                          <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
                            📖 Studying
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {!isAvailable && (
                      <span className="text-xs px-2 py-1 bg-red-100 text-red-700 rounded-full">
                        🔒 Locked
                      </span>
                    )}
                    <span className={`transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
                      ▼
                    </span>
                  </div>
                </div>
              </CardHeader>
              
              {isExpanded && isAvailable && (
                <CardContent className="pt-0">
                  {section.content}
                  
                  {/* Study Controls */}
                  {user && section.concept && (
                    <div className="mt-6 pt-6 border-t border-stone-gray/20">
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-soft-gray">
                          {hasActiveStudySession && (
                            <span>Study session started at {studySessions[section.concept].toLocaleTimeString()}</span>
                          )}
                          {isMastered && (
                            <span className="text-green-600">✓ Concept mastered</span>
                          )}
                        </div>
                        
                        <div className="flex gap-2">
                          {!hasActiveStudySession && !isMastered && (
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => startConceptStudy(section.concept!)}
                            >
                              📚 Start Study Session
                            </Button>
                          )}
                          
                          {hasActiveStudySession && (
                            <Button 
                              variant="primary" 
                              size="sm"
                              onClick={() => completeConceptStudy(section.concept!)}
                            >
                              ✅ Complete Study
                            </Button>
                          )}
                          
                          {isMastered && (
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => startConceptStudy(section.concept!)}
                            >
                              📖 Review Concept
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              )}
            </Card>
          );
        })}
      </div>

      {/* Progress Summary */}
      {user && userProgress && (
        <Card variant="elevated" className="mt-8 border-blue-200 bg-blue-50">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <span className="text-xl">📊</span>
              <div>
                <h3 className="font-medium text-blue-800 mb-2">
                  Your Philosophy Learning Progress
                </h3>
                <div className="text-sm text-blue-700">
                  <div>Concepts mastered: {userProgress.conceptsMastered.filter(concept => 
                    philosophySections.some(s => s.concept === concept)
                  ).length} / {philosophySections.filter(s => s.concept).length}</div>
                  <div className="mt-2">
                    Studying philosophy concepts contributes to your overall I Ching mastery and 
                    unlocks advanced understanding of hexagram interpretations.
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}