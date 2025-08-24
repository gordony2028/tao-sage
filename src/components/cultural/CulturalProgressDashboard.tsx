'use client';

/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import {
  calculateCulturalLevel,
  getAvailableAchievements,
  generateLearningRecommendations,
  CULTURAL_LEVELS,
  CULTURAL_CONCEPTS,
  type UserCulturalProgress,
  type CulturalAchievement,
  type CulturalLevel,
} from '@/lib/cultural/progression';

interface CulturalProgressDashboardProps {
  userId: string;
  userProgress?: UserCulturalProgress;
}

export default function CulturalProgressDashboard({
  userId,
  userProgress: initialProgress,
}: CulturalProgressDashboardProps) {
  const [userProgress, setUserProgress] = useState<UserCulturalProgress | null>(
    initialProgress || null
  );
  const [loading, setLoading] = useState(!initialProgress);
  const [activeTab, setActiveTab] = useState<
    'overview' | 'achievements' | 'concepts'
  >('overview');

  useEffect(() => {
    if (!initialProgress) {
      fetchUserProgress();
    }
  }, [userId, initialProgress]);

  const fetchUserProgress = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/cultural/progress?user_id=${userId}`);

      if (response.ok) {
        const data = await response.json();
        setUserProgress(data);
      } else {
        // Create default progress for new users
        const defaultProgress: UserCulturalProgress = {
          userId,
          currentLevel: 'Beginner',
          levelProgress: 0,
          totalPoints: 0,
          statistics: {
            consultations: 0,
            uniqueHexagrams: [],
            reflectionsCompleted: 0,
            daysActive: 0,
            longestStreak: 0,
            conceptsMastered: [],
            achievements: [],
          },
          recentActivity: {
            lastConsultation: '',
            lastReflection: '',
            lastLevelUp: null,
          },
          culturalInsights: {
            favoriteHexagrams: [],
            learningPath: [],
            recommendedTopics: [],
          },
        };
        setUserProgress(defaultProgress);
      }
    } catch (error) {
      console.error('Failed to fetch cultural progress:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card variant="default">
        <CardContent className="py-8 text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-flowing-water"></div>
          <p className="text-soft-gray">Loading cultural progress...</p>
        </CardContent>
      </Card>
    );
  }

  if (!userProgress) {
    return (
      <Card variant="default">
        <CardContent className="py-8 text-center">
          <div className="mb-4 text-4xl">📚</div>
          <h3 className="mb-2 text-lg font-medium text-mountain-stone">
            Cultural Progress Unavailable
          </h3>
          <p className="text-soft-gray">
            Unable to load your learning progress
          </p>
        </CardContent>
      </Card>
    );
  }

  const progressData = calculateCulturalLevel(userProgress.statistics);
  const currentLevelData = CULTURAL_LEVELS.find(
    l => l.level === progressData.currentLevel
  );
  const availableAchievements = getAvailableAchievements(userProgress);
  const recommendations = generateLearningRecommendations(userProgress);

  const renderOverviewTab = () => (
    <div className="space-y-6">
      {/* Current Level Display */}
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-flowing-water text-3xl font-bold text-white">
          {currentLevelData?.order || 1}
        </div>
        <h2 className="mb-2 text-2xl font-bold text-ink-black">
          {currentLevelData?.name}
        </h2>
        <p className="mb-4 text-soft-gray">{currentLevelData?.description}</p>

        {/* Progress Bar */}
        <div className="mx-auto max-w-md">
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="text-soft-gray">Progress to next level</span>
            <span className="font-medium text-flowing-water">
              {progressData.progress}%
            </span>
          </div>
          <div className="h-3 w-full rounded-full bg-gentle-silver">
            <div
              className="h-3 rounded-full bg-flowing-water transition-all duration-300"
              style={{ width: `${progressData.progress}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Statistics Grid */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <div className="rounded-lg bg-gentle-silver/10 p-3 text-center">
          <div className="text-xl font-bold text-flowing-water">
            {userProgress.statistics.consultations}
          </div>
          <div className="text-xs text-soft-gray">Consultations</div>
        </div>
        <div className="rounded-lg bg-gentle-silver/10 p-3 text-center">
          <div className="text-xl font-bold text-flowing-water">
            {userProgress.statistics.uniqueHexagrams.length}
          </div>
          <div className="text-xs text-soft-gray">Hexagrams</div>
        </div>
        <div className="rounded-lg bg-gentle-silver/10 p-3 text-center">
          <div className="text-xl font-bold text-flowing-water">
            {userProgress.statistics.longestStreak}
          </div>
          <div className="text-xs text-soft-gray">Best Streak</div>
        </div>
        <div className="rounded-lg bg-gentle-silver/10 p-3 text-center">
          <div className="text-xl font-bold text-flowing-water">
            {userProgress.totalPoints}
          </div>
          <div className="text-xs text-soft-gray">Total Points</div>
        </div>
      </div>

      {/* Learning Recommendations */}
      {recommendations.length > 0 && (
        <div>
          <h3 className="mb-3 font-medium text-mountain-stone">
            📈 Learning Recommendations
          </h3>
          <div className="space-y-2">
            {recommendations.map((recommendation, index) => (
              <div
                key={index}
                className="rounded-lg bg-flowing-water/10 p-3 text-sm text-mountain-stone"
              >
                {recommendation}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Current Level Benefits */}
      {currentLevelData?.benefits && (
        <div>
          <h3 className="mb-3 font-medium text-mountain-stone">
            ✨ Current Level Benefits
          </h3>
          <div className="space-y-1">
            {currentLevelData.benefits.map((benefit, index) => (
              <div key={index} className="flex items-start gap-2 text-sm">
                <span className="text-green-600">✓</span>
                <span className="text-soft-gray">{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderAchievementsTab = () => {
    // Get all achievements across all levels
    const allAchievements = CULTURAL_LEVELS.flatMap(
      level => level.achievements
    );
    const earnedAchievementIds = userProgress.statistics.achievements;

    // Categorize achievements
    const categorizedAchievements = allAchievements.map(achievement => {
      const isEarned = earnedAchievementIds.includes(achievement.id);
      const isAvailable = availableAchievements.some(
        a => a.id === achievement.id
      );

      return {
        ...achievement,
        status: isEarned ? 'earned' : isAvailable ? 'available' : 'locked',
      };
    });

    // Group by level for better organization
    const achievementsByLevel = CULTURAL_LEVELS.map(level => ({
      levelName: level.name,
      levelOrder: level.order,
      achievements: categorizedAchievements.filter(achievement =>
        level.achievements.some(
          levelAchievement => levelAchievement.id === achievement.id
        )
      ),
    }));

    return (
      <div className="space-y-6">
        <div>
          <h3 className="mb-4 font-medium text-mountain-stone">
            🏆 Achievement Badges ({earnedAchievementIds.length}/
            {allAchievements.length} earned)
          </h3>

          <div className="space-y-6">
            {achievementsByLevel.map(levelGroup => (
              <div key={levelGroup.levelOrder}>
                <h4 className="mb-3 flex items-center gap-2 text-sm font-medium text-soft-gray">
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-flowing-water/20 text-xs font-bold text-flowing-water">
                    {levelGroup.levelOrder}
                  </span>
                  {levelGroup.levelName}
                </h4>

                <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                  {levelGroup.achievements.map(achievement => (
                    <div
                      key={achievement.id}
                      className={`rounded-lg border p-3 transition-all duration-200 ${
                        achievement.status === 'earned'
                          ? 'border-green-200 bg-green-50 shadow-sm'
                          : achievement.status === 'available'
                            ? 'border-blue-200 bg-blue-50'
                            : 'border-stone-gray/20 bg-stone-gray/5'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <span
                            className={`text-xl ${
                              achievement.status === 'earned'
                                ? ''
                                : achievement.status === 'available'
                                  ? 'opacity-75'
                                  : 'opacity-30'
                            }`}
                          >
                            {achievement.icon}
                          </span>
                          {achievement.status === 'earned' && (
                            <div className="absolute -right-1 -top-1 flex h-3 w-3 items-center justify-center rounded-full bg-green-500">
                              <span className="text-xs text-white">✓</span>
                            </div>
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div
                            className={`text-sm font-medium ${
                              achievement.status === 'earned'
                                ? 'text-green-800'
                                : achievement.status === 'available'
                                  ? 'text-blue-800'
                                  : 'text-stone-gray'
                            }`}
                          >
                            {achievement.name}
                          </div>
                          <div
                            className={`text-xs ${
                              achievement.status === 'earned'
                                ? 'text-green-600'
                                : achievement.status === 'available'
                                  ? 'text-blue-600'
                                  : 'text-stone-gray'
                            }`}
                          >
                            {achievement.description}
                          </div>
                          <div
                            className={`text-xs font-medium ${
                              achievement.status === 'earned'
                                ? 'text-green-500'
                                : achievement.status === 'available'
                                  ? 'text-blue-500'
                                  : 'text-stone-gray'
                            }`}
                          >
                            +{achievement.points} points
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="mt-6 rounded-lg bg-gentle-silver/10 p-4">
            <h4 className="mb-2 text-sm font-medium text-mountain-stone">
              Legend:
            </h4>
            <div className="flex flex-wrap gap-4 text-xs">
              <div className="flex items-center gap-1">
                <div className="h-3 w-3 rounded border border-green-200 bg-green-50"></div>
                <span className="text-green-700">Earned</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="h-3 w-3 rounded border border-blue-200 bg-blue-50"></div>
                <span className="text-blue-700">Available</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="h-3 w-3 rounded border border-stone-gray/20 bg-stone-gray/5"></div>
                <span className="text-stone-gray">Locked</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderConceptsTab = () => {
    const masteredConcepts = userProgress.statistics.conceptsMastered;
    const allConcepts = Object.entries(CULTURAL_CONCEPTS);

    return (
      <div className="space-y-6">
        <div>
          <h3 className="mb-3 font-medium text-mountain-stone">
            📖 Cultural Concepts ({masteredConcepts.length}/{allConcepts.length}{' '}
            mastered)
          </h3>

          <div className="space-y-3">
            {allConcepts.map(([key, concept]) => {
              const isMastered = masteredConcepts.includes(key);
              const canLearn =
                concept.prerequisites.every(prereq =>
                  masteredConcepts.includes(prereq)
                ) || concept.prerequisites.length === 0;

              return (
                <div
                  key={key}
                  className={`rounded-lg border p-4 ${
                    isMastered
                      ? 'border-green-200 bg-green-50'
                      : canLearn
                        ? 'border-blue-200 bg-blue-50'
                        : 'border-stone-gray/20 bg-stone-gray/5'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4
                          className={`font-medium ${
                            isMastered
                              ? 'text-green-800'
                              : canLearn
                                ? 'text-blue-800'
                                : 'text-soft-gray'
                          }`}
                        >
                          {concept.name}
                        </h4>
                        {isMastered && (
                          <span className="text-green-600">✓</span>
                        )}
                      </div>
                      <p
                        className={`mt-1 text-sm ${
                          isMastered
                            ? 'text-green-600'
                            : canLearn
                              ? 'text-blue-600'
                              : 'text-soft-gray'
                        }`}
                      >
                        {concept.description}
                      </p>

                      {concept.prerequisites.length > 0 && (
                        <div className="mt-2">
                          <div className="text-xs text-soft-gray">
                            Prerequisites:{' '}
                            {concept.prerequisites
                              .map(
                                prereq =>
                                  CULTURAL_CONCEPTS[
                                    prereq as keyof typeof CULTURAL_CONCEPTS
                                  ]?.name || prereq
                              )
                              .join(', ')}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="ml-4">
                      <div
                        className={`rounded-full px-2 py-1 text-xs ${
                          concept.difficulty <= 2
                            ? 'bg-green-100 text-green-600'
                            : concept.difficulty <= 3
                              ? 'bg-yellow-100 text-yellow-600'
                              : 'bg-red-100 text-red-600'
                        }`}
                      >
                        Level {concept.difficulty}
                      </div>
                    </div>
                  </div>

                  {canLearn && !isMastered && (
                    <div className="mt-3">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          // TODO: Open concept learning material
                          console.log(`Learning concept: ${key}`);
                        }}
                      >
                        📚 Study This Concept
                      </Button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card variant="elevated">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="text-2xl">🏛️</span>
            Cultural Progression
          </CardTitle>
        </CardHeader>
      </Card>

      {/* Navigation Tabs */}
      <div className="flex space-x-1 rounded-lg bg-gentle-silver/20 p-1">
        {[
          { id: 'overview', name: 'Overview', icon: '📊' },
          { id: 'achievements', name: 'Achievements', icon: '🏆' },
          { id: 'concepts', name: 'Concepts', icon: '📖' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? 'bg-white text-flowing-water shadow-sm'
                : 'text-soft-gray hover:text-mountain-stone'
            }`}
          >
            <span className="mr-1">{tab.icon}</span>
            {tab.name}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <Card variant="default">
        <CardContent className="pt-6">
          {activeTab === 'overview' && renderOverviewTab()}
          {activeTab === 'achievements' && renderAchievementsTab()}
          {activeTab === 'concepts' && renderConceptsTab()}
        </CardContent>
      </Card>
    </div>
  );
}
