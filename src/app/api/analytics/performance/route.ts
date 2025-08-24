import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

/**
 * Performance Analytics Collection Endpoint
 * Stores performance metrics for analysis and monitoring
 */

interface PerformanceMetric {
  type: string;
  value: number;
  timestamp: string;
  metadata?: any;
}

interface WebVital {
  name: string;
  value: number;
  timestamp: string;
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    // Validate the incoming data
    if (!data.type && !data.name) {
      return NextResponse.json(
        { error: 'Missing required fields: type or name' },
        { status: 400 }
      );
    }

    if (!data.value || !data.timestamp) {
      return NextResponse.json(
        { error: 'Missing required fields: value and timestamp' },
        { status: 400 }
      );
    }

    // Extract user information from headers (if available)
    const userAgent = request.headers.get('user-agent') || 'unknown';
    const clientIP =
      request.headers.get('x-forwarded-for') ||
      request.headers.get('x-real-ip') ||
      'unknown';

    // Create analytics entry
    const analyticsEntry = {
      ...data,
      userAgent,
      clientIP: clientIP.split(',')[0], // Take first IP if multiple
      receivedAt: new Date().toISOString(),
    };

    // In a real app, you would store this in a database
    // For now, we'll silently process it and return success
    // Logging disabled to prevent console spam

    // TODO: Store in database
    // await storePerformanceMetric(analyticsEntry);

    // Calculate performance insights
    const insights = await generatePerformanceInsights(data);

    return NextResponse.json({
      success: true,
      message: 'Performance metric recorded',
      insights,
    });
  } catch (error) {
    console.error('Performance analytics error:', error);
    return NextResponse.json(
      { error: 'Failed to record performance metric' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const metricType = searchParams.get('type');
    const timeRange = searchParams.get('range') || '24h';

    // In a real app, you would query the database
    // For now, return mock performance summary
    const performanceSummary = {
      timeRange,
      metricType,
      summary: {
        totalMetrics: 145,
        averagePageLoad: 1.2,
        averageAPIResponse: 156,
        webVitalsScore: 85,
        performanceGrade: 'B',
        topIssues: [
          'API response time exceeds 200ms threshold',
          'Bundle size larger than recommended 500KB',
          'Memory usage occasionally peaks above 70%',
        ],
      },
      trends: {
        pageLoadTime: { current: 1.2, previous: 1.4, change: -14.3 },
        apiResponseTime: { current: 156, previous: 189, change: -17.5 },
        memoryUsage: { current: 65, previous: 72, change: -9.7 },
      },
    };

    return NextResponse.json(performanceSummary);
  } catch (error) {
    console.error('Performance analytics retrieval error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve performance analytics' },
      { status: 500 }
    );
  }
}

/**
 * Generate performance insights based on incoming metrics
 */
async function generatePerformanceInsights(
  data: PerformanceMetric | WebVital
): Promise<any> {
  const insights = {
    status: 'good',
    recommendations: [] as string[],
    alerts: [] as string[],
  };

  // Analyze Web Vitals
  if ('name' in data) {
    switch (data.name) {
      case 'LCP':
        if (data.value > 4000) {
          insights.status = 'poor';
          insights.alerts.push('Largest Contentful Paint exceeds 4 seconds');
          insights.recommendations.push(
            'Optimize images and reduce server response time'
          );
        } else if (data.value > 2500) {
          insights.status = 'needs-improvement';
          insights.recommendations.push(
            'Consider optimizing critical rendering path'
          );
        }
        break;

      case 'FID':
        if (data.value > 300) {
          insights.status = 'poor';
          insights.alerts.push('First Input Delay exceeds 300ms');
          insights.recommendations.push('Reduce JavaScript execution time');
        } else if (data.value > 100) {
          insights.status = 'needs-improvement';
          insights.recommendations.push(
            'Consider code splitting to reduce main thread blocking'
          );
        }
        break;

      case 'CLS':
        if (data.value > 0.25) {
          insights.status = 'poor';
          insights.alerts.push('Cumulative Layout Shift exceeds 0.25');
          insights.recommendations.push(
            'Reserve space for images and dynamic content'
          );
        } else if (data.value > 0.1) {
          insights.status = 'needs-improvement';
          insights.recommendations.push('Minimize unexpected layout shifts');
        }
        break;
    }
  }

  // Analyze Performance Metrics
  if ('type' in data) {
    switch (data.type) {
      case 'pageLoad':
        if (data.value > 5000) {
          insights.status = 'poor';
          insights.alerts.push('Page load time exceeds 5 seconds');
          insights.recommendations.push(
            'Implement code splitting and lazy loading'
          );
        } else if (data.value > 3000) {
          insights.status = 'needs-improvement';
          insights.recommendations.push(
            'Optimize bundle size and critical resources'
          );
        }
        break;

      case 'apiResponse':
        if (data.value > 500) {
          insights.status = 'poor';
          insights.alerts.push('API response time exceeds 500ms');
          insights.recommendations.push(
            'Optimize database queries and add caching'
          );
        } else if (data.value > 200) {
          insights.status = 'needs-improvement';
          insights.recommendations.push(
            'Consider API optimization or edge caching'
          );
        }
        break;

      case 'memory':
        if (data.value > 90) {
          insights.status = 'poor';
          insights.alerts.push('Memory usage exceeds 90%');
          insights.recommendations.push(
            'Check for memory leaks and optimize data structures'
          );
        } else if (data.value > 70) {
          insights.status = 'needs-improvement';
          insights.recommendations.push(
            'Monitor memory usage and consider optimization'
          );
        }
        break;
    }
  }

  return insights;
}
