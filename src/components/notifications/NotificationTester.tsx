'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import {
  useNotifications,
  useNotificationTester,
} from '@/hooks/useNotifications';

export default function NotificationTester() {
  const { permission, isSupported, isEnabled, enableNotifications } =
    useNotifications();
  const {
    testDailyGuidance,
    testReflectionPrompt,
    testMindfulMoment,
    testCulturalInsight,
  } = useNotificationTester();

  if (!isSupported) {
    return (
      <Card variant="default">
        <CardContent className="py-8 text-center">
          <div className="mb-4 text-4xl">❌</div>
          <h3 className="mb-2 text-lg font-medium text-mountain-stone">
            Notifications Not Supported
          </h3>
          <p className="text-soft-gray">
            Your browser doesn&apos;t support notifications.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card variant="default">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="text-2xl">🧪</span>
          Notification Tester
        </CardTitle>
        <p className="text-sm text-soft-gray">
          Test different types of mindful notifications
        </p>
      </CardHeader>
      <CardContent>
        {/* Status */}
        <div className="mb-6 rounded-lg bg-gentle-silver/10 p-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-mountain-stone">Status</h4>
              <p className="text-sm text-soft-gray">
                Permission: {permission} | Enabled: {isEnabled ? 'Yes' : 'No'}
              </p>
            </div>
            {permission !== 'granted' && (
              <Button size="sm" onClick={enableNotifications}>
                Enable Notifications
              </Button>
            )}
          </div>
        </div>

        {/* Test Buttons */}
        {permission === 'granted' && isEnabled && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <Button
                variant="outline"
                onClick={testDailyGuidance}
                className="flex items-center gap-2"
              >
                <span className="text-lg">🌅</span>
                Test Daily Guidance
              </Button>

              <Button
                variant="outline"
                onClick={testReflectionPrompt}
                className="flex items-center gap-2"
              >
                <span className="text-lg">🤔</span>
                Test Reflection Prompt
              </Button>

              <Button
                variant="outline"
                onClick={testMindfulMoment}
                className="flex items-center gap-2"
              >
                <span className="text-lg">🍃</span>
                Test Mindful Moment
              </Button>

              <Button
                variant="outline"
                onClick={testCulturalInsight}
                className="flex items-center gap-2"
              >
                <span className="text-lg">🏛️</span>
                Test Cultural Insight
              </Button>
            </div>

            <div className="mt-6 rounded-lg bg-blue-50 p-4 text-sm text-blue-800">
              <p className="mb-1 font-medium">💡 Testing Tips:</p>
              <ul className="space-y-1 text-blue-700">
                <li>
                  • Notifications will appear in the top-right corner of your
                  screen
                </li>
                <li>
                  • Click on a notification to navigate to the relevant page
                </li>
                <li>• Check your notification history in the History tab</li>
                <li>
                  • Adjust quiet hours in Settings to control when notifications
                  appear
                </li>
              </ul>
            </div>
          </div>
        )}

        {/* Permission Denied */}
        {permission === 'denied' && (
          <div className="rounded-lg bg-red-50 p-4 text-center">
            <div className="mb-2 text-2xl">🚫</div>
            <h4 className="font-medium text-red-800">Notifications Blocked</h4>
            <p className="text-sm text-red-600">
              Please enable notifications in your browser settings to test the
              system.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
