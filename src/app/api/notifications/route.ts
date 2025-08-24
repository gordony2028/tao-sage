import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/client';

export const runtime = 'nodejs';

/**
 * Notification Management API
 * Handles notification delivery, preferences, and history
 */

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('user_id');
    const type = searchParams.get('type'); // 'preferences' | 'history'

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }

    if (type === 'preferences') {
      // Get user notification preferences
      const { data: preferences, error } = await supabaseAdmin
        .from('user_events')
        .select('event_data')
        .eq('user_id', userId)
        .eq('event_type', 'notification_preferences_updated')
        .order('created_at', { ascending: false })
        .limit(1);

      if (error) {
        console.error('Error fetching notification preferences:', error);
        return NextResponse.json(
          { error: 'Failed to fetch preferences' },
          { status: 500 }
        );
      }

      const latestPreferences = preferences?.[0]?.event_data?.preferences || {
        enabled: false,
        dailyGuidance: { enabled: true, time: '08:00', timezone: 'UTC' },
        reflectionPrompts: {
          enabled: true,
          frequency: 'daily',
          times: ['18:00'],
        },
        mindfulMoments: {
          enabled: true,
          frequency: 4,
          quiet_hours: { start: '22:00', end: '06:00' },
        },
        culturalInsights: { enabled: true, frequency: 'weekly' },
      };

      return NextResponse.json({ preferences: latestPreferences });
    }

    if (type === 'history') {
      // Get notification history from events
      const { data: history, error } = await supabaseAdmin
        .from('user_events')
        .select('*')
        .eq('user_id', userId)
        .eq('event_type', 'notification_sent')
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) {
        console.error('Error fetching notification history:', error);
        return NextResponse.json(
          { error: 'Failed to fetch history' },
          { status: 500 }
        );
      }

      const notifications = history.map(event => ({
        id: event.id,
        title: event.event_data?.title || 'Notification',
        body: event.event_data?.body || '',
        category: event.event_data?.category || 'general',
        priority: event.event_data?.priority || 'normal',
        mindfulnessLevel: event.event_data?.mindfulnessLevel || 'gentle',
        timestamp: event.created_at,
        hexagram: event.event_data?.hexagram,
        isRead: event.event_data?.isRead || false,
      }));

      return NextResponse.json({ notifications });
    }

    return NextResponse.json(
      { error: 'Invalid type parameter' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Notification GET error:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
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
      case 'update_preferences':
        // Save notification preferences
        await supabaseAdmin.from('user_events').insert({
          user_id,
          event_type: 'notification_preferences_updated',
          event_data: {
            preferences: data.preferences,
            updated_at: new Date().toISOString(),
          },
        });
        break;

      case 'send_notification':
        // Log notification sent
        await supabaseAdmin.from('user_events').insert({
          user_id,
          event_type: 'notification_sent',
          event_data: {
            title: data.title,
            body: data.body,
            category: data.category,
            priority: data.priority || 'normal',
            mindfulnessLevel: data.mindfulnessLevel || 'gentle',
            hexagram: data.hexagram,
            sent_at: new Date().toISOString(),
            isRead: false,
          },
        });
        break;

      case 'mark_as_read':
        // Update notification read status
        await supabaseAdmin
          .from('user_events')
          .update({
            event_data: {
              ...data,
              isRead: true,
              read_at: new Date().toISOString(),
            },
          })
          .eq('id', data.notification_id)
          .eq('user_id', user_id);
        break;

      case 'schedule_daily_guidance':
        // Schedule next daily guidance notification
        await supabaseAdmin.from('user_events').insert({
          user_id,
          event_type: 'notification_scheduled',
          event_data: {
            category: 'daily_guidance',
            scheduled_for: data.scheduledTime,
            hexagram_number: data.hexagram?.number,
            created_at: new Date().toISOString(),
          },
        });
        break;

      case 'log_mindful_moment':
        // Log mindful moment notification
        await supabaseAdmin.from('user_events').insert({
          user_id,
          event_type: 'mindful_moment_delivered',
          event_data: {
            title: data.title,
            body: data.body,
            mindfulness_level: data.mindfulnessLevel,
            triggered_at: new Date().toISOString(),
          },
        });
        break;

      case 'cultural_insight_delivered':
        // Log cultural insight notification
        await supabaseAdmin.from('user_events').insert({
          user_id,
          event_type: 'cultural_insight_delivered',
          event_data: {
            title: data.title,
            body: data.body,
            insight_type: data.insightType,
            user_progress_context: data.userProgressContext,
            delivered_at: new Date().toISOString(),
          },
        });
        break;

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Notification POST error:', error);
    return NextResponse.json(
      { error: 'Failed to process action' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { user_id, notification_id, updates } = body;

    if (!user_id || !notification_id) {
      return NextResponse.json(
        { error: 'User ID and notification ID required' },
        { status: 400 }
      );
    }

    // Update notification
    const { error } = await supabaseAdmin
      .from('user_events')
      .update({
        event_data: updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', notification_id)
      .eq('user_id', user_id)
      .eq('event_type', 'notification_sent');

    if (error) {
      console.error('Error updating notification:', error);
      return NextResponse.json(
        { error: 'Failed to update notification' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Notification PUT error:', error);
    return NextResponse.json(
      { error: 'Failed to update notification' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('user_id');
    const notificationId = searchParams.get('notification_id');
    const action = searchParams.get('action'); // 'delete_notification' | 'clear_history'

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }

    if (action === 'clear_history') {
      // Clear all notification history for user
      const { error } = await supabaseAdmin
        .from('user_events')
        .delete()
        .eq('user_id', userId)
        .eq('event_type', 'notification_sent');

      if (error) {
        console.error('Error clearing notification history:', error);
        return NextResponse.json(
          { error: 'Failed to clear history' },
          { status: 500 }
        );
      }

      return NextResponse.json({ success: true, message: 'History cleared' });
    }

    if (action === 'delete_notification' && notificationId) {
      // Delete specific notification
      const { error } = await supabaseAdmin
        .from('user_events')
        .delete()
        .eq('id', notificationId)
        .eq('user_id', userId)
        .eq('event_type', 'notification_sent');

      if (error) {
        console.error('Error deleting notification:', error);
        return NextResponse.json(
          { error: 'Failed to delete notification' },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        message: 'Notification deleted',
      });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('Notification DELETE error:', error);
    return NextResponse.json(
      { error: 'Failed to process delete request' },
      { status: 500 }
    );
  }
}
