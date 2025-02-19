# Voice Campaigns API Documentation

## Overview
The Voice Campaigns API provides endpoints to manage automated voice calling campaigns. It allows you to create, update, and monitor voice campaigns with various parameters such as scheduling, voice settings, and call scripts.

## Base URL
```
/api/voice-campaigns
```

## Authentication
All API endpoints require authentication. Include your API token in the Authorization header:
```
Authorization: Bearer YOUR_API_TOKEN
```

## Endpoints

### 1. List Voice Campaigns
```http
GET /api/voice-campaigns
```

Returns a list of all voice campaigns, ordered by creation date (newest first).

#### Response
```json
[
  {
    "id": 1,
    "name": "Customer Survey Campaign",
    "status": "active",
    "total_leads": 100,
    "completed_calls": 50,
    // ... other campaign properties
  }
]
```

### 2. Get Single Campaign
```http
GET /api/voice-campaigns/{id}
```

Returns detailed information about a specific voice campaign.

#### Response
```json
{
  "id": 1,
  "name": "Customer Survey Campaign",
  "description": "Automated survey for customer satisfaction",
  "status": "active",
  "priority": "high",
  "campaign_type": "outbound",
  "calls_per_day": 50,
  "total_leads": 100,
  "completed_calls": 50,
  "successful_calls": 45,
  "failed_calls": 5,
  "calling_hours_start": "09:00:00",
  "calling_hours_end": "17:00:00",
  "time_zone": "UTC",
  "working_days": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
  "ai_voice_id": "voice-123",
  "ai_voice_language": "en-US",
  "ai_voice_gender": "female",
  "system_prompt": "You are a friendly customer service representative",
  "script_template": "Hello {customer_name}, this is a survey call...",
  "max_attempts_per_lead": 3,
  "retry_delay_minutes": 60,
  "created_at": "2024-02-19T10:00:00Z",
  "updated_at": "2024-02-19T10:00:00Z"
}
```

### 3. Create Campaign
```http
POST /api/voice-campaigns
```

Creates a new voice campaign.

#### Request Body
```json
{
  "name": "Customer Survey Campaign",
  "description": "Automated survey for customer satisfaction",
  "status": "draft",
  "priority": "high",
  "calls_per_day": 50,
  "calling_hours_start": "09:00:00",
  "calling_hours_end": "17:00:00",
  "system_prompt": "You are a friendly customer service representative",
  "script_template": "Hello {customer_name}, this is a survey call..."
  // ... other optional properties
}
```

#### Required Fields
- `name`
- `status`
- `calls_per_day`
- `calling_hours_start`
- `calling_hours_end`
- `system_prompt`
- `script_template`

### 4. Update Campaign
```http
PUT /api/voice-campaigns/{id}
```

Updates an existing voice campaign.

#### Request Body
Same as create campaign, with fields you want to update.

### 5. Delete Campaign
```http
DELETE /api/voice-campaigns/{id}
```

Deletes a voice campaign.

### 6. Update Campaign Status
```http
PATCH /api/voice-campaigns/{id}/status
```

Updates only the status of a campaign.

#### Request Body
```json
{
  "status": "active"
}
```

Valid status values:
- `draft`
- `active`
- `paused`
- `completed`

### 7. Get Campaign Statistics
```http
GET /api/voice-campaigns/{id}/stats
```

Returns statistical information about a campaign.

#### Response
```json
{
  "total_leads": 100,
  "completed_calls": 50,
  "successful_calls": 45,
  "failed_calls": 5,
  "cost_per_call": 0.50,
  "budget": 1000.00,
  "success_rate": "90.00",
  "total_cost": 25.00,
  "remaining_budget": 975.00
}
```

## Error Responses

### 400 Bad Request
```json
{
  "error": "Invalid request parameters"
}
```

### 404 Not Found
```json
{
  "error": "Voice campaign not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Failed to fetch voice campaigns"
}
```

## Data Types

### Campaign Status
- `draft`: Initial state for new campaigns
- `active`: Campaign is currently running
- `paused`: Campaign is temporarily stopped
- `completed`: Campaign has finished

### Priority Levels
- `low`
- `medium`
- `high`

### Time Format
- Time values should be in 24-hour format (HH:MM:SS)
- Dates should be in ISO 8601 format

## Rate Limits
- 1000 requests per hour per API token
- Rate limit headers are included in all responses

## Best Practices
1. Always start campaigns in `draft` status for testing
2. Set appropriate `retry_delay_minutes` to avoid overwhelming leads
3. Configure `working_days` and calling hours according to local regulations
4. Monitor campaign statistics regularly
5. Set realistic `calls_per_day` limits based on your infrastructure

## Webhook Integration
Campaigns can trigger webhooks for important events. Configure webhook URLs in your campaign settings for:
- Call completed
- Campaign status change
- Budget threshold reached
- Error notifications 