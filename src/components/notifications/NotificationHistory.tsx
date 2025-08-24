'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import {
  mindfulNotifications,
  type MindfulNotification,
} from '@/lib/notifications/mindful-notifications';

export default function NotificationHistory() {
  const [notifications, setNotifications] = useState<MindfulNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const history = await mindfulNotifications.getNotificationHistory();
        setNotifications(history);
      } catch (error) {
        console.error('Failed to load notification history:', error);
      } finally {
        setLoading(false);
      }
    };

    loadHistory();
  }, []);

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await mindfulNotifications.markAsRead(notificationId);
      setNotifications(prev =>
        prev.map(n => (n.id === notificationId ? { ...n, isRead: true } : n))
      );
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !notification.isRead;
    return notification.category === filter;
  });

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'daily_guidance':
        return '🌅';
      case 'reflection_prompt':
        return '🤔';
      case 'mindful_moment':
        return '🍃';
      case 'cultural_insight':
        return '🏛️';
      default:
        return '🔔';
    }
  };

  const getCategoryName = (category: string) => {
    switch (category) {
      case 'daily_guidance':
        return 'Daily Guidance';
      case 'reflection_prompt':
        return 'Reflection Prompt';
      case 'mindful_moment':
        return 'Mindful Moment';
      case 'cultural_insight':
        return 'Cultural Insight';
      default:
        return 'Notification';
    }
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return `Today at ${date.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      })}`;
    } else if (diffDays === 1) {
      return `Yesterday at ${date.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      })}`;
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'border-l-red-400';
      case 'normal':
        return 'border-l-flowing-water';
      case 'low':
        return 'border-l-bamboo-green';
      default:
        return 'border-l-gentle-silver';
    }
  };

  if (loading) {
    return (
      <Card variant="default">
        <CardContent className="py-8 text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-flowing-water"></div>
          <p className="text-soft-gray">Loading notification history...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Filters */}
      <Card variant="elevated">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <span className="text-2xl">📖</span>
              Notification History
            </CardTitle>
            <div className="text-sm text-soft-gray">
              {notifications.filter(n => !n.isRead).length} unread
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex flex-wrap gap-2 pt-4">
            {[
              { id: 'all', name: 'All', icon: '📋' },
              { id: 'unread', name: 'Unread', icon: '🔴' },
              { id: 'daily_guidance', name: 'Daily', icon: '🌅' },
              { id: 'reflection_prompt', name: 'Reflection', icon: '🤔' },
              { id: 'mindful_moment', name: 'Mindful', icon: '🍃' },
              { id: 'cultural_insight', name: 'Cultural', icon: '🏛️' },
            ].map(filterOption => (
              <button
                key={filterOption.id}
                onClick={() => setFilter(filterOption.id)}
                className={`rounded-lg px-3 py-1 text-xs font-medium transition-colors ${
                  filter === filterOption.id
                    ? 'bg-flowing-water text-white'
                    : 'bg-gentle-silver/20 text-soft-gray hover:bg-gentle-silver/30'
                }`}
              >
                <span className="mr-1">{filterOption.icon}</span>
                {filterOption.name}
              </button>
            ))}
          </div>
        </CardHeader>
      </Card>

      {/* Notification List */}
      {filteredNotifications.length === 0 ? (
        <Card variant="default">
          <CardContent className="py-8 text-center">
            <div className="mb-4 text-4xl">🕊️</div>
            <h3 className="mb-2 text-lg font-medium text-mountain-stone">
              No Notifications
            </h3>
            <p className="text-soft-gray">
              {filter === 'all'
                ? 'You haven&apos;t received any notifications yet.'
                : `No ${
                    filter === 'unread'
                      ? 'unread'
                      : getCategoryName(filter).toLowerCase()
                  } notifications found.`}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredNotifications.map(notification => (
            <Card
              key={notification.id}
              variant="default"
              className={`${getPriorityColor(
                notification.priority
              )} border-l-4 transition-all hover:shadow-md ${
                !notification.isRead ? 'bg-blue-50/30' : ''
              }`}
            >
              <CardContent className="pt-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">
                        {getCategoryIcon(notification.category)}
                      </span>
                      <h3
                        className={`font-medium ${
                          !notification.isRead
                            ? 'text-mountain-stone'
                            : 'text-soft-gray'
                        }`}
                      >
                        {notification.title}
                      </h3>
                      {!notification.isRead && (
                        <span className="h-2 w-2 rounded-full bg-flowing-water"></span>
                      )}
                    </div>

                    <p
                      className={`mt-1 text-sm ${
                        !notification.isRead
                          ? 'text-mountain-stone'
                          : 'text-soft-gray'
                      }`}
                    >
                      {notification.body}
                    </p>

                    <div className="mt-2 flex items-center gap-4 text-xs text-soft-gray">
                      <span>{getCategoryName(notification.category)}</span>
                      <span>{formatDate(notification.timestamp)}</span>
                      <span className="capitalize">
                        {notification.mindfulnessLevel} mindfulness
                      </span>
                    </div>

                    {notification.hexagram && (
                      <div className="mt-2 rounded-md bg-gentle-silver/20 px-2 py-1 text-xs">
                        <span className="font-medium">
                          Hexagram {notification.hexagram.number}:{' '}
                          {notification.hexagram.name}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="ml-4 flex flex-col items-end gap-2">
                    {!notification.isRead && (
                      <button
                        onClick={() => handleMarkAsRead(notification.id)}
                        className="text-xs text-flowing-water hover:text-mountain-stone"
                      >
                        Mark as read
                      </button>
                    )}

                    <div
                      className={`rounded-full px-2 py-1 text-xs ${
                        notification.priority === 'high'
                          ? 'bg-red-100 text-red-600'
                          : notification.priority === 'normal'
                            ? 'bg-blue-100 text-blue-600'
                            : 'bg-green-100 text-green-600'
                      }`}
                    >
                      {notification.priority}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Notification Statistics */}
      {notifications.length > 0 && (
        <Card variant="default">
          <CardContent className="pt-6">
            <h3 className="mb-4 font-medium text-mountain-stone">Statistics</h3>

            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              <div className="text-center">
                <div className="text-lg font-bold text-flowing-water">
                  {notifications.length}
                </div>
                <div className="text-xs text-soft-gray">Total</div>
              </div>

              <div className="text-center">
                <div className="text-lg font-bold text-flowing-water">
                  {notifications.filter(n => !n.isRead).length}
                </div>
                <div className="text-xs text-soft-gray">Unread</div>
              </div>

              <div className="text-center">
                <div className="text-lg font-bold text-flowing-water">
                  {
                    notifications.filter(n => n.category === 'daily_guidance')
                      .length
                  }
                </div>
                <div className="text-xs text-soft-gray">Daily Guidance</div>
              </div>

              <div className="text-center">
                <div className="text-lg font-bold text-flowing-water">
                  {
                    notifications.filter(n => n.category === 'mindful_moment')
                      .length
                  }
                </div>
                <div className="text-xs text-soft-gray">Mindful Moments</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
