'use client';

export interface MindfulNotification {
  id: string;
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  timestamp: string;
  category:
    | 'daily_guidance'
    | 'reflection_prompt'
    | 'mindful_moment'
    | 'cultural_insight';
  priority: 'low' | 'normal' | 'high';
  hexagram?: {
    number: number;
    name: string;
    lines: number[];
  };
  mindfulnessLevel: 'gentle' | 'moderate' | 'deep';
  scheduledFor?: string;
  isRead: boolean;
}

export interface NotificationPreferences {
  enabled: boolean;
  dailyGuidance: {
    enabled: boolean;
    time: string; // Format: "HH:MM"
    timezone: string;
  };
  reflectionPrompts: {
    enabled: boolean;
    frequency: 'daily' | 'weekly' | 'custom';
    times: string[];
  };
  mindfulMoments: {
    enabled: boolean;
    frequency: number; // Hours between notifications
    quiet_hours: {
      start: string;
      end: string;
    };
  };
  culturalInsights: {
    enabled: boolean;
    frequency: 'weekly' | 'biweekly' | 'monthly';
  };
}

export class MindfulNotificationManager {
  private static instance: MindfulNotificationManager;
  private preferences: NotificationPreferences;
  private isSupported: boolean;
  private permission: NotificationPermission;

  private constructor() {
    this.isSupported = this.checkSupport();
    this.permission = this.isSupported ? Notification.permission : 'denied';

    // Default preferences
    this.preferences = {
      enabled: false,
      dailyGuidance: {
        enabled: true,
        time: '08:00',
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      },
      reflectionPrompts: {
        enabled: true,
        frequency: 'daily',
        times: ['18:00'],
      },
      mindfulMoments: {
        enabled: true,
        frequency: 4, // Every 4 hours
        quiet_hours: {
          start: '22:00',
          end: '06:00',
        },
      },
      culturalInsights: {
        enabled: true,
        frequency: 'weekly',
      },
    };

    this.loadPreferences();
  }

  public static getInstance(): MindfulNotificationManager {
    if (!MindfulNotificationManager.instance) {
      MindfulNotificationManager.instance = new MindfulNotificationManager();
    }
    return MindfulNotificationManager.instance;
  }

  private checkSupport(): boolean {
    if (typeof window === 'undefined') return false;
    return 'Notification' in window && 'serviceWorker' in navigator;
  }

  public async requestPermission(): Promise<NotificationPermission> {
    if (!this.isSupported) {
      return 'denied';
    }

    if (this.permission === 'default') {
      this.permission = await Notification.requestPermission();
    }

    return this.permission;
  }

  public async enableNotifications(): Promise<boolean> {
    const permission = await this.requestPermission();

    if (permission === 'granted') {
      this.preferences.enabled = true;
      await this.savePreferences();
      await this.scheduleNotifications();
      return true;
    }

    return false;
  }

  public async disableNotifications(): Promise<void> {
    this.preferences.enabled = false;
    await this.savePreferences();
    await this.clearScheduledNotifications();
  }

  public getPreferences(): NotificationPreferences {
    return { ...this.preferences };
  }

  public async updatePreferences(
    newPreferences: Partial<NotificationPreferences>
  ): Promise<void> {
    this.preferences = { ...this.preferences, ...newPreferences };
    await this.savePreferences();

    if (this.preferences.enabled) {
      await this.scheduleNotifications();
    }
  }

  private async loadPreferences(): Promise<void> {
    try {
      // Only access localStorage in browser environment
      if (typeof window !== 'undefined' && window.localStorage) {
        const stored = localStorage.getItem('mindful_notification_preferences');
        if (stored) {
          const parsed = JSON.parse(stored);
          this.preferences = { ...this.preferences, ...parsed };
        }
      }
    } catch (error) {
      console.warn('Failed to load notification preferences:', error);
    }
  }

