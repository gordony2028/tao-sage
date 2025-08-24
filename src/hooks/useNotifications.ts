'use client';

import { useEffect, useState, useCallback } from 'react';
import { mindfulNotifications } from '@/lib/notifications/mindful-notifications';

export function useNotifications() {
  const [permission, setPermission] =
    useState<NotificationPermission>('default');
  const [isSupported, setIsSupported] = useState(false);
  const [isEnabled, setIsEnabled] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initNotifications = async () => {
      setIsSupported(mindfulNotifications.isNotificationSupported());
      setPermission(mindfulNotifications.getPermissionStatus());

      const preferences = mindfulNotifications.getPreferences();
      setIsEnabled(preferences.enabled);
      setLoading(false);
    };

    initNotifications();
  }, []);

  const enableNotifications = useCallback(async (): Promise<boolean> => {
    try {
      const success = await mindfulNotifications.enableNotifications();
      if (success) {
        setPermission('granted');
        setIsEnabled(true);
      }
      return success;
    } catch (error) {
      console.error('Failed to enable notifications:', error);
      return false;
    }
  }, []);

  const disableNotifications = useCallback(async (): Promise<void> => {
    try {
      await mindfulNotifications.disableNotifications();
      setIsEnabled(false);
    } catch (error) {
      console.error('Failed to disable notifications:', error);
    }
  }, []);

  const showDailyGuidanceNotification = useCallback(
    async (hexagram: { number: number; name: string }) => {
      if (!isEnabled) return;

      await mindfulNotifications.showNotification({
        title: '🌅 Your Daily Guidance Awaits',
        body: `Today&apos;s wisdom: Hexagram ${hexagram.number} - ${hexagram.name}. Tap to explore.`,
        category: 'daily_guidance',
        priority: 'normal',
        mindfulnessLevel: 'gentle',
        hexagram: {
          number: hexagram.number,
          name: hexagram.name,
          lines: [], // Could be filled from actual hexagram data
        },
      });
    },
    [isEnabled]
  );

  const showReflectionPrompt = useCallback(
    async (message?: string) => {
      if (!isEnabled) return;

      await mindfulNotifications.showNotification({
        title: '🤔 Time for Reflection',
        body:
          message ||
          'How has your day unfolded? Consider the wisdom from your morning guidance.',
        category: 'reflection_prompt',
        priority: 'low',
        mindfulnessLevel: 'moderate',
      });
    },
    [isEnabled]
  );

  const showMindfulMoment = useCallback(async () => {
    if (!isEnabled) return;

    const moments = [
      {
        title: '🍃 Mindful Moment',
        body: 'Take three deep breaths. Notice what flows around you like water.',
      },
      {
        title: '⚖️ Balance Check',
        body: 'Pause and feel your center. Are you in harmony with the present moment?',
      },
      {
        title: '🌸 Gentle Reminder',
        body: 'Like bamboo, bend without breaking. How can you be more flexible today?',
      },
      {
        title: '🎋 Wu Wei Moment',
        body: 'Practice effortless action. What can you release control of right now?',
      },
    ];

    const moment = moments[Math.floor(Math.random() * moments.length)];

    await mindfulNotifications.showNotification({
      ...moment,
      category: 'mindful_moment',
      priority: 'low',
      mindfulnessLevel: 'gentle',
    });
  }, [isEnabled]);

  const showCulturalInsight = useCallback(
    async (insight?: string) => {
      if (!isEnabled) return;

      const insights = [
        {
          title: '📚 Cultural Wisdom',
          body: 'The I Ching teaches us that change is the only constant. Embrace transformation.',
        },
        {
          title: '🏛️ Ancient Knowledge',
          body: 'In traditional Chinese philosophy, balance creates harmony. How can you balance your energies?',
        },
        {
          title: '🌟 Deeper Understanding',
          body: 'Your consultation history shows patterns. Visit your Progress page to explore them.',
        },
      ];

      const defaultInsight =
        insights[Math.floor(Math.random() * insights.length)];
      const selectedInsight = insight
        ? { title: '🏛️ Cultural Insight', body: insight }
        : defaultInsight;

      await mindfulNotifications.showNotification({
        ...selectedInsight,
        category: 'cultural_insight',
        priority: 'normal',
        mindfulnessLevel: 'deep',
      });
    },
    [isEnabled]
  );

  return {
    permission,
    isSupported,
    isEnabled,
    loading,
    enableNotifications,
    disableNotifications,
    showDailyGuidanceNotification,
    showReflectionPrompt,
    showMindfulMoment,
    showCulturalInsight,
  };
}

// Helper hook for testing notifications
export function useNotificationTester() {
  const {
    showDailyGuidanceNotification,
    showReflectionPrompt,
    showMindfulMoment,
    showCulturalInsight,
  } = useNotifications();

  const testDailyGuidance = useCallback(() => {
    showDailyGuidanceNotification({
      number: 1,
      name: 'The Creative',
    });
  }, [showDailyGuidanceNotification]);

  const testReflectionPrompt = useCallback(() => {
    showReflectionPrompt(
      'This is a test reflection prompt. How are you feeling?'
    );
  }, [showReflectionPrompt]);

  const testMindfulMoment = useCallback(() => {
    showMindfulMoment();
  }, [showMindfulMoment]);

  const testCulturalInsight = useCallback(() => {
    showCulturalInsight(
      'This is a test cultural insight about the wisdom of change.'
    );
  }, [showCulturalInsight]);

  return {
    testDailyGuidance,
    testReflectionPrompt,
    testMindfulMoment,
    testCulturalInsight,
  };
}
