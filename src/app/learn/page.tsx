'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Button from '@/components/ui/Button';

interface UserProgress {
  currentLevel: string;
  conceptsMastered: string[];
  totalConsultations: number;
  recommendations: string[];
}

export default function LearnOverviewPage() {
  const [userProgress, setUserProgress] = useState<UserProgress | null>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      
      if (user) {
        // Fetch user progress
        try {
          const response = await fetch(`/api/cultural/progress?user_id=${user.id}`);
          if (response.ok) {
            const progressData = await response.json();
            setUserProgress({
              currentLevel: progressData.currentLevel,
              conceptsMastered: progressData.statistics.conceptsMastered,
              totalConsultations: progressData.statistics.consultations,
              recommendations: progressData.recommendations,
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

  const learningPaths = [
    {
      id: 'basics',
      title: 'I Ching Basics',
      description: 'Start your journey with fundamental concepts',
      icon: '☯️',
      href: '/learn/basics',
      difficulty: 'Beginner',
      concepts: ['yin-yang', 'change'],
      estimatedTime: '30-45 minutes',
    },
    {
      id: 'hexagrams',
      title: '64 Hexagrams',
      description: 'Explore all traditional hexagrams and their meanings',
      icon: '⚏',
      href: '/learn/hexagrams',
      difficulty: 'Intermediate',
      concepts: ['trigrams'],
      estimatedTime: '2-3 hours',
    },
    {
      id: 'philosophy',
      title: 'Taoist Philosophy',
      description: 'Deepen understanding with philosophical principles',
      icon: '🏮',
      href: '/learn/philosophy',
      difficulty: 'Advanced',
      concepts: ['wu-wei', 'timing', 'five-elements', 'dao'],
      estimatedTime: '1-2 hours',
    },
    {
      id: 'faq',
      title: 'Frequently Asked Questions',
      description: 'Common questions about I Ching and cultural practice',
      icon: '❓',
      href: '/learn/faq',
      difficulty: 'All Levels',
      concepts: [],
      estimatedTime: '15-20 minutes',
    },
  ];

  const getProgressStatus = (pathConcepts: string[]) => {
    if (!userProgress) return 'not-started';
    
    if (pathConcepts.length === 0) return 'available';
    
    const masteredCount = pathConcepts.filter(concept => 
      userProgress.conceptsMastered.includes(concept)
    ).length;
    
    if (masteredCount === pathConcepts.length) return 'completed';
    if (masteredCount > 0) return 'in-progress';
    return 'available';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-50 border-green-200';
      case 'in-progress': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'available': return 'text-flowing-water bg-flowing-water/10 border-flowing-water/20';
      default: return 'text-soft-gray bg-gentle-silver/10 border-stone-gray/20';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return '✓ Completed';
      case 'in-progress': return '🔄 In Progress';
      case 'available': return '📖 Available';
      default: return '🔒 Locked';
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-flowing-water"></div>
        <p className="text-soft-gray">Loading your learning journey...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="text-center">
        <h1 className="mb-4 text-3xl font-bold text-ink-black">
          Welcome to I Ching Learning
        </h1>
        <p className="text-lg text-soft-gray mb-6">
          Discover the ancient wisdom of the I Ching through structured learning paths
          designed to deepen your understanding and spiritual practice.
        </p>
        
        {user && userProgress && (
          <Card variant="elevated" className="max-w-2xl mx-auto">
            <CardContent className="pt-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-flowing-water">
                    {userProgress.currentLevel}
                  </div>
                  <div className="text-sm text-soft-gray">Current Level</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-flowing-water">
                    {userProgress.conceptsMastered.length}
                  </div>
                  <div className="text-sm text-soft-gray">Concepts Mastered</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-flowing-water">
                    {userProgress.totalConsultations}
                  </div>
                  <div className="text-sm text-soft-gray">Consultations</div>
                </div>
                <div>
                  <Link href="/cultural-progress">
                    <Button variant="outline" size="sm">
                      View Progress
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Learning Paths */}
      <div>
        <h2 className="mb-6 text-2xl font-bold text-ink-black">
          Choose Your Learning Path
        </h2>
        
        <div className="grid gap-6 md:grid-cols-2">
          {learningPaths.map((path) => {
            const status = getProgressStatus(path.concepts);
            const statusColor = getStatusColor(status);
            
            return (
              <Card key={path.id} variant="default" className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{path.icon}</span>
                      <div>
                        <CardTitle className="text-lg">{path.title}</CardTitle>
                        <p className="text-sm text-soft-gray">{path.description}</p>
                      </div>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full border ${statusColor}`}>
                      {getStatusText(status)}
                    </span>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-soft-gray">Difficulty:</span>
                      <span className="font-medium">{path.difficulty}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-soft-gray">Est. Time:</span>
                      <span className="font-medium">{path.estimatedTime}</span>
                    </div>
                    
                    {path.concepts.length > 0 && (
                      <div className="text-sm">
                        <span className="text-soft-gray">Concepts: </span>
                        <div className="mt-1 flex flex-wrap gap-1">
                          {path.concepts.map((concept) => (
                            <span
                              key={concept}
                              className={`text-xs px-2 py-1 rounded-full ${
                                userProgress?.conceptsMastered.includes(concept)
                                  ? 'bg-green-100 text-green-700'
                                  : 'bg-gentle-silver/20 text-soft-gray'
                              }`}
                            >
                              {concept}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <div className="pt-2">
                      <Link href={path.href}>
                        <Button 
                          variant={status === 'completed' ? 'outline' : 'primary'}
                          className="w-full"
                        >
                          {status === 'completed' ? 'Review' : 'Start Learning'}
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Recommendations Section */}
      {user && userProgress && userProgress.recommendations.length > 0 && (
        <Card variant="elevated">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-xl">💡</span>
              Personalized Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {userProgress.recommendations.map((recommendation, index) => (
                <div
                  key={index}
                  className="rounded-lg bg-flowing-water/10 p-3 text-sm text-mountain-stone"
                >
                  {recommendation}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Cultural Note */}
      <Card variant="default" className="border-amber-200 bg-amber-50">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <span className="text-xl">🙏</span>
            <div>
              <h3 className="font-medium text-amber-800 mb-2">
                Cultural Respect & Authenticity
              </h3>
              <p className="text-sm text-amber-700">
                The I Ching represents thousands of years of Chinese wisdom and cultural heritage.
                Our educational content strives to honor this tradition with respect, accuracy,
                and cultural sensitivity. We encourage approaching this ancient wisdom with 
                reverence and an open heart.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}