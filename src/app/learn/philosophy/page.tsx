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
  const [userProgress, setUserProgress] = useState<{
    conceptsMastered: string[];
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedSections, setExpandedSections] = useState<string[]>([
    'wu-wei',
  ]); // Start with Wu Wei expanded
  const [studySessions, setStudySessions] = useState<Record<string, Date>>({});

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);

      if (user) {
        // Fetch user progress for concept prerequisites
        try {
          const response = await fetch(
            `/api/cultural/progress?user_id=${user.id}`
          );
          if (response.ok) {
            const progressData = await response.json();
            setUserProgress({
              conceptsMastered: progressData.statistics.conceptsMastered,
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
      [conceptId]: new Date(),
    }));
  };

  const completeConceptStudy = async (conceptId: string) => {
    if (!user || !studySessions[conceptId]) return;

    const duration = Math.round(
      (new Date().getTime() - studySessions[conceptId].getTime()) / (1000 * 60)
    );

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
        conceptsMastered: [...(prev?.conceptsMastered || []), conceptId],
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
          <div className="mb-6 text-center">
            <div className="mb-4 text-4xl">🌊</div>
            <h3 className="mb-2 text-2xl font-medium text-mountain-stone">
              Wu Wei 無為
            </h3>
            <p className="text-soft-gray">
              Effortless Action in Harmony with Nature
            </p>
          </div>

          <p className="leading-relaxed text-soft-gray">
            Wu Wei (無為) is often translated as &ldquo;non-action&rdquo; or
            &ldquo;effortless action,&rdquo; but it&apos;s more accurately
            understood as acting in accordance with the natural flow of the
            universe. It represents the Taoist ideal of achieving maximum
            effectiveness with minimum force, much like water flowing around
            obstacles rather than fighting them.
          </p>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-lg bg-flowing-water/10 p-4">
              <h4 className="mb-3 flex items-center gap-2 font-medium text-mountain-stone">
                <span className="text-lg">💧</span> The Water Principle
              </h4>
              <p className="mb-3 text-sm text-soft-gray">
                Water exemplifies Wu Wei perfectly. It always finds the path of
                least resistance, yet over time it can carve through the hardest
                rock. Water doesn&apos;t fight the container; it takes its shape
                while maintaining its essential nature.
              </p>
              <div className="rounded bg-white/50 p-2 text-xs text-soft-gray">
                <strong>Practical Application:</strong> In conflict, yield when
                appropriate rather than meeting force with force. Sometimes
                stepping aside allows problems to resolve themselves.
              </div>
            </div>

            <div className="rounded-lg bg-gentle-silver/10 p-4">
              <h4 className="mb-3 flex items-center gap-2 font-medium text-mountain-stone">
                <span className="text-lg">🌱</span> Natural Timing
              </h4>
              <p className="mb-3 text-sm text-soft-gray">
                Wu Wei involves understanding the right time for action and
                inaction. Like a farmer who doesn&apos;t force seeds to grow but
                creates conditions for natural growth, we work with natural
                rhythms rather than against them.
              </p>
              <div className="rounded bg-white/50 p-2 text-xs text-soft-gray">
                <strong>In Daily Life:</strong> Recognize when to push forward
                with projects and when to step back and let things develop
                naturally. Not every moment requires active intervention.
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
            <h4 className="mb-2 font-medium text-amber-800">
              🎯 Wu Wei in Modern Practice
            </h4>
            <div className="space-y-2 text-sm text-amber-700">
              <div>
                <strong>Leadership:</strong> Guide by example rather than force.
                Create environments where others can flourish naturally.
              </div>
              <div>
                <strong>Problem-Solving:</strong> Sometimes the best solution
                emerges when we stop trying so hard and allow space for
                insights.
              </div>
              <div>
                <strong>Relationships:</strong> Listen deeply and respond
                authentically rather than trying to control outcomes.
              </div>
              <div>
                <strong>Creative Work:</strong> Balance focused effort with
                receptive openness to inspiration.
              </div>
            </div>
          </div>

          <blockquote className="border-l-4 border-flowing-water pl-4 text-lg italic text-mountain-stone">
            &ldquo;The highest good is like water, which nourishes all things
            and does not compete.&rdquo;
            <footer className="mt-2 text-sm text-soft-gray">
              — Tao Te Ching, Chapter 8
            </footer>
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
          <div className="mb-6 text-center">
            <div className="mb-4 text-4xl">⏰</div>
            <h3 className="mb-2 text-2xl font-medium text-mountain-stone">
              Timing and Natural Cycles
            </h3>
            <p className="text-soft-gray">Understanding the Rhythm of Life</p>
          </div>

          <p className="leading-relaxed text-soft-gray">
            Taoist philosophy recognizes that everything in the universe moves
            in cycles and seasons. Understanding timing—knowing when to act,
            when to wait, when to advance, and when to retreat— is essential
            wisdom for living in harmony with the natural order.
          </p>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <h4 className="flex items-center gap-2 font-medium text-mountain-stone">
                <span className="text-lg">🔄</span> The Cycle of Change
              </h4>

              <div className="rounded-lg bg-gentle-silver/10 p-4">
                <div className="mb-4 text-center">
                  <div className="inline-flex h-24 w-24 items-center justify-center rounded-full bg-flowing-water/20">
                    <div className="text-2xl">🌸</div>
                  </div>
                </div>
                <h5 className="mb-2 text-center font-medium">
                  Spring - Beginning
                </h5>
                <p className="text-center text-sm text-soft-gray">
                  Time for new initiatives, planting seeds, fresh starts
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-lg bg-gentle-silver/10 p-3 text-center">
                  <div className="mb-1 text-xl">☀️</div>
                  <h6 className="text-sm font-medium">Summer</h6>
                  <p className="text-xs text-soft-gray">
                    Growth, expansion, action
                  </p>
                </div>
                <div className="rounded-lg bg-gentle-silver/10 p-3 text-center">
                  <div className="mb-1 text-xl">🍂</div>
                  <h6 className="text-sm font-medium">Autumn</h6>
                  <p className="text-xs text-soft-gray">
                    Harvest, completion, reflection
                  </p>
                </div>
              </div>

              <div className="rounded-lg bg-gentle-silver/10 p-4">
                <div className="mb-4 text-center">
                  <div className="inline-flex h-24 w-24 items-center justify-center rounded-full bg-mountain-stone/20">
                    <div className="text-2xl">❄️</div>
                  </div>
                </div>
                <h5 className="mb-2 text-center font-medium">Winter - Rest</h5>
                <p className="text-center text-sm text-soft-gray">
                  Time for rest, contemplation, inner development
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="flex items-center gap-2 font-medium text-mountain-stone">
                <span className="text-lg">🎯</span> Recognizing Right Timing
              </h4>

              <div className="space-y-3">
                <div className="rounded-lg border border-green-200 bg-green-50 p-3">
                  <h5 className="mb-1 font-medium text-green-800">
                    Signs of Right Timing
                  </h5>
                  <ul className="space-y-1 text-sm text-green-700">
                    <li>• Opportunities align naturally</li>
                    <li>• Actions flow with minimal resistance</li>
                    <li>• Inner sense of readiness and confidence</li>
                    <li>• External conditions support your goals</li>
                  </ul>
                </div>

                <div className="rounded-lg border border-red-200 bg-red-50 p-3">
                  <h5 className="mb-1 font-medium text-red-800">
                    Signs of Poor Timing
                  </h5>
                  <ul className="space-y-1 text-sm text-red-700">
                    <li>• Constant obstacles and resistance</li>
                    <li>• Forcing outcomes that don&apos;t flow</li>
                    <li>• Inner doubt or unease about actions</li>
                    <li>• External circumstances working against you</li>
                  </ul>
                </div>

                <div className="rounded-lg border border-blue-200 bg-blue-50 p-3">
                  <h5 className="mb-1 font-medium text-blue-800">
                    Cultivating Timing Awareness
                  </h5>
                  <ul className="space-y-1 text-sm text-blue-700">
                    <li>• Practice patience and observation</li>
                    <li>• Develop sensitivity to subtle cues</li>
                    <li>• Study natural cycles in your own life</li>
                    <li>• Learn from the rhythm of seasons</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-lg bg-flowing-water/10 p-4">
            <h4 className="mb-2 font-medium text-mountain-stone">
              🌙 Personal Timing Patterns
            </h4>
            <p className="mb-3 text-sm text-soft-gray">
              Just as nature has seasons, each person has natural rhythms for
              different types of activities. Some people are most creative in
              the morning, others late at night. Some need periods of intense
              activity followed by rest, others prefer steady, consistent
              effort.
            </p>
            <div className="text-sm text-soft-gray">
              <strong>Reflection Questions:</strong>
              <ul className="ml-4 mt-1">
                <li>• When do you feel most energetic and creative?</li>
                <li>
                  • What time of year do you naturally want to start new
                  projects?
                </li>
                <li>
                  • How do you know when you&apos;re pushing too hard versus not
                  hard enough?
                </li>
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
          <div className="mb-6 text-center">
            <div className="mb-4 text-4xl">🌍</div>
            <h3 className="mb-2 text-2xl font-medium text-mountain-stone">
              Five Elements 五行
            </h3>
            <p className="text-soft-gray">The Fundamental Forces of Nature</p>
          </div>

          <p className="leading-relaxed text-soft-gray">
            The Five Elements (Wu Xing 五行) represent five fundamental phases
            or energies that govern all natural processes. Unlike static
            elements, these are dynamic forces that interact in predictable
            cycles, providing a framework for understanding change and balance
            in all aspects of life.
          </p>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-lg border border-green-200 bg-green-50 p-4">
              <div className="mb-3 text-center">
                <div className="mb-2 text-3xl">🌳</div>
                <h4 className="font-medium text-green-800">Wood 木</h4>
              </div>
              <div className="space-y-2 text-sm text-green-700">
                <div>
                  <strong>Season:</strong> Spring
                </div>
                <div>
                  <strong>Direction:</strong> East
                </div>
                <div>
                  <strong>Qualities:</strong> Growth, expansion, creativity
                </div>
                <div>
                  <strong>Emotion:</strong> Vision, planning, anger (imbalanced)
                </div>
                <div>
                  <strong>In Life:</strong> Starting new projects, learning,
                  career growth
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-red-200 bg-red-50 p-4">
              <div className="mb-3 text-center">
                <div className="mb-2 text-3xl">🔥</div>
                <h4 className="font-medium text-red-800">Fire 火</h4>
              </div>
              <div className="space-y-2 text-sm text-red-700">
                <div>
                  <strong>Season:</strong> Summer
                </div>
                <div>
                  <strong>Direction:</strong> South
                </div>
                <div>
                  <strong>Qualities:</strong> Transformation, joy, communication
                </div>
                <div>
                  <strong>Emotion:</strong> Enthusiasm, connection, anxiety
                  (imbalanced)
                </div>
                <div>
                  <strong>In Life:</strong> Relationships, self-expression, peak
                  performance
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
              <div className="mb-3 text-center">
                <div className="mb-2 text-3xl">🏔️</div>
                <h4 className="font-medium text-yellow-800">Earth 土</h4>
              </div>
              <div className="space-y-2 text-sm text-yellow-700">
                <div>
                  <strong>Season:</strong> Late Summer
                </div>
                <div>
                  <strong>Direction:</strong> Center
                </div>
                <div>
                  <strong>Qualities:</strong> Stability, nurturing, grounding
                </div>
                <div>
                  <strong>Emotion:</strong> Caring, worry (imbalanced)
                </div>
                <div>
                  <strong>In Life:</strong> Home, family, providing support to
                  others
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
              <div className="mb-3 text-center">
                <div className="mb-2 text-3xl">⚔️</div>
                <h4 className="font-medium text-gray-800">Metal 金</h4>
              </div>
              <div className="space-y-2 text-sm text-gray-700">
                <div>
                  <strong>Season:</strong> Autumn
                </div>
                <div>
                  <strong>Direction:</strong> West
                </div>
                <div>
                  <strong>Qualities:</strong> Structure, precision, letting go
                </div>
                <div>
                  <strong>Emotion:</strong> Clarity, grief (imbalanced)
                </div>
                <div>
                  <strong>In Life:</strong> Organization, completion, spiritual
                  practice
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
              <div className="mb-3 text-center">
                <div className="mb-2 text-3xl">💧</div>
                <h4 className="font-medium text-blue-800">Water 水</h4>
              </div>
              <div className="space-y-2 text-sm text-blue-700">
                <div>
                  <strong>Season:</strong> Winter
                </div>
                <div>
                  <strong>Direction:</strong> North
                </div>
                <div>
                  <strong>Qualities:</strong> Depth, wisdom, conservation
                </div>
                <div>
                  <strong>Emotion:</strong> Calm reflection, fear (imbalanced)
                </div>
                <div>
                  <strong>In Life:</strong> Rest, meditation, inner development
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <div className="rounded-lg bg-flowing-water/10 p-4">
              <h4 className="mb-3 flex items-center gap-2 font-medium text-mountain-stone">
                <span className="text-lg">🔄</span> Generative Cycle
              </h4>
              <p className="mb-3 text-sm text-soft-gray">
                Elements support each other in natural sequence:
              </p>
              <div className="space-y-1 text-sm text-soft-gray">
                <div>🌳 Wood feeds 🔥 Fire</div>
                <div>🔥 Fire creates 🏔️ Earth (ash)</div>
                <div>🏔️ Earth contains ⚔️ Metal</div>
                <div>⚔️ Metal collects 💧 Water</div>
                <div>💧 Water nourishes 🌳 Wood</div>
              </div>
            </div>

            <div className="rounded-lg bg-gentle-silver/10 p-4">
              <h4 className="mb-3 flex items-center gap-2 font-medium text-mountain-stone">
                <span className="text-lg">⚡</span> Destructive Cycle
              </h4>
              <p className="mb-3 text-sm text-soft-gray">
                Elements can also restrain each other when excessive:
              </p>
              <div className="space-y-1 text-sm text-soft-gray">
                <div>🌳 Wood depletes 🏔️ Earth</div>
                <div>🏔️ Earth absorbs 💧 Water</div>
                <div>💧 Water extinguishes 🔥 Fire</div>
                <div>🔥 Fire melts ⚔️ Metal</div>
                <div>⚔️ Metal cuts 🌳 Wood</div>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
            <h4 className="mb-2 font-medium text-amber-800">
              🎯 Practical Application
            </h4>
            <div className="space-y-3 text-sm text-amber-700">
              <div>
                <strong>Personal Balance:</strong> Recognize which elements are
                strong or weak in your life. Too much Fire energy might mean
                you&apos;re burned out and need Water (rest). Too much Wood
                might mean you&apos;re scattered and need Earth (grounding).
              </div>
              <div>
                <strong>Seasonal Living:</strong> Align activities with
                elemental seasons. Spring (Wood) for new projects, Summer (Fire)
                for social activities, Autumn (Metal) for completion and
                organization, Winter (Water) for rest and reflection.
              </div>
              <div>
                <strong>Relationship Harmony:</strong> Understand how different
                elemental personalities interact. Water people provide calm for
                Fire people, Earth people ground Wood people&apos;s enthusiasm.
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
          <div className="mb-6 text-center">
            <div className="mb-4 text-4xl">🌸</div>
            <h3 className="mb-2 text-2xl font-medium text-mountain-stone">
              Seasonal Wisdom and Natural Harmony
            </h3>
            <p className="text-soft-gray">
              Living in Harmony with the Great Rhythms of Nature
            </p>
          </div>

          <p className="leading-relaxed text-soft-gray">
            Seasonal wisdom represents the profound understanding that all life
            moves in great cycles, and true wisdom lies in aligning ourselves
            with these natural rhythms. This advanced concept integrates the
            Five Elements with timing and natural cycles, creating a
            comprehensive framework for living in harmony with the
            universe&apos;s deepest patterns.
          </p>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-lg bg-gentle-silver/10 p-4">
              <h4 className="mb-3 flex items-center gap-2 font-medium text-mountain-stone">
                <span className="text-lg">🌊</span> The Great Rhythm
              </h4>
              <p className="mb-3 text-sm text-soft-gray">
                Just as the I Ching teaches about change through its hexagrams,
                seasonal wisdom recognizes the great rhythm underlying all
                natural processes. This rhythm governs everything from the
                cosmic dance of planets to the quiet growth of plants, from the
                cycles of our own energy to the rise and fall of civilizations.
              </p>
              <div className="rounded bg-white/50 p-2 text-xs text-soft-gray">
                <strong>Personal Application:</strong> Notice your own natural
                rhythms - times of high energy and creativity, periods of rest
                and reflection. Honor these cycles rather than forcing constant
                productivity.
              </div>
            </div>

            <div className="rounded-lg bg-flowing-water/10 p-4">
              <h4 className="mb-3 flex items-center gap-2 font-medium text-mountain-stone">
                <span className="text-lg">🌍</span> Elemental Seasons
              </h4>
              <p className="mb-3 text-sm text-soft-gray">
                Each season corresponds to one of the Five Elements, creating a
                living mandala of energy throughout the year. Spring awakens
                Wood energy (growth, expansion), Summer expresses Fire (joy,
                connection), Late Summer embodies Earth (grounding,
                nourishment), Autumn manifests Metal (reflection, refinement),
                Winter embraces Water (rest, deep wisdom).
              </p>
              <div className="rounded bg-white/50 p-2 text-xs text-soft-gray">
                <strong>Seasonal Practice:</strong> Adjust your activities,
                diet, and focus to match the dominant seasonal energy. Plant new
                projects in spring, celebrate in summer, harvest wisdom in
                autumn, rest deeply in winter.
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
            <h4 className="mb-2 font-medium text-amber-800">
              🌱 The Agricultural Wisdom of the I Ching
            </h4>
            <div className="space-y-2 text-sm text-amber-700">
              <p>
                Many hexagrams reference farming and natural cycles, reflecting
                the agricultural roots of Chinese civilization. This connection
                teaches us that spiritual wisdom and practical life must be
                integrated—we cannot separate inner development from outer
                harmony with nature.
              </p>
              <div className="mt-3 grid gap-3 md:grid-cols-2">
                <div>
                  <strong>Spring Energy (Wood):</strong> Hexagrams like Thunder
                  (震) and Wind (巽) represent the stirring of new life,
                  breakthrough moments, and gentle but persistent growth.
                </div>
                <div>
                  <strong>Autumn Energy (Metal):</strong> Hexagrams like Heaven
                  (乾) and Lake (兌) embody the clarity, structure, and joyful
                  completion that comes with harvest time.
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-medium text-mountain-stone">
              🎭 Living Seasonal Wisdom
            </h4>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-3">
                <div className="rounded-lg border border-green-200 bg-green-50 p-3">
                  <h5 className="mb-1 font-medium text-green-800">
                    Spring & Summer (Yang Seasons)
                  </h5>
                  <ul className="space-y-1 text-sm text-green-700">
                    <li>• Embrace expansion and outward expression</li>
                    <li>• Start new projects and relationships</li>
                    <li>• Engage more actively with the world</li>
                    <li>• Express creativity and take calculated risks</li>
                    <li>• Focus on building and growing</li>
                  </ul>
                </div>
              </div>
              <div className="space-y-3">
                <div className="rounded-lg border border-blue-200 bg-blue-50 p-3">
                  <h5 className="mb-1 font-medium text-blue-800">
                    Autumn & Winter (Yin Seasons)
                  </h5>
                  <ul className="space-y-1 text-sm text-blue-700">
                    <li>• Turn inward for reflection and contemplation</li>
                    <li>• Complete projects and harvest wisdom</li>
                    <li>• Practice letting go of what no longer serves</li>
                    <li>• Cultivate patience and inner strength</li>
                    <li>• Focus on conservation and preparation</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <blockquote className="border-l-4 border-flowing-water pl-4 text-lg italic text-mountain-stone">
            &ldquo;To everything there is a season, and a time to every purpose
            under heaven.&rdquo;
            <footer className="mt-2 text-sm text-soft-gray">
              — Ecclesiastes 3:1 (echoing universal wisdom)
            </footer>
          </blockquote>
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
          <div className="mb-6 text-center">
            <div className="mb-4 text-4xl">⭕</div>
            <h3 className="mb-2 text-2xl font-medium text-mountain-stone">
              Emptiness and the Fullness of Space
            </h3>
            <p className="text-soft-gray">
              The Fertile Void from Which All Possibilities Emerge
            </p>
          </div>

          <p className="leading-relaxed text-soft-gray">
            In Taoist philosophy, emptiness (虛 xū) is not nothingness but the
            pregnant void that contains all possibilities. This profound concept
            challenges Western thinking about &ldquo;empty&rdquo; spaces. Like
            the hollow of a bowl that makes it useful, the space between spokes
            that makes a wheel functional, or the silence between notes that
            gives music meaning, emptiness is the source of all utility,
            creativity, and potential.
          </p>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-lg bg-gentle-silver/10 p-4">
              <h4 className="mb-3 flex items-center gap-2 font-medium text-mountain-stone">
                <span className="text-lg">🏺</span> Sacred Emptiness
              </h4>
              <p className="mb-3 text-sm text-soft-gray">
                The Tao Te Ching repeatedly uses examples of useful emptiness:
                the hollow of a vessel, the doorway that allows passage, the
                windows that bring light. These teach us that what appears to be
                &ldquo;nothing&rdquo; is actually the space where everything
                becomes possible. In meditation, we learn to rest in this
                spacious awareness.
              </p>
              <div className="rounded bg-white/50 p-2 text-xs text-soft-gray">
                <strong>Practice:</strong> Sit quietly and notice the space
                around thoughts, the pause between breaths, the silence between
                sounds. This is where wisdom arises naturally.
              </div>
            </div>

            <div className="rounded-lg bg-flowing-water/10 p-4">
              <h4 className="mb-3 flex items-center gap-2 font-medium text-mountain-stone">
                <span className="text-lg">🌌</span> Emptiness in the I Ching
              </h4>
              <p className="mb-3 text-sm text-soft-gray">
                Several hexagrams embody this principle of creative emptiness.
                Hexagram 2 (Earth, Kun 坤) represents the receptive void that
                nurtures all growth. Hexagram 41 (Decrease, Sun 損) teaches
                about the creative power of reduction. These show how apparent
                loss or emptiness can be the foundation for new abundance.
              </p>
              <div className="rounded bg-white/50 p-2 text-xs text-soft-gray">
                <strong>Wisdom:</strong> Sometimes the most powerful action is
                non-action, the most helpful words are unspoken, the most
                creative state is emptiness.
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-purple-200 bg-purple-50 p-4">
            <h4 className="mb-2 font-medium text-purple-800">
              🧘 The Practice of Emptiness
            </h4>
            <div className="space-y-3 text-sm text-purple-700">
              <p>
                Cultivating appreciation for emptiness transforms how we
                experience life. Instead of constantly filling every moment with
                activity or every space with objects, we learn to appreciate the
                power of the pause, the beauty of simplicity, the creativity of
                the unplanned moment.
              </p>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <h5 className="mb-2 font-medium">🏠 Physical Space</h5>
                  <ul className="space-y-1 text-xs">
                    <li>• Create areas of visual calm in your home</li>
                    <li>• Appreciate negative space in art and design</li>
                    <li>
                      • Allow rooms to &ldquo;breathe&rdquo; with open areas
                    </li>
                    <li>• Practice minimalism as spiritual discipline</li>
                  </ul>
                </div>
                <div>
                  <h5 className="mb-2 font-medium">⏰ Time and Schedule</h5>
                  <ul className="space-y-1 text-xs">
                    <li>• Build buffer time between appointments</li>
                    <li>• Practice sitting without entertainment</li>
                    <li>• Allow conversations to have natural pauses</li>
                    <li>• Embrace boredom as creative potential</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-medium text-mountain-stone">
              💫 Emptiness and Fullness - A Paradox
            </h4>
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
              <p className="mb-3 text-sm text-slate-700">
                Advanced Taoist thought reveals that emptiness and fullness are
                not opposites but complementary aspects of the same reality. The
                deepest emptiness contains infinite fullness; the most complete
                fullness returns to essential emptiness. This paradox appears
                throughout Taoist texts and I Ching imagery.
              </p>
              <div className="grid gap-3 text-xs md:grid-cols-3">
                <div>
                  <strong>In Nature:</strong> The apparent emptiness of space
                  contains all the energy and matter of the universe in
                  potential form.
                </div>
                <div>
                  <strong>In Mind:</strong> The empty, calm mind is most full of
                  awareness and wisdom. Cluttered thinking obscures natural
                  clarity.
                </div>
                <div>
                  <strong>In Relationships:</strong> Creating space for others
                  allows the relationship to be filled with authentic connection
                  and mutual growth.
                </div>
              </div>
            </div>
          </div>

          <blockquote className="border-l-4 border-flowing-water pl-4 text-lg italic text-mountain-stone">
            &ldquo;Thirty spokes share the wheel&apos;s hub; It is the center
            hole that makes it useful. Shape clay into a vessel; It is the space
            within that makes it useful. Cut doors and windows for a room; It is
            the holes which make it useful.&rdquo;
            <footer className="mt-2 text-sm text-soft-gray">
              — Tao Te Ching, Chapter 11
            </footer>
          </blockquote>

          <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
            <h4 className="mb-2 font-medium text-yellow-800">
              🎨 Creative Emptiness in Daily Life
            </h4>
            <p className="text-sm text-yellow-700">
              The principle of creative emptiness can revolutionize how we
              approach problem-solving, relationships, and creative work.
              Instead of always trying to add more—more effort, more ideas, more
              activity—we learn when to subtract, when to create space, when to
              allow solutions to emerge from the pregnant void of not-knowing.
            </p>
          </div>
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
          <div className="mb-6 text-center">
            <div className="mb-4 text-4xl">☯️</div>
            <h3 className="mb-2 text-2xl font-medium text-mountain-stone">
              The Dao 道 - The Way of All Things
            </h3>
            <p className="text-soft-gray">
              The Ultimate Mystery and Source of All Existence
            </p>
          </div>

          <p className="leading-relaxed text-soft-gray">
            The Dao (道) is the ultimate mystery—the source, pattern, and
            destination of all existence. It cannot be fully described or
            grasped intellectually, only experienced and lived. The Dao is
            simultaneously the way of nature, the principle behind all change,
            the unity that underlies apparent diversity, and the path that leads
            us back to our original nature. Understanding the Dao represents the
            culmination of all Taoist wisdom and the deepest realization
            possible through I Ching study.
          </p>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-lg bg-gentle-silver/10 p-4">
              <h4 className="mb-3 flex items-center gap-2 font-medium text-mountain-stone">
                <span className="text-lg">🌌</span> The Ineffable Source
              </h4>
              <p className="mb-3 text-sm text-soft-gray">
                The Dao exists before heaven and earth, before yin and yang,
                before all names and forms. It is the mysterious female, the
                valley spirit that never dies, the root from which all things
                grow and to which they return. Yet this source is not separate
                from creation— it flows through every moment, every breath,
                every hexagram casting.
              </p>
              <div className="rounded bg-white/50 p-2 text-xs text-soft-gray">
                <strong>Contemplation:</strong> The Dao is closer than your
                breath, simpler than your thoughts, yet more vast than the
                cosmos. It is what allows you to read these words.
              </div>
            </div>

            <div className="rounded-lg bg-flowing-water/10 p-4">
              <h4 className="mb-3 flex items-center gap-2 font-medium text-mountain-stone">
                <span className="text-lg">🎭</span> The Dao and the I Ching
              </h4>
              <p className="mb-3 text-sm text-soft-gray">
                The I Ching is sometimes called the &ldquo;Book of the
                Dao&rdquo; because its 64 hexagrams map the fundamental patterns
                through which the Dao expresses itself in the world of change.
                Each hexagram represents a particular way the Dao manifests in
                time and space, from the pure creative power of Heaven (乾) to
                the perfect receptivity of Earth (坤).
              </p>
              <div className="rounded bg-white/50 p-2 text-xs text-soft-gray">
                <strong>Practice:</strong> When consulting the I Ching,
                you&apos;re not asking fortune-telling questions but aligning
                with the Dao&apos;s movement in this moment.
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
            <h4 className="mb-2 font-medium text-amber-800">
              🏮 Living the Dao - The Three Treasures
            </h4>
            <div className="space-y-3 text-sm text-amber-700">
              <p>
                Lao Tzu teaches that there are three treasures for following the
                Dao: compassion (慈 cí), frugality (儉 jiǎn), and not striving
                to be first (不敢為天下先 bù gǎn wéi tiānxià xiān). These
                qualities naturally arise when we align with the Dao&apos;s way
                of flowing with rather than against the natural order.
              </p>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded bg-white/70 p-3">
                  <h5 className="mb-1 font-medium text-amber-800">
                    💝 Compassion
                  </h5>
                  <p className="text-xs">
                    Seeing all beings as expressions of the same Dao, natural
                    kindness and empathy arise without effort or pretense.
                  </p>
                </div>
                <div className="rounded bg-white/70 p-3">
                  <h5 className="mb-1 font-medium text-amber-800">
                    🍃 Simplicity
                  </h5>
                  <p className="text-xs">
                    Living simply, taking only what is needed, avoiding excess
                    and waste in harmony with natural cycles.
                  </p>
                </div>
                <div className="rounded bg-white/70 p-3">
                  <h5 className="mb-1 font-medium text-amber-800">
                    🎋 Humility
                  </h5>
                  <p className="text-xs">
                    Not competing for status or recognition, allowing others to
                    shine while remaining centered in the Dao.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-medium text-mountain-stone">
              🌊 The Dao in Daily Life
            </h4>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
                <h5 className="mb-2 font-medium text-blue-800">
                  Morning Alignment
                </h5>
                <ul className="space-y-1 text-sm text-blue-700">
                  <li>• Begin each day by sensing the Dao&apos;s movement</li>
                  <li>
                    • Ask: &ldquo;How wants to flow through me today?&rdquo;
                  </li>
                  <li>• Listen deeply before making plans</li>
                  <li>
                    • Align actions with natural energy rather than forcing
                  </li>
                </ul>
              </div>
              <div className="rounded-lg border border-green-200 bg-green-50 p-4">
                <h5 className="mb-2 font-medium text-green-800">
                  Decision Making
                </h5>
                <ul className="space-y-1 text-sm text-green-700">
                  <li>• Seek the path that flows naturally</li>
                  <li>• Choose simplicity over complexity when possible</li>
                  <li>• Consider the welfare of all beings affected</li>
                  <li>
                    • Trust the wisdom of &ldquo;don&apos;t know&rdquo; mind
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-indigo-200 bg-indigo-50 p-4">
            <h4 className="mb-2 font-medium text-indigo-800">
              ☯️ The Great Unity - Beyond Duality
            </h4>
            <p className="mb-3 text-sm text-indigo-700">
              The deepest realization about the Dao is that it transcends all
              dualities while manifesting through them. Good and bad, success
              and failure, gain and loss—all are movements of the one Dao. This
              doesn&apos;t mean becoming passive, but rather acting from the
              understanding that we are not separate from the cosmic process.
            </p>
            <div className="rounded bg-white/70 p-2 text-xs text-indigo-600">
              <strong>Advanced Practice:</strong> In challenging moments,
              instead of asking &ldquo;Why me?&rdquo; try asking &ldquo;How is
              the Dao expressing itself through this situation?&rdquo; This
              shift in perspective can transform suffering into wisdom.
            </div>
          </div>

          <blockquote className="border-l-4 border-flowing-water pl-4 text-lg italic text-mountain-stone">
            &ldquo;The Dao that can be named is not the eternal Dao. The name
            that can be named is not the eternal name. Nameless, it is the
            source of heaven and earth. Named, it is the mother of all
            things.&rdquo;
            <footer className="mt-2 text-sm text-soft-gray">
              — Tao Te Ching, Chapter 1
            </footer>
          </blockquote>

          <div className="rounded-lg border border-purple-200 bg-purple-50 p-4">
            <h4 className="mb-2 font-medium text-purple-800">
              🎯 The Dao and Personal Transformation
            </h4>
            <p className="text-sm text-purple-700">
              Following the Dao is not about becoming someone else or achieving
              a special state. It&apos;s about returning to your original
              nature—the self you were before you learned to be someone. This
              return happens naturally as we release what is artificial and
              allow what is authentic to emerge. The I Ching guides this process
              by showing us which patterns serve life and which create
              unnecessary suffering.
            </p>
          </div>

          <div className="rounded-lg bg-gentle-silver/10 p-6 text-center">
            <div className="mb-2 text-3xl">🌸</div>
            <p className="text-sm italic text-soft-gray">
              &ldquo;Return to your original nature. This is the highest
              teaching of the Dao.&rdquo;
            </p>
            <p className="mt-2 text-xs text-soft-gray">
              — Traditional Taoist saying
            </p>
          </div>
        </div>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="py-12 text-center">
        <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-flowing-water"></div>
        <p className="text-soft-gray">Loading Taoist philosophy...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl">
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="mb-4 text-3xl font-bold text-ink-black">
          Taoist Philosophy
        </h1>
        <p className="mb-6 text-lg text-soft-gray">
          Explore the philosophical foundations that give depth and meaning to I
          Ching wisdom
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
          <div className="grid gap-4 text-center md:grid-cols-3">
            <div>
              <div className="mb-2 text-2xl">🌊</div>
              <h3 className="mb-1 font-medium text-mountain-stone">
                Foundation
              </h3>
              <p className="text-sm text-soft-gray">Wu Wei, Timing</p>
              <p className="text-xs text-soft-gray">Difficulty 2-3</p>
            </div>
            <div>
              <div className="mb-2 text-2xl">🌍</div>
              <h3 className="mb-1 font-medium text-mountain-stone">
                Integration
              </h3>
              <p className="text-sm text-soft-gray">
                Five Elements, Seasonal Wisdom
              </p>
              <p className="text-xs text-soft-gray">Difficulty 3-4</p>
            </div>
            <div>
              <div className="mb-2 text-2xl">☯️</div>
              <h3 className="mb-1 font-medium text-mountain-stone">Mastery</h3>
              <p className="text-sm text-soft-gray">Emptiness, The Dao</p>
              <p className="text-xs text-soft-gray">Difficulty 4-5</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Philosophy Sections */}
      <div className="space-y-6">
        {philosophySections.map(section => {
          const isExpanded = expandedSections.includes(section.id);
          const isAvailable = isConceptAvailable(section.prerequisite);
          const isMastered = isConceptMastered(section.concept);
          const hasActiveStudySession =
            section.concept && studySessions[section.concept];

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
                      <div className="mt-1 flex items-center gap-3">
                        <span className="rounded-full bg-gentle-silver/20 px-2 py-1 text-xs text-soft-gray">
                          Difficulty {section.difficulty}
                        </span>
                        {section.prerequisite && (
                          <span className="text-xs text-soft-gray">
                            Requires: {section.prerequisite}
                          </span>
                        )}
                        {isMastered && (
                          <span className="rounded-full bg-green-100 px-2 py-1 text-xs text-green-700">
                            ✓ Mastered
                          </span>
                        )}
                        {hasActiveStudySession && (
                          <span className="rounded-full bg-blue-100 px-2 py-1 text-xs text-blue-700">
                            📖 Studying
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {!isAvailable && (
                      <span className="rounded-full bg-red-100 px-2 py-1 text-xs text-red-700">
                        🔒 Locked
                      </span>
                    )}
                    <span
                      className={`transform transition-transform ${
                        isExpanded ? 'rotate-180' : ''
                      }`}
                    >
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
                    <div className="mt-6 border-t border-stone-gray/20 pt-6">
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-soft-gray">
                          {hasActiveStudySession && (
                            <span>
                              Study session started at{' '}
                              {studySessions[
                                section.concept
                              ].toLocaleTimeString()}
                            </span>
                          )}
                          {isMastered && (
                            <span className="text-green-600">
                              ✓ Concept mastered
                            </span>
                          )}
                        </div>

                        <div className="flex gap-2">
                          {!hasActiveStudySession && !isMastered && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                startConceptStudy(section.concept!)
                              }
                            >
                              📚 Start Study Session
                            </Button>
                          )}

                          {hasActiveStudySession && (
                            <Button
                              variant="primary"
                              size="sm"
                              onClick={() =>
                                completeConceptStudy(section.concept!)
                              }
                            >
                              ✅ Complete Study
                            </Button>
                          )}

                          {isMastered && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                startConceptStudy(section.concept!)
                              }
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
                <h3 className="mb-2 font-medium text-blue-800">
                  Your Philosophy Learning Progress
                </h3>
                <div className="text-sm text-blue-700">
                  <div>
                    Concepts mastered:{' '}
                    {
                      userProgress.conceptsMastered.filter(concept =>
                        philosophySections.some(s => s.concept === concept)
                      ).length
                    }{' '}
                    / {philosophySections.filter(s => s.concept).length}
                  </div>
                  <div className="mt-2">
                    Studying philosophy concepts contributes to your overall I
                    Ching mastery and unlocks advanced understanding of hexagram
                    interpretations.
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
