# EDUVISION AI - API Documentation

**Complete REST API endpoint documentation for EDUVISION AI.**

---

## Table of Contents

1. [Overview](#overview)
2. [Authentication](#authentication)
3. [API Endpoints](#api-endpoints)
4. [Response Formats](#response-formats)
5. [Error Handling](#error-handling)
6. [Examples](#examples)

---

## Overview

### Base URL

```
Development: http://localhost:8000/api/v1
Production: https://your-domain.com/api/v1
```

### API Version

**Current Version**: 1.0

### Request Headers

All requests should include:

```
Content-Type: application/json
Authorization: Bearer {access_token}  # For authenticated endpoints
```

### Response Format

All responses follow a consistent format (see [Response Formats](#response-formats)).

---

## Authentication

### 1. Login

**Endpoint:** `POST /auth/login`

**Description:** Authenticate user and receive JWT access token.

**Request Body:**
```json
{
  "email": "teacher@school.com",
  "password": "password123"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "access_token": "eyJhbGc...",
    "token_type": "bearer",
    "user": {
      "id": "uuid",
      "email": "teacher@school.com",
      "name": "Prof. Rajesh Kumar",
      "role": "teacher"
    }
  },
  "message": "Login successful"
}
```

**Error Response (401):**
```json
{
  "detail": "Invalid email or password"
}
```

### 2. Get Current User

**Endpoint:** `GET /auth/me`

**Description:** Get information about the authenticated user.

**Authentication:** Required ✓

**Response (200 OK):**
```json
{
  "id": "uuid",
  "email": "teacher@school.com",
  "name": "Prof. Rajesh Kumar",
  "role": "teacher",
  "is_active": true,
  "created_at": "2026-10-04T12:00:00+00:00"
}
```

### 3. Logout

**Endpoint:** `POST /auth/logout`

**Description:** Logout user (frontend invalidates token).

**Authentication:** Optional

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Logout successful"
}
```

---

## API Endpoints

### Student Endpoints

#### Get Student List

**Endpoint:** `GET /students`

**Description:** List all students with pagination.

**Authentication:** Required (teacher, admin)

**Query Parameters:**
- `page` (int, default: 1) - Page number
- `page_size` (int, default: 20) - Items per page
- `search` (str) - Search by name or student_id
- `class` (str) - Filter by class/semester

**Response (200 OK):**
```json
{
  "items": [
    {
      "id": "uuid",
      "name": "Aarav Sharma",
      "email": "student@school.com",
      "student_id": "STU00001",
      "class_semester": "BCA-4",
      "enrollment_status": "active",
      "created_at": "2026-10-04T12:00:00+00:00"
    }
  ],
  "total": 250,
  "page": 1,
  "page_size": 20,
  "total_pages": 13
}
```

#### Get Student Profile

**Endpoint:** `GET /students/{student_id}`

**Description:** Get detailed student profile.

**Authentication:** Required (teacher, admin, student - own profile only)

**Path Parameters:**
- `student_id` (uuid) - Student UUID

**Response (200 OK):**
```json
{
  "id": "uuid",
  "name": "Aarav Sharma",
  "student_id": "STU00001",
  "class_semester": "BCA-4",
  "email": "student@school.com",
  "enrollment_status": "active",
  "risk_score": {
    "overall_score": 82,
    "risk_level": "high",
    "attendance_factor": 25,
    "performance_factor": 25,
    "history_factor": 20,
    "assignment_factor": 10,
    "trend_factor": 2
  },
  "recent_assessments": [ ... ],
  "attendance_percentage": 64,
  "assignment_completion": 55,
  "created_at": "2026-10-04T12:00:00+00:00"
}
```

### Risk Analysis Endpoints

#### Get Dashboard Metrics

**Endpoint:** `GET /risk/dashboard`

**Description:** Get high-level risk metrics for dashboard.

**Authentication:** Required (teacher, admin)

**Response (200 OK):**
```json
{
  "total_students": 250,
  "high_risk_count": 40,
  "medium_risk_count": 120,
  "low_risk_count": 80,
  "improving_count": 10,
  "declining_count": 25,
  "active_interventions": 15,
  "average_risk_score": 52.3
}
```

#### Get Risk Scores

**Endpoint:** `GET /risk/scores`

**Description:** List risk scores with filtering.

**Authentication:** Required (teacher, admin)

**Query Parameters:**
- `page` (int, default: 1)
- `page_size` (int, default: 20)
- `risk_level` (str) - Filter: low, medium, high
- `class` (str) - Filter by class

**Response (200 OK):**
```json
{
  "items": [
    {
      "id": "uuid",
      "student_id": "uuid",
      "overall_score": 82,
      "risk_level": "high",
      "attendance_factor": 25,
      "performance_factor": 25,
      "history_factor": 20,
      "assignment_factor": 10,
      "trend_factor": 2,
      "created_at": "2026-10-04T12:00:00+00:00"
    }
  ],
  "total": 250,
  "page": 1,
  "page_size": 20,
  "total_pages": 13
}
```

#### Get Student Risk Details

**Endpoint:** `GET /risk/{student_id}`

**Description:** Get detailed risk analysis for a student.

**Authentication:** Required (teacher, admin)

**Response (200 OK):**
```json
{
  "student": { ... },
  "current_risk": {
    "overall_score": 82,
    "risk_level": "high",
    "factors": [
      {
        "name": "Attendance",
        "contribution": 25,
        "max_contribution": 25,
        "explanation": "Very low attendance (below 70%)"
      },
      {
        "name": "Current Performance",
        "contribution": 25,
        "max_contribution": 25,
        "explanation": "Failing performance (below 40%)"
      }
    ]
  },
  "risk_history": [ ... ],
  "recommendations": [ ... ]
}
```

#### Get Risk Radar Data

**Endpoint:** `GET /risk/radar/data`

**Description:** Get data for Risk Radar visualization.

**Authentication:** Required (teacher, admin)

**Query Parameters:**
- `class` (str) - Filter by class (optional)

**Response (200 OK):**
```json
[
  {
    "id": "uuid",
    "student_id": "uuid",
    "name": "Aarav Sharma",
    "attendance": 64,
    "performance": 42,
    "risk_level": "high",
    "risk_score": 82
  },
  ...
]
```

### Intervention Endpoints

#### Create Intervention

**Endpoint:** `POST /interventions`

**Description:** Create a new intervention for a student.

**Authentication:** Required (teacher, admin)

**Request Body:**
```json
{
  "student_id": "uuid",
  "problem": "Low attendance and declining marks",
  "intervention_type": "mentoring",
  "start_date": "2026-10-04",
  "follow_up_date": "2026-10-18",
  "notes": "Assigned Mathematics mentoring. Monitor for 2 weeks."
}
```

**Response (201 Created):**
```json
{
  "id": "uuid",
  "student_id": "uuid",
  "assigned_teacher_id": "uuid",
  "problem": "Low attendance and declining marks",
  "intervention_type": "mentoring",
  "start_date": "2026-10-04",
  "follow_up_date": "2026-10-18",
  "status": "planned",
  "notes": "Assigned Mathematics mentoring. Monitor for 2 weeks.",
  "created_at": "2026-10-04T12:00:00+00:00"
}
```

#### Get Interventions

**Endpoint:** `GET /interventions`

**Description:** List interventions with filtering.

**Authentication:** Required (teacher, admin)

**Query Parameters:**
- `page` (int, default: 1)
- `page_size` (int, default: 20)
- `status` (str) - Filter: planned, in_progress, completed, monitoring
- `student_id` (uuid) - Filter by student

**Response (200 OK):**
```json
{
  "items": [ ... ],
  "total": 50,
  "page": 1,
  "page_size": 20,
  "total_pages": 3
}
```

#### Update Intervention Status

**Endpoint:** `PUT /interventions/{intervention_id}`

**Description:** Update intervention status or details.

**Authentication:** Required (teacher, admin)

**Request Body:**
```json
{
  "status": "completed",
  "outcome": "Student attendance improved to 78%. Math marks increased from 42 to 61."
}
```

**Response (200 OK):**
```json
{
  "id": "uuid",
  "status": "completed",
  "outcome": "Student attendance improved to 78%...",
  "risk_score_before": 82,
  "risk_score_after": 57,
  "updated_at": "2026-10-18T12:00:00+00:00"
}
```

### Notification Endpoints

#### Get Notifications

**Endpoint:** `GET /notifications`

**Description:** Get user notifications.

**Authentication:** Required

**Query Parameters:**
- `page` (int, default: 1)
- `read` (bool) - Filter by read status
- `priority` (str) - Filter by priority: critical, high, medium, low

**Response (200 OK):**
```json
{
  "items": [
    {
      "id": "uuid",
      "student_id": "uuid",
      "type": "high_risk_alert",
      "message": "Aarav Sharma is now at HIGH RISK (82/100)",
      "priority": "critical",
      "read": false,
      "created_at": "2026-10-04T12:00:00+00:00"
    }
  ],
  "total": 15,
  "unread_count": 5
}
```

#### Mark Notification as Read

**Endpoint:** `POST /notifications/{notification_id}/read`

**Description:** Mark a notification as read.

**Authentication:** Required

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Notification marked as read"
}
```

---

## Response Formats

### Success Response

```json
{
  "success": true,
  "data": { ... },
  "message": "Operation successful"
}
```

### Error Response

```json
{
  "detail": "Error description"
}
```

Or for validation errors:

```json
{
  "detail": [
    {
      "loc": ["body", "email"],
      "msg": "Invalid email format",
      "type": "value_error.email"
    }
  ]
}
```

---

## Error Handling

### HTTP Status Codes

| Code | Meaning | Example |
|------|---------|---------|
| 200 | OK | Successful request |
| 201 | Created | Resource created |
| 400 | Bad Request | Invalid data |
| 401 | Unauthorized | Missing/invalid token |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource not found |
| 500 | Server Error | Unexpected error |

### Common Error Responses

#### 401 - Unauthorized

```json
{
  "detail": "Invalid or expired token"
}
```

#### 403 - Forbidden

```json
{
  "detail": "You don't have permission to access this resource"
}
```

#### 404 - Not Found

```json
{
  "detail": "Student not found"
}
```

#### 422 - Validation Error

```json
{
  "detail": [
    {
      "loc": ["body", "email"],
      "msg": "Invalid email address",
      "type": "value_error.email"
    }
  ]
}
```

---

## Examples

### Example 1: Login and Get Dashboard

```bash
# 1. Login
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "teacher@school.com",
    "password": "password123"
  }'

# Response: {"success": true, "data": {"access_token": "...", "user": {...}}}

# 2. Get dashboard metrics
curl -X GET http://localhost:8000/api/v1/risk/dashboard \
  -H "Authorization: Bearer {access_token}"

# Response: {"total_students": 250, "high_risk_count": 40, ...}
```

### Example 2: Get Student with Risk Analysis

```bash
curl -X GET http://localhost:8000/api/v1/students/{student_id} \
  -H "Authorization: Bearer {access_token}"

# Response includes current risk score, recent assessments, etc.
```

### Example 3: Create Intervention

```bash
curl -X POST http://localhost:8000/api/v1/interventions \
  -H "Authorization: Bearer {access_token}" \
  -H "Content-Type: application/json" \
  -d '{
    "student_id": "uuid",
    "problem": "Low attendance",
    "intervention_type": "attendance_monitoring",
    "start_date": "2026-10-04",
    "follow_up_date": "2026-10-18"
  }'

# Response: {"id": "uuid", "status": "planned", ...}
```

---

## Rate Limiting

Currently no rate limiting. Future versions may implement:
- 100 requests per minute per user
- 1000 requests per hour per API key

---

## Pagination

All list endpoints support pagination:

**Query Parameters:**
- `page` (default: 1) - Page number
- `page_size` (default: 20) - Items per page (max: 100)

**Response Include:**
```json
{
  "items": [...],
  "total": 250,
  "page": 1,
  "page_size": 20,
  "total_pages": 13
}
```

---

## Versioning

Current API version: **v1**

Future versions will be available at:
- `/api/v2` (when released)
- `/api/v3` (when released)

---

## Development

### Testing with cURL

```bash
# Set variables
TOKEN="your_access_token"
API_URL="http://localhost:8000/api/v1"

# Make request
curl -X GET $API_URL/students \
  -H "Authorization: Bearer $TOKEN"
```

### Testing with Postman

1. Import API documentation from `/docs` endpoint
2. Set `{{base_url}}` variable to `http://localhost:8000/api/v1`
3. Set `{{token}}` variable after login
4. Use `Authorization` header: `Bearer {{token}}`

### Interactive API Documentation

Visit: `http://localhost:8000/docs` for Swagger UI

---

## Document Version
- Version: 1.0
- Date: 2026-10-04
- Status: API v1 Complete
