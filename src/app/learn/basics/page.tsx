'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Button from '@/components/ui/Button';

export default function IChinngBasicsPage() {
  const [user, setUser] = useState<any>(null);
  const [studySession, setStudySession] = useState<{
    startTime: Date;
    completedSections: string[];
    currentSection: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
    };
    getUser();
  }, []);

  const startStudySession = () => {
    setStudySession({
      startTime: new Date(),
      completedSections: [],
      currentSection: 'what-is-iching',
    });
  };

  const completeSection = (sectionId: string) => {
    if (!studySession) return;

    setStudySession(prev => ({
      ...prev!,
      completedSections: [...prev!.completedSections, sectionId],
    }));
  };

  const completeStudy = async (conceptId: string) => {
    if (!user || !studySession) return;

    const duration = Math.round(
      (new Date().getTime() - studySession.startTime.getTime()) / (1000 * 60)
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
    } catch (error) {
      console.error('Failed to track concept completion:', error);
    }
  };

  const sections = [
    {
      id: 'what-is-iching',
      title: 'What is the I Ching?',
      concept: 'change',
      content: (
        <div className="space-y-4">
          <p className="leading-relaxed text-soft-gray">
            The I Ching (易經), also known as the Book of Changes, is one of the
            oldest and most revered texts in Chinese philosophy. Dating back
            over 3,000 years, it serves as both a divination system and a
            philosophical framework for understanding the nature of change and
            transformation in the universe.
          </p>

          <div className="rounded-lg bg-flowing-water/10 p-4">
            <h4 className="mb-2 font-medium text-mountain-stone">
              🔄 The Principle of Change
            </h4>
            <p className="text-sm text-soft-gray">
              At its core, the I Ching teaches that change is the only constant
              in life. Everything in the universe is in a state of continuous
              transformation, following natural patterns and cycles that can be
              understood and harmonized with.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-lg bg-gentle-silver/10 p-4">
              <h4 className="mb-2 font-medium text-mountain-stone">
                Historical Significance
              </h4>
              <ul className="space-y-1 text-sm text-soft-gray">
                <li>• Origins in ancient Chinese divination practices</li>
                <li>• Developed during Zhou Dynasty (1000 BC)</li>
                <li>• Influenced by sages including King Wen and Confucius</li>
                <li>• Foundation for Taoist and Confucian philosophy</li>
              </ul>
            </div>

            <div className="rounded-lg bg-gentle-silver/10 p-4">
              <h4 className="mb-2 font-medium text-mountain-stone">
                Modern Relevance
              </h4>
              <ul className="space-y-1 text-sm text-soft-gray">
                <li>• Personal decision-making framework</li>
                <li>• Understanding life transitions</li>
                <li>• Meditation and self-reflection tool</li>
                <li>• Guidance for timing and strategy</li>
              </ul>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'yin-yang-principle',
      title: 'The Yin-Yang Principle',
      concept: 'yin-yang',
      content: (
        <div className="space-y-4">
          <div className="mb-6 text-center">
            <div className="mb-4 inline-block text-6xl">☯️</div>
            <h3 className="text-2xl font-medium text-mountain-stone">
              Yin-Yang 阴阳
            </h3>
            <p className="text-soft-gray">
              The Dance of Complementary Opposites
            </p>
          </div>

          <p className="leading-relaxed text-soft-gray">
            Yin-Yang is the fundamental principle underlying all I Ching wisdom.
            It represents the understanding that seemingly opposite forces are
            actually complementary and interdependent, creating balance and
            harmony through their interaction.
          </p>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-3">
              <h4 className="flex items-center gap-2 font-medium text-mountain-stone">
                <span className="text-xl">🌙</span> Yin Qualities
              </h4>
              <div className="rounded-lg bg-stone-gray/10 p-4">
                <ul className="space-y-2 text-sm text-soft-gray">
                  <li>• Receptive, passive, yielding</li>
                  <li>• Earth, water, moon, night</li>
                  <li>• Feminine, nurturing, intuitive</li>
                  <li>• Inward, contemplative, restful</li>
                  <li>• Cool, dark, soft, gentle</li>
                </ul>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="flex items-center gap-2 font-medium text-mountain-stone">
                <span className="text-xl">☀️</span> Yang Qualities
              </h4>
              <div className="rounded-lg bg-flowing-water/10 p-4">
                <ul className="space-y-2 text-sm text-soft-gray">
                  <li>• Active, dynamic, assertive</li>
                  <li>• Heaven, fire, sun, day</li>
                  <li>• Masculine, creative, logical</li>
                  <li>• Outward, expressive, energetic</li>
                  <li>• Warm, bright, firm, strong</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="rounded-lg bg-flowing-water/10 p-4">
            <h4 className="mb-2 font-medium text-mountain-stone">
              🔄 The Dynamic Balance
            </h4>
            <p className="mb-3 text-sm text-soft-gray">
              Yin and Yang are not static opposites but are in constant motion,
              each containing the seed of the other. This dynamic interaction
              creates the rhythm of life itself.
            </p>
            <div className="text-sm text-soft-gray">
              <strong>Key Principles:</strong>
              <ul className="ml-4 mt-1">
                <li>• Nothing is purely Yin or purely Yang</li>
                <li>• Each contains the potential for its opposite</li>
                <li>• They transform into each other cyclically</li>
                <li>
                  • Balance comes through their interaction, not domination
                </li>
              </ul>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'consultation-basics',
      title: 'How Consultations Work',
      concept: null,
      content: (
        <div className="space-y-4">
          <p className="leading-relaxed text-soft-gray">
            An I Ching consultation is a contemplative process that helps you
            gain insight into a situation or question. Unlike fortune-telling,
            the I Ching provides guidance for understanding the present moment
            and potential directions for growth.
          </p>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-lg bg-gentle-silver/10 p-4 text-center">
              <div className="mb-3 text-2xl">🤔</div>
              <h4 className="mb-2 font-medium text-mountain-stone">
                1. Formulate Question
              </h4>
              <p className="text-sm text-soft-gray">
                Reflect deeply on your situation and formulate a sincere,
                specific question
              </p>
            </div>

            <div className="rounded-lg bg-gentle-silver/10 p-4 text-center">
              <div className="mb-3 text-2xl">🎯</div>
              <h4 className="mb-2 font-medium text-mountain-stone">
                2. Generate Hexagram
              </h4>
              <p className="text-sm text-soft-gray">
                Use traditional methods or our digital system to create your
                unique hexagram
              </p>
            </div>

            <div className="rounded-lg bg-gentle-silver/10 p-4 text-center">
              <div className="mb-3 text-2xl">🧘</div>
              <h4 className="mb-2 font-medium text-mountain-stone">
                3. Contemplate Meaning
              </h4>
              <p className="text-sm text-soft-gray">
                Study the traditional interpretation and reflect on its
                relevance to your situation
              </p>
            </div>
          </div>

          <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
            <h4 className="mb-2 font-medium text-amber-800">
              📝 Effective Question Guidelines
            </h4>
            <div className="space-y-2 text-sm text-amber-700">
              <div>
                <strong>Good questions:</strong>
                <ul className="ml-4 mt-1">
                  <li>
                    • &ldquo;How can I approach this relationship
                    challenge?&rdquo;
                  </li>
                  <li>
                    • &ldquo;What should I consider about this career
                    decision?&rdquo;
                  </li>
                  <li>
                    • &ldquo;How can I grow from this difficult
                    situation?&rdquo;
                  </li>
                </ul>
              </div>
              <div>
                <strong>Avoid:</strong>
                <ul className="ml-4 mt-1">
                  <li>• Yes/no questions</li>
                  <li>• Questions about specific future events</li>
                  <li>• Asking repeatedly about the same issue</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="rounded-lg bg-flowing-water/10 p-4">
            <h4 className="mb-2 font-medium text-mountain-stone">
              🏮 Traditional Coin Method
            </h4>
            <p className="mb-2 text-sm text-soft-gray">
              The traditional method uses three coins, cast six times to build a
              hexagram from bottom to top:
            </p>
            <div className="text-sm text-soft-gray">
              <ul className="ml-4">
                <li>• 3 Heads = Old Yang (changing line) ⚊</li>
                <li>• 2 Heads, 1 Tail = Young Yang ⚊</li>
                <li>• 1 Head, 2 Tails = Young Yin ⚋</li>
                <li>• 3 Tails = Old Yin (changing line) ⚋</li>
              </ul>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'understanding-hexagrams',
      title: 'Understanding Hexagrams',
      concept: null,
      content: (
        <div className="space-y-4">
          <p className="leading-relaxed text-soft-gray">
            A hexagram is a six-line symbol composed of broken (Yin) and
            unbroken (Yang) lines. Each hexagram represents a specific life
            situation, energy pattern, or archetypal experience, offering wisdom
            for navigation and growth.
          </p>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <h4 className="font-medium text-mountain-stone">
                Hexagram Structure
              </h4>

              <div className="rounded-lg bg-gentle-silver/10 p-4">
                <div className="mb-4 text-center">
                  <div className="space-y-1 font-mono text-lg">
                    <div>⚊ ⚊ Line 6 (top)</div>
                    <div>⚋ ⚋ Line 5</div>
                    <div>⚊ ⚊ Line 4</div>
                    <div>⚋ ⚋ Line 3</div>
                    <div>⚊ ⚊ Line 2</div>
                    <div>⚋ ⚋ Line 1 (bottom)</div>
                  </div>
                  <p className="mt-2 text-sm text-soft-gray">
                    Example: Hexagram #8 - 比 (Holding Together)
                  </p>
                </div>
              </div>

              <div className="text-sm text-soft-gray">
                <p>
                  <strong>Reading Direction:</strong> Hexagrams are read from
                  bottom to top, representing the progression from foundation to
                  culmination.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium text-mountain-stone">Components</h4>

              <div className="space-y-3">
                <div className="rounded-lg bg-flowing-water/10 p-3">
                  <h5 className="text-sm font-medium text-mountain-stone">
                    Traditional Name
                  </h5>
                  <p className="text-xs text-soft-gray">
                    Each hexagram has a Chinese name and meaning, often with
                    poetic imagery
                  </p>
                </div>

                <div className="rounded-lg bg-flowing-water/10 p-3">
                  <h5 className="text-sm font-medium text-mountain-stone">
                    Judgment
                  </h5>
                  <p className="text-xs text-soft-gray">
                    Overall guidance and general meaning of the hexagram
                  </p>
                </div>

                <div className="rounded-lg bg-flowing-water/10 p-3">
                  <h5 className="text-sm font-medium text-mountain-stone">
                    Image
                  </h5>
                  <p className="text-xs text-soft-gray">
                    Symbolic representation and deeper wisdom for contemplation
                  </p>
                </div>

                <div className="rounded-lg bg-flowing-water/10 p-3">
                  <h5 className="text-sm font-medium text-mountain-stone">
                    Line Texts
                  </h5>
                  <p className="text-xs text-soft-gray">
                    Specific guidance for each of the six lines
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-lg bg-flowing-water/10 p-4">
            <h4 className="mb-2 font-medium text-mountain-stone">
              🔄 Changing Lines
            </h4>
            <p className="mb-2 text-sm text-soft-gray">
              Some lines may be &quot;changing&quot; (Old Yin or Old Yang),
              indicating transformation. When changing lines are present, they
              create a second hexagram showing the direction of development.
            </p>
            <div className="text-sm text-soft-gray">
              <strong>Interpretation Approach:</strong>
              <ul className="ml-4 mt-1">
                <li>• First hexagram: Current situation</li>
                <li>• Changing lines: Areas of transformation</li>
                <li>• Second hexagram: Potential outcome or direction</li>
              </ul>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'terminology',
      title: 'Key Terminology',
      concept: null,
      content: (
        <div className="space-y-4">
          <p className="leading-relaxed text-soft-gray">
            Understanding key terms will enhance your I Ching practice and help
            you navigate traditional texts and interpretations more effectively.
          </p>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-3">
              <h4 className="font-medium text-mountain-stone">Core Concepts</h4>

              <div className="space-y-2">
                {[
                  {
                    term: 'Dao 道',
                    meaning:
                      'The Way; the underlying principle of the universe',
                  },
                  {
                    term: 'Wu Wei 無為',
                    meaning:
                      'Non-action; effortless action in harmony with natural flow',
                  },
                  {
                    term: 'Qi 氣',
                    meaning:
                      'Life energy; the vital force that flows through all things',
                  },
                  {
                    term: 'Ziran 自然',
                    meaning:
                      'Spontaneity; naturalness without artificial interference',
                  },
                ].map(({ term, meaning }) => (
                  <div
                    key={term}
                    className="rounded-lg bg-gentle-silver/10 p-3"
                  >
                    <div className="text-sm font-medium text-mountain-stone">
                      {term}
                    </div>
                    <div className="text-xs text-soft-gray">{meaning}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium text-mountain-stone">
                Practical Terms
              </h4>

              <div className="space-y-2">
                {[
                  {
                    term: 'Trigram 三爻',
                    meaning: 'Three-line symbol; building block of hexagrams',
                  },
                  {
                    term: 'Oracle 卜',
                    meaning:
                      'Divination practice; seeking guidance from the I Ching',
                  },
                  {
                    term: 'Changing Line',
                    meaning: 'Line that transforms, indicating areas of change',
                  },
                  {
                    term: 'Judgment',
                    meaning:
                      'Overall interpretation and guidance of a hexagram',
                  },
                ].map(({ term, meaning }) => (
                  <div
                    key={term}
                    className="rounded-lg bg-gentle-silver/10 p-3"
                  >
                    <div className="text-sm font-medium text-mountain-stone">
                      {term}
                    </div>
                    <div className="text-xs text-soft-gray">{meaning}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
            <h4 className="mb-2 font-medium text-amber-800">
              🎌 Pronunciation Guide
            </h4>
            <div className="grid gap-4 text-sm text-amber-700 md:grid-cols-2">
              <div>
                <strong>I Ching:</strong> &ldquo;EE-ching&rdquo; <br />
                <strong>Yin:</strong> &ldquo;yeen&rdquo; (like
                &ldquo;seen&rdquo;) <br />
                <strong>Yang:</strong> &ldquo;yahng&rdquo; (like
                &ldquo;song&rdquo;) <br />
                <strong>Dao:</strong> &ldquo;dow&rdquo; (like &ldquo;how&rdquo;)
              </div>
              <div>
                <strong>Wu Wei:</strong> &ldquo;woo-way&rdquo; <br />
                <strong>Qi:</strong> &ldquo;chee&rdquo; (like &ldquo;key&rdquo;){' '}
                <br />
                <strong>Trigram:</strong> &ldquo;TRY-gram&rdquo; <br />
                <strong>Hexagram:</strong> &ldquo;HEX-ah-gram&rdquo;
              </div>
            </div>
          </div>
        </div>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="py-12 text-center">
        <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-flowing-water"></div>
        <p className="text-soft-gray">Loading I Ching basics...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl">
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="mb-4 text-3xl font-bold text-ink-black">
          I Ching Basics
        </h1>
        <p className="mb-6 text-lg text-soft-gray">
          Master the fundamental concepts that form the foundation of I Ching
          wisdom
        </p>

        {!studySession && (
          <Button onClick={startStudySession} className="mb-6">
            Start Study Session
          </Button>
        )}

        {studySession && (
          <div className="mb-6 rounded-lg border border-blue-200 bg-blue-50 p-4">
            <div className="flex items-center justify-center gap-4 text-sm text-blue-700">
              <span>📚 Study session active</span>
              <span>•</span>
              <span>
                Started: {studySession.startTime.toLocaleTimeString()}
              </span>
              <span>•</span>
              <span>
                Sections completed: {studySession.completedSections.length}/
                {sections.length}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Study Progress */}
      {studySession && (
        <div className="mb-8">
          <div className="mb-2 flex items-center justify-between text-sm text-soft-gray">
            <span>Study Progress</span>
            <span>
              {Math.round(
                (studySession.completedSections.length / sections.length) * 100
              )}
              %
            </span>
          </div>
          <div className="h-2 rounded-full bg-gentle-silver">
            <div
              className="h-2 rounded-full bg-flowing-water transition-all duration-300"
              style={{
                width: `${
                  (studySession.completedSections.length / sections.length) *
                  100
                }%`,
              }}
            />
          </div>
        </div>
      )}

      {/* Sections */}
      <div className="space-y-8">
        {sections.map((section, index) => (
          <Card key={section.id} variant="default" className="overflow-hidden">
            <CardHeader className="bg-gentle-silver/10">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-flowing-water text-sm font-bold text-white">
                    {index + 1}
                  </span>
                  {section.title}
                </CardTitle>

                {studySession && (
                  <div className="flex items-center gap-2">
                    {studySession.completedSections.includes(section.id) && (
                      <span className="text-green-600">✓</span>
                    )}
                    {studySession.currentSection === section.id && (
                      <span className="text-blue-600">📖</span>
                    )}
                  </div>
                )}
              </div>
            </CardHeader>

            <CardContent className="pt-6">
              {section.content}

              {studySession &&
                !studySession.completedSections.includes(section.id) && (
                  <div className="mt-6 border-t border-stone-gray/20 pt-6">
                    <Button
                      variant="outline"
                      onClick={() => {
                        completeSection(section.id);
                        if (section.concept) {
                          completeStudy(section.concept);
                        }
                      }}
                    >
                      Mark as Complete
                    </Button>
                  </div>
                )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Completion */}
      {studySession &&
        studySession.completedSections.length === sections.length && (
          <Card
            variant="elevated"
            className="mt-8 border-green-200 bg-green-50"
          >
            <CardContent className="pt-6 text-center">
              <div className="mb-4 text-4xl">🎉</div>
              <h3 className="mb-2 text-xl font-bold text-green-800">
                Congratulations!
              </h3>
              <p className="mb-4 text-green-700">
                You have completed the I Ching Basics section. You&apos;ve
                mastered fundamental concepts including the principle of change
                and yin-yang.
              </p>
              <div className="flex justify-center gap-4">
                <Button
                  variant="primary"
                  onClick={() => (window.location.href = '/learn/hexagrams')}
                >
                  Continue to Hexagrams
                </Button>
                <Button
                  variant="outline"
                  onClick={() => (window.location.href = '/cultural-progress')}
                >
                  View Progress
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
    </div>
  );
}
