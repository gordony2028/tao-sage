import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/client';
import {
  calculateCulturalLevel,
  getAvailableAchievements,
  generateLearningRecommendations,
  type UserCulturalProgress,
  type CulturalLevel,
} from '@/lib/cultural/progression';

export const runtime = 'nodejs';

/**
 * Cultural Progress API
 * Manages user cultural progression, achievements, and learning recommendations
 */

export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get('user_id');

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }

    // Get user's consultation history and activities
    const { data: consultationData, error: consultationError } =
      await supabaseAdmin
        .from('user_events')
        .select('*')
        .eq('user_id', userId)
        .in('event_type', [
          'daily_guidance_accessed',
          'consultation_completed',
          'daily_reflection_completed',
        ])
        .order('created_at', { ascending: true });

    if (consultationError) {
      console.error('Error fetching consultation data:', consultationError);
      return NextResponse.json(
        { error: 'Failed to fetch user progress' },
        { status: 500 }
      );
    }

    // Calculate statistics from user events
    const consultations = consultationData.filter(
      event =>
        event.event_type === 'consultation_completed' ||
        event.event_type === 'daily_guidance_accessed'
    );

    const reflections = consultationData.filter(
      event => event.event_type === 'daily_reflection_completed'
    );

    // Extract unique hexagrams encountered
    const uniqueHexagrams = new Set<number>();
    consultationData.forEach(event => {
      if (event.event_data?.hexagram_number) {
        uniqueHexagrams.add(event.event_data.hexagram_number);
      }
    });

    // Calculate active days and streak
    const activeDays = new Set(
      consultationData.map(event => new Date(event.created_at).toDateString())
    ).size;

    // Calculate longest streak
    const dailyActivities = consultationData.reduce(
      (acc, event) => {
        const date = new Date(event.created_at).toDateString();
        if (!acc[date]) acc[date] = [];
        acc[date].push(event);
        return acc;
      },
      {} as Record<string, any[]>
    );

    const sortedDates = Object.keys(dailyActivities).sort(
      (a, b) => new Date(a).getTime() - new Date(b).getTime()
    );

    let longestStreak = 0;
    let currentStreak = 0;
    let previousDate: Date | null = null;

    for (const dateStr of sortedDates) {
      const currentDate = new Date(dateStr);

      if (previousDate) {
        const dayDiff = Math.floor(
          (currentDate.getTime() - previousDate.getTime()) /
            (1000 * 60 * 60 * 24)
        );

        if (dayDiff === 1) {
          currentStreak++;
        } else {
          longestStreak = Math.max(longestStreak, currentStreak);
          currentStreak = 1;
        }
      } else {
        currentStreak = 1;
      }

      previousDate = currentDate;
    }
    longestStreak = Math.max(longestStreak, currentStreak);

    // Determine mastered concepts based on user level and activities
    const conceptsMastered: string[] = [];

    // Basic concepts for all users who have done consultations
    if (consultations.length > 0) {
      conceptsMastered.push('yin-yang', 'change');
    }

    // Intermediate concepts
    if (uniqueHexagrams.size >= 8) {
      conceptsMastered.push('trigrams');
    }

    if (consultations.length >= 10) {
      conceptsMastered.push('wu-wei');
    }

    if (consultations.length >= 15) {
      conceptsMastered.push('timing');
    }

    // Advanced concepts
    if (consultations.length >= 30 && uniqueHexagrams.size >= 25) {
      conceptsMastered.push('five-elements');
    }

    if (consultations.length >= 50 && activeDays >= 90) {
      conceptsMastered.push('seasonal-wisdom');
    }

    // Master concepts
    if (consultations.length >= 75 && activeDays >= 150) {
      conceptsMastered.push('emptiness');
    }

    if (consultations.length >= 100 && activeDays >= 180) {
      conceptsMastered.push('dao');
    }

    // Create user progress object
    const userProgress: UserCulturalProgress = {
      userId,
      currentLevel: 'Beginner', // Will be calculated
      levelProgress: 0,
      totalPoints: 0,
      statistics: {
        consultations: consultations.length,
        uniqueHexagrams: Array.from(uniqueHexagrams),
        reflectionsCompleted: reflections.length,
        daysActive: activeDays,
        longestStreak,
        conceptsMastered,
        achievements: [], // TODO: Implement achievement tracking
      },
      recentActivity: {
        lastConsultation:
          consultations[consultations.length - 1]?.created_at || '',
        lastReflection: reflections[reflections.length - 1]?.created_at || '',
        lastLevelUp: null, // TODO: Implement level up tracking
      },
      culturalInsights: {
        favoriteHexagrams: [], // TODO: Calculate from frequency
        learningPath: [],
        recommendedTopics: [],
      },
    };

    // Calculate current level and progress
    const levelData = calculateCulturalLevel(userProgress.statistics);
    userProgress.currentLevel = levelData.currentLevel;
    userProgress.levelProgress = levelData.progress;

    // Calculate total points (simple implementation)
    userProgress.totalPoints =
      consultations.length * 5 +
      reflections.length * 10 +
      uniqueHexagrams.size * 3 +
      longestStreak * 2 +
      conceptsMastered.length * 15;

    // Get available achievements and recommendations
    const availableAchievements = getAvailableAchievements(userProgress);
    const recommendations = generateLearningRecommendations(userProgress);

    return NextResponse.json({
      ...userProgress,
      availableAchievements,
      recommendations,
      nextLevel: levelData.nextLevel,
      requirementsForNext: levelData.requirementsForNext,
    });
  } catch (error) {
    console.error('Cultural progress error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch cultural progress' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { user_id, action, data } = body;

    if (!user_id) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }

    switch (action) {
      case 'unlock_achievement':
        // TODO: Implement achievement unlocking
        await supabaseAdmin.from('user_events').insert({
          user_id,
          event_type: 'achievement_unlocked',
          event_data: {
            achievement_id: data?.achievement_id,
            points_earned: data?.points,
            unlocked_at: new Date().toISOString(),
          },
        });
        break;

      case 'complete_concept_study':
        // TODO: Track concept study completion
        await supabaseAdmin.from('user_events').insert({
          user_id,
          event_type: 'concept_studied',
          event_data: {
            concept_id: data?.concept_id,
            study_duration: data?.duration,
            completed_at: new Date().toISOString(),
          },
        });
        break;

      case 'level_up':
        // TODO: Track level progression
        await supabaseAdmin.from('user_events').insert({
          user_id,
          event_type: 'level_up',
          event_data: {
            old_level: data?.old_level,
            new_level: data?.new_level,
            points_earned: data?.points,
            leveled_up_at: new Date().toISOString(),
          },
        });
        break;

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Cultural progress action error:', error);
    return NextResponse.json(
      { error: 'Failed to process action' },
      { status: 500 }
    );
  }
}