  private async savePreferences(): Promise<void> {
    try {
      // Only access localStorage in browser environment
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem(
          'mindful_notification_preferences',
          JSON.stringify(this.preferences)
        );
      }
    } catch (error) {
      console.warn('Failed to save notification preferences:', error);
    }
  }

  public async showNotification(
    notification: Omit<MindfulNotification, 'id' | 'timestamp' | 'isRead'>
  ): Promise<void> {
    if (!this.preferences.enabled || this.permission !== 'granted') {
      return;
    }

    // Check quiet hours for mindful moments
    if (notification.category === 'mindful_moment' && this.isQuietTime()) {
      return;
    }

    const mindfulNotification: MindfulNotification = {
      ...notification,
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      isRead: false,
    };

    // Create browser notification
    const browserNotification = new Notification(notification.title, {
      body: notification.body,
      icon: notification.icon || '/icons/sage-icon.svg',
      badge: notification.badge || '/icons/sage-icon.svg',
      tag: notification.category,
      requireInteraction: notification.priority === 'high',
      silent: notification.mindfulnessLevel === 'gentle',
    });

    // Store notification for history
    await this.storeNotification(mindfulNotification);

    // Handle notification click
    browserNotification.onclick = () => {
      window.focus();
      this.markAsRead(mindfulNotification.id);
      browserNotification.close();

      // Navigate to appropriate page based on category
      switch (notification.category) {
        case 'daily_guidance':
          window.location.href = '/guidance';
          break;
        case 'reflection_prompt':
          window.location.href = '/reflection';
          break;
        case 'cultural_insight':
          window.location.href = '/cultural-progress';
          break;
        default:
          window.location.href = '/';
      }
    };
  }

  private isQuietTime(): boolean {
    const now = new Date();
    const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now
      .getMinutes()
      .toString()
      .padStart(2, '0')}`;

    const { start, end } = this.preferences.mindfulMoments.quiet_hours;

    // Handle quiet hours that span midnight
    if (start > end) {
      return currentTime >= start || currentTime <= end;
    }

    return currentTime >= start && currentTime <= end;
  }

  private async storeNotification(
    notification: MindfulNotification
  ): Promise<void> {
    try {
      // Only access localStorage in browser environment
      if (typeof window !== 'undefined' && window.localStorage) {
        const stored = localStorage.getItem('mindful_notifications');
        const notifications: MindfulNotification[] = stored
          ? JSON.parse(stored)
          : [];

        notifications.unshift(notification);

        // Keep only last 50 notifications
        if (notifications.length > 50) {
          notifications.splice(50);
        }

        localStorage.setItem(
          'mindful_notifications',
          JSON.stringify(notifications)
        );
      }
    } catch (error) {
      console.warn('Failed to store notification:', error);
    }
  }

  public async getNotificationHistory(): Promise<MindfulNotification[]> {
    try {
      // Only access localStorage in browser environment
      if (typeof window !== 'undefined' && window.localStorage) {
        const stored = localStorage.getItem('mindful_notifications');
        return stored ? JSON.parse(stored) : [];
      }
      return [];
    } catch (error) {
      console.warn('Failed to get notification history:', error);
      return [];
    }
  }

  public async markAsRead(notificationId: string): Promise<void> {
    try {
      // Only access localStorage in browser environment
      if (typeof window !== 'undefined' && window.localStorage) {
        const stored = localStorage.getItem('mindful_notifications');
        if (stored) {
          const notifications: MindfulNotification[] = JSON.parse(stored);
          const notification = notifications.find(n => n.id === notificationId);
          if (notification) {
            notification.isRead = true;
            localStorage.setItem(
              'mindful_notifications',
              JSON.stringify(notifications)
            );
          }
        }
      }
    } catch (error) {
      console.warn('Failed to mark notification as read:', error);
    }
  }

  private async scheduleNotifications(): Promise<void> {
    if (!this.preferences.enabled) return;

    // Clear existing scheduled notifications
    await this.clearScheduledNotifications();

    // Schedule daily guidance
    if (this.preferences.dailyGuidance.enabled) {
      this.scheduleDailyGuidance();
    }

    // Schedule reflection prompts
    if (this.preferences.reflectionPrompts.enabled) {
      this.scheduleReflectionPrompts();
    }

    // Schedule mindful moments
    if (this.preferences.mindfulMoments.enabled) {
      this.scheduleMindfulMoments();
    }

    // Schedule cultural insights
    if (this.preferences.culturalInsights.enabled) {
      this.scheduleCulturalInsights();
    }
  }

  private scheduleDailyGuidance(): void {
    const { time, timezone } = this.preferences.dailyGuidance;
    const [hours, minutes] = time.split(':').map(Number);

    const scheduleDaily = () => {
      const now = new Date();
      const scheduledTime = new Date();
      scheduledTime.setHours(hours, minutes, 0, 0);

      // If time has passed today, schedule for tomorrow
      if (scheduledTime <= now) {
        scheduledTime.setDate(scheduledTime.getDate() + 1);
      }

      const delay = scheduledTime.getTime() - now.getTime();

      setTimeout(() => {
        this.showNotification({
          title: '🌅 Daily Guidance Awaits',
          body: 'Your personalized I Ching wisdom is ready. Take a moment to reflect.',
          category: 'daily_guidance',
          priority: 'normal',
          mindfulnessLevel: 'gentle',
        });

        // Schedule next day
        scheduleDaily();
      }, delay);
    };

    scheduleDaily();
  }

  private scheduleReflectionPrompts(): void {
    const { frequency, times } = this.preferences.reflectionPrompts;

    const schedulePrompts = () => {
      times.forEach(time => {
        const [hours, minutes] = time.split(':').map(Number);
        const scheduledTime = new Date();
        scheduledTime.setHours(hours, minutes, 0, 0);

        const now = new Date();
        if (scheduledTime <= now) {
          scheduledTime.setDate(scheduledTime.getDate() + 1);
        }

        const delay = scheduledTime.getTime() - now.getTime();

        setTimeout(() => {
          this.showNotification({
            title: '🤔 Time for Reflection',
            body: 'How has your day unfolded? Consider the wisdom from your morning guidance.',
            category: 'reflection_prompt',
            priority: 'low',
            mindfulnessLevel: 'moderate',
          });
        }, delay);
      });
    };

    schedulePrompts();
  }

  private scheduleMindfulMoments(): void {
    const { frequency } = this.preferences.mindfulMoments;
    const intervalMs = frequency * 60 * 60 * 1000; // Convert hours to milliseconds

    const scheduleMoment = () => {
      setTimeout(() => {
        if (!this.isQuietTime()) {
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

          this.showNotification({
            ...moment,
            category: 'mindful_moment',
            priority: 'low',
            mindfulnessLevel: 'gentle',
          });
        }

        // Schedule next moment
        scheduleMoment();
      }, intervalMs);
    };

    scheduleMoment();
  }

  private scheduleCulturalInsights(): void {
    const { frequency } = this.preferences.culturalInsights;

    let intervalMs: number;
    switch (frequency) {
      case 'weekly':
        intervalMs = 7 * 24 * 60 * 60 * 1000;
        break;
      case 'biweekly':
        intervalMs = 14 * 24 * 60 * 60 * 1000;
        break;
      case 'monthly':
        intervalMs = 30 * 24 * 60 * 60 * 1000;
        break;
      default:
        intervalMs = 7 * 24 * 60 * 60 * 1000;
    }

    const scheduleInsight = () => {
      setTimeout(() => {
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

        const insight = insights[Math.floor(Math.random() * insights.length)];

        this.showNotification({
          ...insight,
          category: 'cultural_insight',
          priority: 'normal',
          mindfulnessLevel: 'deep',
        });

        // Schedule next insight
        scheduleInsight();
      }, intervalMs);
    };

    scheduleInsight();
  }

  private async clearScheduledNotifications(): Promise<void> {
    // Clear any existing timeouts (this is a simplified approach)
    // In a production app, you'd want to track timeout IDs
    // and clear them individually
  }

  public getPermissionStatus(): NotificationPermission {
    return this.permission;
  }

  public isNotificationSupported(): boolean {
    return this.isSupported;
  }
}

// Export singleton instance
export const mindfulNotifications = MindfulNotificationManager.getInstance();
