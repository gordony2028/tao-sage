# Sage API Contracts
## Complete API Specification for Simplified Architecture

**Version**: 1.0  
**Base URL**: `https://api.sage.com` (Production) | `https://sage-dev.vercel.app` (Development)  
**Authentication**: Bearer Token (Supabase JWT)  
**Content-Type**: `application/json`  

---

## Table of Contents

1. [Authentication APIs](#1-authentication-apis)
2. [Consultation APIs](#2-consultation-apis)
3. [Daily Guidance APIs](#3-daily-guidance-apis)
4. [User Management APIs](#4-user-management-apis)
5. [Integration APIs](#5-integration-apis)
6. [Admin APIs](#6-admin-apis)
7. [WebSocket Events](#7-websocket-events)
8. [Error Handling](#8-error-handling)
9. [Rate Limiting](#9-rate-limiting)
10. [Data Models](#10-data-models)

---

## 1. Authentication APIs

### 1.1 User Registration

```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securePassword123",
  "displayName": "John Doe",
  "preferences": {
    "interpretationStyle": "balanced",
    "guidanceTime": "09:00",
    "timezone": "America/New_York"
  }
}
```

**Response (201 Created)**:
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "email": "user@example.com",
      "displayName": "John Doe",
      "subscriptionTier": "free",
      "onboardingCompleted": false,
      "createdAt": "2025-07-30T10:00:00Z"
    },
    "session": {
      "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "refreshToken": "def50200...",
      "expiresAt": "2025-07-30T14:00:00Z"
    }
  }
}
```

### 1.2 User Login

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Response (200 OK)**:
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "email": "user@example.com",
      "displayName": "John Doe",
      "subscriptionTier": "premium",
      "preferences": {
        "interpretationStyle": "balanced",
        "guidanceTime": "09:00",
        "timezone": "America/New_York"
      },
      "lastLoginAt": "2025-07-30T10:00:00Z"
    },
    "session": {
      "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "refreshToken": "def50200...",
      "expiresAt": "2025-07-30T14:00:00Z"
    }
  }
}
```

### 1.3 Token Refresh

```http
POST /api/auth/refresh
Content-Type: application/json
Authorization: Bearer {refreshToken}

{
  "refreshToken": "def50200..."
}
```

**Response (200 OK)**:
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresAt": "2025-07-30T14:00:00Z"
  }
}
```

### 1.4 Logout

```http
POST /api/auth/logout
Authorization: Bearer {accessToken}
```

**Response (200 OK)**:
```json
{
  "success": true,
  "message": "Successfully logged out"
}
```

---

## 2. Consultation APIs

### 2.1 Create Consultation

```http
POST /api/consultation/create
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "question": "Should I make a career change right now?",
  "category": "career",
  "context": {
    "mood": "contemplative",
    "lifeArea": "professional",
    "urgency": "medium",
    "previousConsultations": 3
  }
}
```

**Response (201 Created)**:
```json
{
  "success": true,
  "data": {
    "consultation": {
      "id": "cons_123e4567e89b12d3a456426614174000",
      "userId": "123e4567-e89b-12d3-a456-426614174000",
      "question": "Should I make a career change right now?",
      "category": "career",
      "hexagramData": {
        "number": 11,
        "name": "Peace",
        "chineseName": "泰",
        "symbol": "☰☷",
        "lines": [7, 8, 8, 9, 9, 9],
        "changingLines": [4, 5, 6],
        "trigrams": {
          "upper": "heaven",
          "lower": "earth"
        },
        "relatingHexagram": {
          "number": 12,
          "name": "Standstill",
          "chineseName": "否"
        }
      },
      "interpretations": {
        "traditional": {
          "meaning": "Peace represents harmony between heaven and earth...",
          "judgment": "Peace. The small departs, the great approaches...",
          "image": "Heaven and earth unite: the image of Peace...",
          "changingLines": {
            "4": "He flutters down; not boasting of his wealth...",
            "5": "The sovereign I gives his daughter in marriage...",
            "6": "The wall falls back into the moat..."
          }
        },
        "personal": {
          "interpretation": "In your career situation, Peace suggests that conditions are favorable for change. The harmony between your aspirations (heaven) and practical circumstances (earth) indicates this is an auspicious time for professional transition...",
          "keyInsights": [
            "Timing is favorable for career transitions",
            "Balance between ambition and practicality is key", 
            "Small obstacles are clearing, major opportunities approaching"
          ],
          "actionGuidance": "Take concrete steps toward your career goals while maintaining stability in other life areas."
        },
        "practical": {
          "nextSteps": [
            "Update your resume and LinkedIn profile",
            "Research companies in your target industry",
            "Network with professionals in your desired field",
            "Set a timeline for making the transition"
          ],
          "timeframe": "1-3 months for preparation, 6 months for execution",
          "riskFactors": [
            "Don't rush the transition despite favorable conditions",
            "Maintain financial stability during the change"
          ]
        }
      },
      "aiContext": {
        "modelVersion": "gpt-4",
        "promptVersion": "v2.1",
        "confidence": 0.89,
        "culturalAccuracy": 0.94
      },
      "createdAt": "2025-07-30T10:30:00Z",
      "updatedAt": "2025-07-30T10:30:00Z"
    }
  }
}
```

### 2.2 Get Consultation

```http
GET /api/consultation/{consultationId}
Authorization: Bearer {accessToken}
```

**Response (200 OK)**:
```json
{
  "success": true,
  "data": {
    "consultation": {
      // Same structure as create response
    }
  }
}
```

### 2.3 Update Consultation Notes

```http
PATCH /api/consultation/{consultationId}
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "userNotes": "This reading really resonated with me. The timing advice feels spot on given my current situation at work.",
  "tags": ["career", "timing", "transition"],
  "favorite": true,
  "rating": 5
}
```

**Response (200 OK)**:
```json
{
  "success": true,
  "data": {
    "consultation": {
      "id": "cons_123e4567e89b12d3a456426614174000",
      "userNotes": "This reading really resonated with me...",
      "tags": ["career", "timing", "transition"],
      "favorite": true,
      "rating": 5,
      "updatedAt": "2025-07-30T11:00:00Z"
    }
  }
}
```

### 2.4 Get User Consultation History

```http
GET /api/consultation/history?limit=20&offset=0&category=career&tags=timing
Authorization: Bearer {accessToken}
```

**Query Parameters**:
- `limit` (optional): Number of results (default: 20, max: 100)
- `offset` (optional): Pagination offset (default: 0)
- `category` (optional): Filter by category
- `tags` (optional): Filter by tags (comma-separated)
- `startDate` (optional): Filter from date (ISO 8601)
- `endDate` (optional): Filter to date (ISO 8601)
- `favorite` (optional): Filter favorites only (true/false)

**Response (200 OK)**:
```json
{
  "success": true,
  "data": {
    "consultations": [
      {
        "id": "cons_123e4567e89b12d3a456426614174000",
        "question": "Should I make a career change right now?",
        "category": "career", 
        "hexagramData": {
          "number": 11,
          "name": "Peace",
          "chineseName": "泰"
        },
        "userNotes": "This reading really resonated with me...",
        "tags": ["career", "timing", "transition"],
        "favorite": true,
        "rating": 5,
        "createdAt": "2025-07-30T10:30:00Z"
      }
    ],
    "pagination": {
      "total": 45,
      "limit": 20,
      "offset": 0,
      "hasMore": true
    }
  }
}
```

---

## 3. Daily Guidance APIs

### 3.1 Get Daily Guidance

```http
GET /api/guidance/daily?date=2025-07-30
Authorization: Bearer {accessToken}
```

**Query Parameters**:
- `date` (optional): Specific date in YYYY-MM-DD format (default: today)

**Response (200 OK)**:
```json
{
  "success": true,
  "data": {
    "guidance": {
      "id": "guide_123e4567e89b12d3a456426614174000",
      "userId": "123e4567-e89b-12d3-a456-426614174000",
      "date": "2025-07-30",
      "hexagram": {
        "number": 11,
        "name": "Peace",
        "chineseName": "泰",
        "symbol": "☰☷"
      },
      "dailyMessage": {
        "theme": "Harmony and Balance",
        "guidance": "Today brings an opportunity for peace and harmony in your endeavors. The energy supports bringing together opposing forces in your life...",
        "focusAreas": [
          "Relationships and communication",
          "Work-life balance",
          "Inner peace and reflection"
        ],
        "avoidToday": [
          "Forcing outcomes",
          "Ignoring small warning signs",
          "Taking current harmony for granted"
        ]
      },
      "personalizedInsights": {
        "basedOnHistory": "Your recent consultations show a pattern of seeking balance in professional matters. Today's energy supports the decisions you've been contemplating.",
        "calendarContext": "With your important meeting at 2 PM, approach it with the calm confidence that Peace represents.",
        "nextSteps": "Take time for quiet reflection this morning before engaging in important conversations."
      },
      "aiContext": {
        "generatedAt": "2025-07-30T06:00:00Z",
        "personalizedElements": ["consultation_history", "calendar_events", "user_preferences"],
        "confidence": 0.91
      },
      "createdAt": "2025-07-30T06:00:00Z"
    }
  }
}
```

### 3.2 Generate Custom Guidance

```http
POST /api/guidance/generate
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "focusArea": "decision_making",
  "context": {
    "situation": "Considering a major life change",
    "timeframe": "next_month",
    "concerns": ["financial_stability", "family_impact"]
  }
}
```

**Response (201 Created)**:
```json
{
  "success": true,
  "data": {
    "guidance": {
      "id": "guide_custom_123e4567e89b12d3a456426614174000",
      "type": "custom",
      "hexagram": {
        "number": 3,
        "name": "Difficulty at the Beginning",
        "chineseName": "屯"
      },
      "guidance": "Major life changes often begin with a period of difficulty and uncertainty...",
      "actionSteps": [
        "Create a detailed financial plan for the transition",
        "Discuss concerns openly with family members",
        "Seek advice from others who have made similar changes"
      ],
      "timing": "Allow 2-3 months for careful preparation before implementing changes",
      "createdAt": "2025-07-30T14:30:00Z"
    }
  }
}
```

---

## 4. User Management APIs

### 4.1 Get User Profile

```http
GET /api/user/profile
Authorization: Bearer {accessToken}
```

**Response (200 OK)**:
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "email": "user@example.com",
      "displayName": "John Doe",
      "subscriptionTier": "premium",
      "preferences": {
        "interpretationStyle": "balanced",
        "guidanceTime": "09:00",
        "timezone": "America/New_York",
        "notifications": {
          "dailyGuidance": true,
          "consultationReminders": false,
          "weeklyInsights": true
        },
        "privacy": {
          "analyticsOptIn": true,
          "marketingOptIn": false
        }
      },
      "statistics": {
        "totalConsultations": 47,
        "currentStreak": 12,
        "longestStreak": 28,
        "favoriteCategory": "career",
        "averageRating": 4.6,
        "joinDate": "2025-06-15T00:00:00Z"
      },
      "subscription": {
        "tier": "premium",
        "status": "active",
        "currentPeriodStart": "2025-07-01T00:00:00Z",
        "currentPeriodEnd": "2025-08-01T00:00:00Z",
        "cancelAtPeriodEnd": false
      },
      "createdAt": "2025-06-15T10:00:00Z",
      "updatedAt": "2025-07-30T08:00:00Z"
    }
  }
}
```

### 4.2 Update User Profile

```http
PATCH /api/user/profile
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "displayName": "John Smith",
  "preferences": {
    "interpretationStyle": "traditional",
    "guidanceTime": "07:30",
    "notifications": {
      "dailyGuidance": true,
      "consultationReminders": true,
      "weeklyInsights": false
    }
  }
}
```

**Response (200 OK)**:
```json
{
  "success": true,
  "data": {
    "user": {
      // Updated user object
    }
  }
}
```

### 4.3 Get User Analytics

```http
GET /api/user/analytics?period=month&startDate=2025-07-01&endDate=2025-07-30
Authorization: Bearer {accessToken}
```

**Query Parameters**:
- `period` (optional): `day`, `week`, `month`, `year` (default: `month`)
- `startDate` (optional): Custom start date (ISO 8601)
- `endDate` (optional): Custom end date (ISO 8601)

**Response (200 OK)**:
```json
{
  "success": true,
  "data": {
    "analytics": {
      "period": "month",
      "startDate": "2025-07-01",
      "endDate": "2025-07-30",
      "consultations": {
        "total": 15,
        "byCategory": {
          "career": 6,
          "relationships": 4,
          "spiritual": 3,
          "health": 2
        },
        "avgRating": 4.6,
        "favoriteHexagrams": [
          { "number": 11, "name": "Peace", "count": 3 },
          { "number": 1, "name": "The Creative", "count": 2 }
        ]
      },
      "patterns": {
        "mostActiveDay": "Tuesday",
        "preferredTime": "09:00-10:00",
        "consultationStreak": 12,
        "themes": ["transition", "balance", "decision-making"]
      },
      "insights": {
        "personalGrowth": "You've shown consistent focus on career-related questions, indicating a period of professional development.",
        "recommendations": [
          "Consider exploring relationship-focused consultations for more balanced guidance",
          "Your high rating of consultations suggests strong alignment with I Ching wisdom"
        ]
      }
    }
  }
}
```

### 4.4 Export User Data

```http
POST /api/user/export
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "format": "json",
  "includeConsultations": true,
  "includeAnalytics": true,
  "dateRange": {
    "startDate": "2025-01-01",
    "endDate": "2025-07-30"
  }
}
```

**Response (202 Accepted)**:
```json
{
  "success": true,
  "data": {
    "exportId": "export_123e4567e89b12d3a456426614174000",
    "estimatedCompletionTime": "2025-07-30T15:00:00Z",
    "status": "processing"
  }
}
```

### 4.5 Get Export Status

```http
GET /api/user/export/{exportId}
Authorization: Bearer {accessToken}
```

**Response (200 OK)**:
```json
{
  "success": true,
  "data": {
    "export": {
      "id": "export_123e4567e89b12d3a456426614174000",
      "status": "completed",
      "format": "json",
      "downloadUrl": "https://sage-exports.s3.amazonaws.com/user_123.json?signed_url",
      "expiresAt": "2025-08-06T15:00:00Z",
      "fileSize": 2547392,
      "createdAt": "2025-07-30T14:30:00Z",
      "completedAt": "2025-07-30T14:32:00Z"
    }
  }
}
```

---

## 5. Integration APIs

### 5.1 Calendar Integration

#### 5.1.1 Connect Calendar

```http
POST /api/integration/calendar/connect
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "provider": "google",
  "authCode": "4/0AX4XfWjYZ1234567890abcdef",
  "redirectUri": "https://sage.com/integrations/callback"
}
```

**Response (201 Created)**:
```json
{
  "success": true,
  "data": {
    "integration": {
      "id": "int_123e4567e89b12d3a456426614174000",
      "provider": "google",
      "status": "connected",
      "userEmail": "user@gmail.com",
      "permissions": ["read_events", "read_calendars"],
      "lastSyncAt": "2025-07-30T15:00:00Z",
      "createdAt": "2025-07-30T15:00:00Z"
    }
  }
}
```

#### 5.1.2 Sync Calendar Events

```http
POST /api/integration/calendar/sync
Authorization: Bearer {accessToken}
```

**Response (200 OK)**:
```json
{
  "success": true,
  "data": {
    "sync": {
      "syncId": "sync_123e4567e89b12d3a456426614174000",
      "eventsProcessed": 23,
      "guidanceGenerated": 5,
      "lastSyncAt": "2025-07-30T15:30:00Z",
      "nextSyncAt": "2025-07-31T15:30:00Z"
    }
  }
}
```

#### 5.1.3 Get Calendar Insights

```http
GET /api/integration/calendar/insights?days=7
Authorization: Bearer {accessToken}
```

**Response (200 OK)**:
```json
{
  "success": true,
  "data": {
    "insights": {
      "upcomingEvents": [
        {
          "eventId": "event_google_123456",
          "title": "Quarterly Review Meeting",
          "startTime": "2025-07-31T14:00:00Z",
          "guidance": {
            "hexagram": 61,
            "recommendation": "Approach this meeting with openness and sincerity. Inner truth will guide your communications.",
            "preparation": "Take 10 minutes before the meeting for quiet reflection on your achievements and goals."
          }
        }
      ],
      "patterns": {
        "stressfulPeriods": ["2025-08-05 to 2025-08-07"],
        "optimalTimes": ["2025-08-01 morning", "2025-08-03 afternoon"],
        "recommendations": [
          "Schedule important decisions during optimal times",
          "Plan self-care activities before stressful periods"
        ]
      }
    }
  }
}
```

### 5.2 Payment Integration

#### 5.2.1 Create Subscription

```http
POST /api/subscription/create
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "tier": "premium",
  "paymentMethodId": "pm_1234567890abcdef",
  "billingCycle": "monthly"
}
```

**Response (201 Created)**:
```json
{
  "success": true,
  "data": {
    "subscription": {
      "id": "sub_123e4567e89b12d3a456426614174000",
      "tier": "premium",
      "status": "active",
      "currentPeriodStart": "2025-07-30T16:00:00Z",
      "currentPeriodEnd": "2025-08-30T16:00:00Z",
      "billingCycle": "monthly",
      "amount": 699,
      "currency": "usd",
      "nextBillingDate": "2025-08-30T16:00:00Z"
    }
  }
}
```

#### 5.2.2 Webhook Handler

```http
POST /api/webhooks/stripe
Content-Type: application/json
Stripe-Signature: t=1234567890,v1=abcdef...

{
  "id": "evt_1234567890abcdef",
  "object": "event",
  "type": "customer.subscription.updated",
  "data": {
    "object": {
      // Stripe subscription object
    }
  }
}
```

**Response (200 OK)**:
```json
{
  "received": true
}
```

---

## 6. Admin APIs

### 6.1 User Management

#### 6.1.1 Get Users

```http
GET /api/admin/users?limit=50&offset=0&tier=premium&status=active
Authorization: Bearer {adminToken}
```

**Response (200 OK)**:
```json
{
  "success": true,
  "data": {
    "users": [
      {
        "id": "123e4567-e89b-12d3-a456-426614174000",
        "email": "user@example.com",
        "displayName": "John Doe",
        "subscriptionTier": "premium",
        "status": "active",
        "totalConsultations": 47,
        "lastActiveAt": "2025-07-30T10:00:00Z",
        "createdAt": "2025-06-15T10:00:00Z"
      }
    ],
    "pagination": {
      "total": 1250,
      "limit": 50,
      "offset": 0,
      "hasMore": true
    }
  }
}
```

### 6.2 Content Management

#### 6.2.1 Update Hexagram Content

```http
PATCH /api/admin/hexagrams/{hexagramNumber}
Authorization: Bearer {adminToken}
Content-Type: application/json

{
  "traditionalInterpretation": "Updated traditional interpretation...",
  "culturalNotes": "Additional cultural context...",
  "reviewedBy": "dr_wang_cultural_expert",
  "reviewDate": "2025-07-30T12:00:00Z"
}
```

**Response (200 OK)**:
```json
{
  "success": true,
  "data": {
    "hexagram": {
      "number": 11,
      "name": "Peace",
      "traditionalInterpretation": "Updated traditional interpretation...",
      "culturalNotes": "Additional cultural context...",
      "reviewedBy": "dr_wang_cultural_expert",
      "reviewDate": "2025-07-30T12:00:00Z",
      "updatedAt": "2025-07-30T12:00:00Z"
    }
  }
}
```

### 6.3 Analytics

#### 6.3.1 Get Platform Analytics

```http
GET /api/admin/analytics?period=month&metrics=users,consultations,revenue
Authorization: Bearer {adminToken}
```

**Response (200 OK)**:
```json
{
  "success": true,
  "data": {
    "analytics": {
      "period": "month",
      "dateRange": {
        "start": "2025-07-01",
        "end": "2025-07-30"
      },
      "users": {
        "total": 1250,
        "new": 185,
        "active": 890,
        "churned": 23,
        "byTier": {
          "free": 800,
          "premium": 350,
          "pro": 100
        }
      },
      "consultations": {
        "total": 5420,
        "averageRating": 4.6,
        "byCategory": {
          "career": 2100,
          "relationships": 1580,
          "spiritual": 980,
          "health": 760
        }
      },
      "revenue": {
        "total": 18750,
        "currency": "usd",
        "byTier": {
          "premium": 12250,
          "pro": 6500
        },
        "mrr": 18750,
        "churnRate": 0.035
      }
    }
  }
}
```

---

## 7. WebSocket Events

### 7.1 Real-time Guidance

```javascript
// WebSocket connection
const ws = new WebSocket('wss://api.sage.com/ws');

// Authentication
ws.send(JSON.stringify({
  type: 'auth',
  token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
}));

// Subscribe to events
ws.send(JSON.stringify({
  type: 'subscribe',
  channels: ['guidance', 'notifications']
}));

// Incoming events
{
  "type": "proactive_guidance",
  "data": {
    "guidance": {
      "message": "With your important meeting approaching in 2 hours, consider the wisdom of hexagram 61: Inner Truth guides authentic communication.",
      "hexagram": 61,
      "actionSuggestion": "Take a few minutes to center yourself and reflect on your genuine intentions for this meeting.",
      "priority": "medium"
    }
  },
  "timestamp": "2025-07-30T12:00:00Z"
}
```

---

## 8. Error Handling

### 8.1 Error Response Format

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "The request contains invalid data",
    "details": [
      {
        "field": "question",
        "message": "Question must be at least 10 characters long"
      }
    ],
    "requestId": "req_123e4567e89b12d3a456426614174000",
    "timestamp": "2025-07-30T15:30:00Z"
  }
}
```

### 8.2 Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `VALIDATION_ERROR` | 400 | Invalid request data |
| `AUTHENTICATION_ERROR` | 401 | Invalid or missing authentication |
| `AUTHORIZATION_ERROR` | 403 | Insufficient permissions |
| `NOT_FOUND` | 404 | Resource not found |
| `RATE_LIMIT_EXCEEDED` | 429 | Too many requests |
| `SUBSCRIPTION_REQUIRED` | 402 | Premium subscription required |
| `AI_SERVICE_ERROR` | 503 | OpenAI service unavailable |
| `INTEGRATION_ERROR` | 502 | External service error |
| `INTERNAL_ERROR` | 500 | Internal server error |

---

## 9. Rate Limiting

### 9.1 Rate Limits by Tier

| Endpoint | Free Tier | Premium Tier | Pro Tier |
|----------|-----------|--------------|----------|
| `POST /api/consultation/create` | 3/hour | 50/hour | 200/hour |
| `GET /api/guidance/daily` | 10/day | Unlimited | Unlimited |
| `POST /api/guidance/generate` | 0/day | 5/day | 20/day |
| `GET /api/user/*` | 100/hour | 500/hour | 1000/hour |
| `POST /api/integration/*` | 0/hour | 10/hour | 50/hour |

### 9.2 Rate Limit Headers

```http
HTTP/1.1 200 OK
X-RateLimit-Limit: 50
X-RateLimit-Remaining: 47
X-RateLimit-Reset: 1627747200
X-RateLimit-Tier: premium
```

### 9.3 Rate Limit Exceeded Response

```http
HTTP/1.1 429 Too Many Requests
Content-Type: application/json

{
  "success": false,
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Rate limit exceeded for consultation creation",
    "details": {
      "limit": 3,
      "window": "1 hour",
      "resetAt": "2025-07-30T17:00:00Z",
      "upgradeUrl": "https://sage.com/upgrade"
    }
  }
}
```

---

## 10. Data Models

### 10.1 User Model

```typescript
interface User {
  id: string;
  email: string;
  displayName: string;
  subscriptionTier: 'free' | 'premium' | 'pro';
  preferences: {
    interpretationStyle: 'traditional' | 'modern' | 'balanced';
    guidanceTime: string; // HH:MM format
    timezone: string;
    notifications: {
      dailyGuidance: boolean;
      consultationReminders: boolean;
      weeklyInsights: boolean;
    };
    privacy: {
      analyticsOptIn: boolean;
      marketingOptIn: boolean;
    };
  };
  statistics: {
    totalConsultations: number;
    currentStreak: number;
    longestStreak: number;
    favoriteCategory: string;
    averageRating: number;
    joinDate: string;
  };
  subscription?: {
    tier: string;
    status: 'active' | 'cancelled' | 'past_due';
    currentPeriodStart: string;
    currentPeriodEnd: string;
    cancelAtPeriodEnd: boolean;
  };
  onboardingCompleted: boolean;
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
}
```

### 10.2 Consultation Model

```typescript
interface Consultation {
  id: string;
  userId: string;
  question: string;
  category: 'career' | 'relationships' | 'health' | 'spiritual' | 'general';
  hexagramData: {
    number: number; // 1-64
    name: string;
    chineseName: string;
    symbol: string;
    lines: number[]; // Array of 6 line values (6,7,8,9)
    changingLines: number[]; // Array of line positions (1-6)
    trigrams: {
      upper: string;
      lower: string;
    };
    relatingHexagram?: {
      number: number;
      name: string;
      chineseName: string;
    };
  };
  interpretations: {
    traditional: {
      meaning: string;
      judgment: string;
      image: string;
      changingLines?: Record<string, string>;
    };
    personal: {
      interpretation: string;
      keyInsights: string[];
      actionGuidance: string;
    };
    practical: {
      nextSteps: string[];
      timeframe: string;
      riskFactors: string[];
    };
  };
  userNotes?: string;
  tags: string[];
  favorite: boolean;
  rating?: number; // 1-5
  aiContext: {
    modelVersion: string;
    promptVersion: string;
    confidence: number;
    culturalAccuracy: number;
  };
  createdAt: string;
  updatedAt: string;
}
```

### 10.3 Daily Guidance Model

```typescript
interface DailyGuidance {
  id: string;
  userId: string;
  date: string; // YYYY-MM-DD
  hexagram: {
    number: number;
    name: string;
    chineseName: string;
    symbol: string;
  };
  dailyMessage: {
    theme: string;
    guidance: string;
    focusAreas: string[];
    avoidToday: string[];
  };
  personalizedInsights: {
    basedOnHistory: string;
    calendarContext?: string;
    nextSteps: string;
  };
  aiContext: {
    generatedAt: string;
    personalizedElements: string[];
    confidence: number;
  };
  createdAt: string;
}
```

### 10.4 Integration Model

```typescript
interface CalendarIntegration {
  id: string;
  userId: string;
  provider: 'google' | 'outlook' | 'apple';
  status: 'connected' | 'disconnected' | 'error';
  userEmail: string;
  permissions: string[];
  accessToken?: string; // Encrypted
  refreshToken?: string; // Encrypted
  lastSyncAt?: string;
  nextSyncAt?: string;
  syncErrors?: {
    count: number;
    lastError: string;
    lastErrorAt: string;
  };
  createdAt: string;
  updatedAt: string;
}
```

---

## 11. OpenAPI Specification

The complete OpenAPI 3.0 specification is available at:
- **Production**: `https://api.sage.com/docs`
- **Development**: `https://sage-dev.vercel.app/api/docs`

### 11.1 Authentication

All endpoints except `/api/auth/*` and `/api/webhooks/*` require Bearer token authentication:

```yaml
securitySchemes:
  BearerAuth:
    type: http
    scheme: bearer
    bearerFormat: JWT
```

### 11.2 Content Types

- **Request**: `application/json`
- **Response**: `application/json`
- **File uploads**: `multipart/form-data`

### 11.3 Versioning

API versioning through URL path:
- Current: `/api/v1/*` (default, can be omitted)
- Future: `/api/v2/*` (when needed)

---

## Conclusion

This API specification provides comprehensive contracts for all Sage functionality using the simplified Next.js + Supabase + OpenAI architecture. Key features:

✅ **Complete Feature Coverage**: All PRD requirements supported  
✅ **RESTful Design**: Consistent, predictable endpoint patterns  
✅ **Comprehensive Error Handling**: Clear error messages and codes  
✅ **Tiered Rate Limiting**: Fair usage policies by subscription tier  
✅ **Real-time Capabilities**: WebSocket support for proactive guidance  
✅ **Admin Functionality**: Complete admin API for management  
✅ **Integration Ready**: Calendar, payment, and webhook support  

The API design prioritizes:
- **Developer Experience**: Clear request/response patterns
- **Security**: Proper authentication and authorization
- **Scalability**: Efficient pagination and caching headers
- **Flexibility**: JSONB fields for extensibility
- **Cultural Authenticity**: Expert review workflow built-in

These contracts can be implemented directly in Next.js API routes with Supabase backend, providing a production-ready API that scales with the business.
