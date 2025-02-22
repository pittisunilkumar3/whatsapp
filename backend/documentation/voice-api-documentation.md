# Voice API Documentation

## Table of Contents
1. [Voice Campaigns API](#voice-campaigns-api)
2. [Voice Leads API](#voice-leads-api)

## Authentication
All API endpoints require authentication. Include your API token in the Authorization header:
```
Authorization: Bearer YOUR_API_TOKEN
```

# Voice Campaigns API

## Endpoints

### 1. Create Voice Campaign
```http
POST /api/voice-campaigns
```

#### Request Body Schema
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| name | string | Yes | Campaign name (max 100 chars) |
| description | string | No | Detailed campaign description |
| status | enum | Yes | Campaign status: 'draft', 'active', 'paused', 'completed' |
| priority | enum | No | Campaign priority: 'low', 'medium', 'high' |
| campaign_type | string | No | Type of campaign (default: 'outbound') |
| calls_per_day | integer | Yes | Maximum number of calls per day |
| calling_hours_start | time | Yes | Start time for calls (format: HH:MM:SS) |
| calling_hours_end | time | Yes | End time for calls (format: HH:MM:SS) |
| time_zone | string | No | Campaign timezone (default: 'UTC') |
| working_days | array | No | Array of working days ['Monday',...,'Friday'] |
| ai_voice_id | string | No | ID of the AI voice to use |
| ai_voice_language | string | No | Voice language (default: 'en-US') |
| ai_voice_gender | string | No | Voice gender preference |
| system_prompt | string | Yes | AI system behavior instructions |
| script_template | string | Yes | Main call script template |
| fallback_script | string | No | Script for fallback scenarios |
| max_attempts_per_lead | integer | No | Max retry attempts per lead (default: 3) |
| retry_delay_minutes | integer | No | Delay between retries in minutes (default: 60) |
| call_duration_limit | integer | No | Maximum call duration in seconds |
| success_criteria | string | No | Criteria for successful calls |
| expected_completion_date | date | No | Expected campaign end date (YYYY-MM-DD) |
| budget | decimal | No | Total campaign budget |
| cost_per_call | decimal | No | Cost per call |
| owner_id | integer | No | Campaign owner's employee ID |
| team_members | array | No | Array of team member IDs |
| tags | array | No | Array of campaign tags |
| notes | string | No | Additional campaign notes |
| start_date | datetime | No | Campaign start date (YYYY-MM-DD HH:MM:SS) |
| end_date | datetime | No | Campaign end date (YYYY-MM-DD HH:MM:SS) |
| recurrence_rule | string | No | Campaign recurrence pattern |
| company_id | integer | Yes | ID of the company running the campaign |

#### Example Request Body
```json
{
    "name": "Customer Survey Campaign",
    "description": "Automated survey for customer satisfaction",
    "status": "draft",
    "priority": "high",
    "campaign_type": "outbound",
    "calls_per_day": 50,
    "calling_hours_start": "09:00:00",
    "calling_hours_end": "17:00:00",
    "time_zone": "UTC",
    "working_days": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    "ai_voice_id": "voice-123",
    "ai_voice_language": "en-US",
    "ai_voice_gender": "female",
    "system_prompt": "You are a friendly customer service representative conducting a satisfaction survey",
    "script_template": "Hello {customer_name}, this is {company_name} calling. We're conducting a brief customer satisfaction survey. Would you have 2 minutes to share your feedback?",
    "fallback_script": "I understand you're busy. Would you prefer if I called back at a more convenient time?",
    "max_attempts_per_lead": 3,
    "retry_delay_minutes": 60,
    "call_duration_limit": 300,
    "success_criteria": "Customer completes at least 80% of survey questions",
    "expected_completion_date": "2024-12-31",
    "budget": 1000.00,
    "cost_per_call": 0.50,
    "owner_id": 123,
    "team_members": [124, 125, 126],
    "tags": ["customer-survey", "satisfaction", "q4-2024"],
    "notes": "Focus on customer service experience and product satisfaction",
    "start_date": "2024-03-01 09:00:00",
    "end_date": "2024-12-31 17:00:00",
    "recurrence_rule": "FREQ=DAILY;INTERVAL=1",
    "company_id": 1
}
```

#### Response (201 Created)
```json
{
    "message": "Voice campaign created successfully",
    "data": {
        "id": 1,
        // ... all campaign data
    }
}
```

### 2. Get Campaign Details
```http
GET /api/voice-campaigns/{id}?company_id={companyId}
```

#### Parameters
- `id` (path parameter): Campaign ID
- `company_id` (query parameter): Company ID

#### Headers
```http
Authorization: Bearer <your_jwt_token>
```

#### Example Request
```http
GET /api/voice-campaigns/123?company_id=456
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### Response (200 OK)
```json
{
    "message": "Campaign fetched successfully",
    "data": {
        "id": "123",
        "name": "Customer Survey Campaign",
        "description": "Automated follow-up calls for Q1 sales leads",
        "status": "running",
        "voice_type": "female_natural",
        "script": "Hi {customer_name}, this is {agent_name}...",
        "working_days": ["monday", "tuesday", "wednesday"],
        "call_start_time": "09:00",
        "call_end_time": "18:00",
        "team_members": [1, 2, 3],
        "tags": ["sales", "follow-up"],
        "company_id": "456",
        "metrics": {
            "accuracy": 95,
            "clarity": 88,
            "engagement": 92,
            "adherenceToScript": 96,
            "sentimentScore": 7.8,
            "averageCallQuality": 92,
            "positiveResponseRate": 45,
            "negativeResponseRate": 15,
            "averageResponseTime": "8.5s",
            "commonKeywords": [
                { "word": "interested", "count": 145 },
                { "word": "pricing", "count": 98 },
                { "word": "features", "count": 76 },
                { "word": "consider", "count": 65 }
            ]
        }
    }
}
```

#### Error Responses

##### 400 Bad Request - Missing Company ID
```json
{
    "message": "Company ID is required"
}
```

##### 404 Not Found - Campaign Not Found
```json
{
    "message": "Voice campaign not found"
}
```

##### 401 Unauthorized - Invalid or Missing Token
```json
{
    "message": "Authentication required",
    "error": "No valid authentication token provided"
}
```

### 3. Get All Campaigns
```http
GET /api/voice-campaigns
```

#### Query Parameters
- `status`: Filter by status (draft, active, paused, completed)
- `priority`: Filter by priority (low, medium, high)
- `company_id`: Filter by company

#### Response (200 OK)
```json
[
    {
        "id": 1,
        "name": "Customer Survey Campaign",
        "status": "active",
        // ... other campaign fields
    }
]
```

### 4. Get Company Campaigns
```http
GET /api/voice-campaigns/company/{companyId}
```

#### Query Parameters
- `status`: Filter by status (draft, active, paused, completed)
- `priority`: Filter by priority (low, medium, high)
- `start_date`: Filter campaigns starting after this date (YYYY-MM-DD)
- `end_date`: Filter campaigns ending before this date (YYYY-MM-DD)
- `is_active`: Filter by active status (true/false)
- `search`: Search in campaign name and description
- `sort`: Sort field (created_at, name, status, priority)
- `order`: Sort order (asc, desc)
- `limit`: Number of records to return (default: 50)
- `offset`: Number of records to skip (default: 0)

#### Response (200 OK)
```json
{
    "total": 100,
    "offset": 0,
    "limit": 50,
    "data": [
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
            "max_attempts_per_lead": 3,
            "retry_delay_minutes": 60,
            "call_duration_limit": 300,
            "budget": 1000.00,
            "cost_per_call": 0.50,
            "owner_id": 123,
            "team_members": [124, 125, 126],
            "tags": ["customer-survey", "satisfaction", "q4-2024"],
            "start_date": "2024-03-01T09:00:00Z",
            "end_date": "2024-12-31T17:00:00Z",
            "created_at": "2024-02-19T10:00:00Z",
            "updated_at": "2024-02-19T10:00:00Z"
        }
    ]
}
```

### 5. Get Company Campaign Statistics
```http
GET /api/voice-campaigns/company/{companyId}/stats
```

#### Query Parameters
- `start_date`: Statistics from this date (YYYY-MM-DD)
- `end_date`: Statistics until this date (YYYY-MM-DD)
- `status`: Filter by campaign status

#### Response (200 OK)
```json
{
    "total_campaigns": 10,
    "active_campaigns": 5,
    "completed_campaigns": 3,
    "paused_campaigns": 2,
    "total_leads": 1000,
    "total_calls": 800,
    "successful_calls": 600,
    "failed_calls": 200,
    "average_success_rate": 75.00,
    "total_call_duration": 48000,
    "average_call_duration": 60,
    "total_cost": 400.00,
    "remaining_budget": 5600.00,
    "campaigns_by_priority": {
        "high": 3,
        "medium": 5,
        "low": 2
    },
    "calls_by_hour": {
        "09:00": 100,
        "10:00": 150,
        "11:00": 200,
        // ... hourly breakdown
    },
    "daily_stats": [
        {
            "date": "2024-03-01",
            "total_calls": 80,
            "successful_calls": 60,
            "failed_calls": 20,
            "success_rate": 75.00
        }
        // ... daily breakdown
    ]
}
```

### 6. Get Company Active Campaigns
```http
GET /api/voice-campaigns/company/{companyId}/active
```

#### Query Parameters
- `priority`: Filter by priority (low, medium, high)
- `limit`: Number of records to return (default: 50)
- `offset`: Number of records to skip (default: 0)

#### Response (200 OK)
```json
{
    "total": 5,
    "data": [
        {
            "id": 1,
            "name": "Customer Survey Campaign",
            "status": "active",
            "priority": "high",
            "total_leads": 100,
            "completed_calls": 50,
            "success_rate": 90.00,
            "today_calls": 25,
            "remaining_calls": 50
        }
    ]
}
```

### 7. Get Company Campaign Performance
```http
GET /api/voice-campaigns/company/{companyId}/performance
```

#### Query Parameters
- `start_date`: Start date for performance data (YYYY-MM-DD)
- `end_date`: End date for performance data (YYYY-MM-DD)
- `interval`: Data grouping interval (hourly, daily, weekly, monthly)

#### Response (200 OK)
```json
{
    "summary": {
        "total_campaigns": 10,
        "total_calls": 1000,
        "success_rate": 75.00,
        "average_call_duration": 180
    },
    "trends": {
        "calls_by_interval": [
            {
                "interval": "2024-03-01",
                "total_calls": 100,
                "successful_calls": 75,
                "failed_calls": 25,
                "average_duration": 185
            }
        ],
        "success_rate_trend": [
            {
                "interval": "2024-03-01",
                "rate": 75.00
            }
        ]
    },
    "campaign_rankings": [
        {
            "campaign_id": 1,
            "name": "Customer Survey Campaign",
            "success_rate": 85.00,
            "total_calls": 200
        }
    ]
}
```

### 8. Get Company Campaign Team Performance
```http
GET /api/voice-campaigns/company/{companyId}/team-performance
```

#### Query Parameters
- `start_date`: Start date (YYYY-MM-DD)
- `end_date`: End date (YYYY-MM-DD)

#### Response (200 OK)
```json
{
    "team_summary": {
        "total_team_members": 10,
        "active_members": 8,
        "total_calls_handled": 1000
    },
    "member_performance": [
        {
            "member_id": 123,
            "name": "John Smith",
            "campaigns_assigned": 3,
            "total_calls": 200,
            "successful_calls": 160,
            "success_rate": 80.00,
            "average_call_duration": 180,
            "total_talk_time": 36000
        }
    ],
    "campaign_distribution": [
        {
            "campaign_id": 1,
            "name": "Customer Survey Campaign",
            "team_members": 5,
            "calls_per_member": 40
        }
    ]
}
```

### 9. Get Company Campaign Cost Analysis
```http
GET /api/voice-campaigns/company/{companyId}/cost-analysis
```

#### Query Parameters
- `start_date`: Start date (YYYY-MM-DD)
- `end_date`: End date (YYYY-MM-DD)
- `campaign_ids`: Comma-separated list of campaign IDs

#### Response (200 OK)
```json
{
    "overall_costs": {
        "total_budget_allocated": 10000.00,
        "total_spent": 4000.00,
        "remaining_budget": 6000.00,
        "average_cost_per_call": 0.50,
        "average_cost_per_success": 0.75
    },
    "campaign_costs": [
        {
            "campaign_id": 1,
            "name": "Customer Survey Campaign",
            "budget": 1000.00,
            "spent": 400.00,
            "remaining": 600.00,
            "cost_per_call": 0.45,
            "cost_effectiveness_score": 85
        }
    ],
    "cost_trends": [
        {
            "date": "2024-03-01",
            "total_spent": 200.00,
            "calls_made": 400,
            "average_cost": 0.50
        }
    ],
    "roi_analysis": {
        "total_conversion_value": 20000.00,
        "total_cost": 4000.00,
        "roi_percentage": 400.00,
        "cost_to_conversion_ratio": 0.20
    }
}
```

### 10. Get Company Campaign Quality Metrics
```http
GET /api/voice-campaigns/company/{companyId}/quality-metrics
```

#### Query Parameters
- `start_date`: Start date (YYYY-MM-DD)
- `end_date`: End date (YYYY-MM-DD)
- `campaign_ids`: Comma-separated list of campaign IDs

#### Response (200 OK)
```json
{
    "overall_quality": {
        "average_call_score": 85,
        "compliance_rate": 98.50,
        "customer_satisfaction": 4.2,
        "call_clarity_score": 90
    },
    "campaign_quality": [
        {
            "campaign_id": 1,
            "name": "Customer Survey Campaign",
            "average_call_score": 87,
            "compliance_rate": 99.00,
            "quality_issues": [
                {
                    "issue_type": "script_deviation",
                    "occurrence_rate": 2.5,
                    "severity": "low"
                }
            ]
        }
    ],
    "quality_trends": [
        {
            "date": "2024-03-01",
            "average_score": 86,
            "total_issues": 5,
            "resolution_rate": 95.00
        }
    ],
    "compliance_metrics": {
        "script_adherence": 97.00,
        "regulatory_compliance": 100.00,
        "data_protection": 100.00,
        "call_time_compliance": 98.50
    }
}
```

### 11. Get Campaign by ID
```http
GET /api/voice-campaigns/{id}
```

#### Response (200 OK)
```json
{
    "id": 1,
    "name": "Customer Survey Campaign",
    // ... all campaign fields
}
```

### 12. Update Campaign
```http
PUT /api/voice-campaigns/{id}
```

#### Request Body
Same as create campaign

#### Response (200 OK)
```json
{
    "message": "Voice campaign updated successfully"
}
```

### 13. Delete Campaign
```http
DELETE /api/voice-campaigns/{id}
```

#### Response (200 OK)
```json
{
    "message": "Voice campaign deleted successfully"
}
```

### 14. Update Campaign Status
```http
PATCH /api/voice-campaigns/{id}/status
```

#### Request Body
```json
{
    "status": "active"
}
```

#### Response (200 OK)
```json
{
    "message": "Campaign status updated successfully"
}
```

### 15. Get Campaign Statistics
```http
GET /api/voice-campaigns/{id}/stats
```

#### Response (200 OK)
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

### Campaign Status Workflow

Voice campaigns go through a defined lifecycle with the following statuses:

1. **`draft`**: Initial state when a campaign is created but not yet started
   - Campaign is configured but not active
   - No calls are being made
   - Can be modified or deleted

2. **`active`**: Campaign is running and making calls
   - Calls are being processed according to campaign settings
   - Can pause or complete the campaign

3. **`paused`**: Campaign is temporarily stopped
   - Calls are suspended
   - Can resume or complete the campaign

4. **`completed`**: Campaign has reached its final state
   - No more calls will be made
   - Campaign is archived and can be reviewed

### 16. Start Campaign
```http
POST /api/voice-campaigns/{id}/start
```

#### Description
Starts a campaign from 'draft' status, moving it to 'active' status.

#### Response (200 OK)
```json
{
    "message": "Campaign started successfully",
    "data": {
        "id": 1,
        "name": "Customer Survey Campaign",
        "status": "active",
        // ... other campaign details
    }
}
```

### 17. Pause Campaign
```http
POST /api/voice-campaigns/{id}/pause
```

#### Description
Pauses an active campaign, moving it from 'active' to 'paused' status.

#### Response (200 OK)
```json
{
    "message": "Campaign paused successfully",
    "data": {
        "id": 1,
        "name": "Customer Survey Campaign",
        "status": "paused",
        // ... other campaign details
    }
}
```

### 18. Resume Campaign
```http
POST /api/voice-campaigns/{id}/resume
```

#### Description
Resumes a paused campaign, moving it back to 'active' status.

#### Response (200 OK)
```json
{
    "message": "Campaign resumed successfully",
    "data": {
        "id": 1,
        "name": "Customer Survey Campaign",
        "status": "active",
        // ... other campaign details
    }
}
```

### 19. Complete Campaign
```http
POST /api/voice-campaigns/{id}/complete
```

#### Description
Marks a campaign as completed, stopping all ongoing activities.
Can be called from 'active' or 'paused' status.

#### Response (200 OK)
```json
{
    "message": "Campaign completed successfully",
    "data": {
        "id": 1,
        "name": "Customer Survey Campaign",
        "status": "completed",
        // ... other campaign details
    }
}
```

# Voice Leads API

## Endpoints

### 1. Create Voice Lead
```http
POST /api/voice-leads
```

#### Request Body Schema
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| campaign_id | integer | Yes | ID of the associated campaign |
| first_name | string | Yes | Lead's first name |
| last_name | string | Yes | Lead's last name |
| phone | string | Yes | Primary phone number (E.164 format with '+' prefix, e.g., +1234567890) |
| alternate_phone | string | No | Secondary phone number |
| email | string | No | Email address |
| company_name | string | No | Lead's company name |
| job_title | string | No | Lead's job title |
| industry | string | No | Industry sector |
| status | enum | Yes | Lead status: 'pending', 'in_progress', 'completed', 'failed', 'scheduled', 'blacklisted' |
| priority | integer | No | Lead priority (1-5, 1 being highest) |
| best_time_to_call | time | No | Preferred call time (HH:MM:SS) |
| timezone | string | No | Lead's timezone (default: 'UTC') |
| preferred_language | string | No | Preferred communication language |
| country | string | No | Country of residence |
| state | string | No | State/Province |
| city | string | No | City |
| address | string | No | Street address |
| postal_code | string | No | Postal/ZIP code |
| source | string | No | Lead source |
| source_details | string | No | Additional source information |
| annual_revenue | decimal | No | Company's annual revenue |
| company_size | string | No | Company size range |
| lead_score | integer | No | Lead scoring (0-100) |
| interest_level | enum | No | Interest level: 'low', 'medium', 'high' |
| pain_points | array | No | Array of identified pain points |
| requirements | array | No | Array of specific requirements |
| custom_fields | object | No | Custom key-value pairs |
| assigned_to | integer | No | ID of assigned agent |
| notes | string | No | Additional notes |
| tags | array | No | Array of tags (will be stored in custom_fields) |
| last_contact_date | datetime | No | Last contact attempt date |
| next_contact_date | datetime | No | Next scheduled contact |
| company_id | integer | Yes | ID of the company owning the lead |

#### Example Request Body
```json
{
    "campaign_id": 1,
    "first_name": "John",
    "last_name": "Doe",
    "phone": "+1234567890",
    "alternate_phone": "+1987654321",
    "email": "john.doe@example.com",
    "company_name": "ABC Corp",
    "job_title": "Senior Manager",
    "industry": "Technology",
    "status": "pending",
    "priority": 1,
    "best_time_to_call": "14:00:00",
    "timezone": "America/New_York",
    "preferred_language": "en-US",
    "country": "United States",
    "state": "California",
    "city": "San Francisco",
    "address": "123 Main St, Suite 200",
    "postal_code": "94105",
    "source": "Website",
    "source_details": "Contact form submission - Enterprise Plan",
    "annual_revenue": 5000000.00,
    "company_size": "50-100",
    "lead_score": 85,
    "interest_level": "high",
    "pain_points": [
        "Current solution is too expensive",
        "Lacks automation features",
        "Poor customer support"
    ],
    "requirements": [
        "24/7 Support",
        "Cloud Hosting",
        "API Integration",
        "Custom Reporting"
    ],
    "custom_fields": {
        "referred_by": "Jane Smith",
        "product_interest": "Enterprise Plan",
        "budget_range": "$50k-100k",
        "decision_timeline": "Q2 2024"
    },
    "assigned_to": 123,
    "notes": "High-priority lead interested in full platform migration",
    "tags": ["enterprise", "high-value", "immediate-follow-up"],
    "last_contact_date": "2024-02-19T10:30:00Z",
    "next_contact_date": "2024-02-20T14:00:00Z",
    "company_id": 1
}
```

#### Response (201 Created)
```json
{
    "message": "Voice lead created successfully",
    "data": {
        "id": 1,
        // ... all lead data
    }
}
```

### 2. Get Company Leads
```http
GET /api/voice-leads/company/{companyId}
```

#### Query Parameters
- `campaign_id`: Filter by campaign
- `status`: Filter by status
- `assigned_to`: Filter by assigned agent

#### Response (200 OK)
```json
[
    {
        "id": 1,
        "first_name": "John",
        "last_name": "Doe",
        // ... other lead fields
    }
]
```

### 3. Get Company Lead Analytics
```http
GET /api/voice-leads/company/{companyId}/analytics
```

#### Query Parameters
- `start_date`: Start date (YYYY-MM-DD)
- `end_date`: End date (YYYY-MM-DD)
- `campaign_ids`: Comma-separated list of campaign IDs

#### Response (200 OK)
```json
{
    "lead_funnel": {
        "total_leads": 1000,
        "contacted": 800,
        "qualified": 400,
        "converted": 200,
        "conversion_rate": 25.00
    },
    "lead_sources": [
        {
            "source": "Website",
            "count": 500,
            "conversion_rate": 30.00,
            "average_lead_score": 75
        }
    ],
    "lead_scoring": {
        "average_score": 65,
        "score_distribution": {
            "high": 200,
            "medium": 500,
            "low": 300
        }
    },
    "conversion_timeline": [
        {
            "date": "2024-03-01",
            "new_leads": 50,
            "conversions": 15,
            "conversion_rate": 30.00
        }
    ]
}
```

### 4. Get Company Lead Quality Report
```http
GET /api/voice-leads/company/{companyId}/quality-report
```

#### Query Parameters
- `start_date`: Start date (YYYY-MM-DD)
- `end_date`: End date (YYYY-MM-DD)

#### Response (200 OK)
```json
{
    "overall_quality": {
        "average_lead_score": 75,
        "qualification_rate": 60.00,
        "conversion_potential": 40.00
    },
    "lead_quality_distribution": {
        "excellent": 200,
        "good": 500,
        "fair": 200,
        "poor": 100
    },
    "quality_by_source": [
        {
            "source": "Website",
            "average_score": 80,
            "conversion_rate": 35.00,
            "lead_count": 500
        }
    ],
    "improvement_suggestions": [
        {
            "category": "Data Completeness",
            "current_score": 85,
            "suggestion": "Improve email collection rate",
            "potential_impact": "15% increase in conversion"
        }
    ]
}
```

### 5. Get Company Lead Assignment Stats
```http
GET /api/voice-leads/company/{companyId}/assignment-stats
```

#### Query Parameters
- `start_date`: Start date (YYYY-MM-DD)
- `end_date`: End date (YYYY-MM-DD)

#### Response (200 OK)
```json
{
    "assignment_summary": {
        "total_leads": 1000,
        "assigned_leads": 900,
        "unassigned_leads": 100,
        "average_response_time": 120
    },
    "agent_performance": [
        {
            "agent_id": 123,
            "name": "John Smith",
            "assigned_leads": 100,
            "contacted_leads": 80,
            "converted_leads": 40,
            "average_response_time": 90,
            "conversion_rate": 50.00
        }
    ],
    "assignment_distribution": {
        "by_priority": {
            "high": 300,
            "medium": 500,
            "low": 200
        },
        "by_status": {
            "pending": 200,
            "in_progress": 400,
            "completed": 300,
            "failed": 100
        }
    }
}
```

### 6. Get Company Lead Conversion Analysis
```http
GET /api/voice-leads/company/{companyId}/conversion-analysis
```

#### Query Parameters
- `start_date`: Start date (YYYY-MM-DD)
- `end_date`: End date (YYYY-MM-DD)
- `campaign_ids`: Comma-separated list of campaign IDs

#### Response (200 OK)
```json
{
    "conversion_summary": {
        "total_leads": 1000,
        "total_conversions": 200,
        "conversion_rate": 20.00,
        "average_conversion_value": 5000.00,
        "total_revenue": 1000000.00
    },
    "conversion_by_campaign": [
        {
            "campaign_id": 1,
            "name": "Customer Survey Campaign",
            "leads": 200,
            "conversions": 50,
            "conversion_rate": 25.00,
            "revenue": 250000.00
        }
    ],
    "conversion_factors": [
        {
            "factor": "Response Time",
            "impact_score": 85,
            "correlation": "high",
            "recommendation": "Maintain response time under 2 hours"
        }
    ],
    "timeline_analysis": [
        {
            "date": "2024-03-01",
            "new_leads": 50,
            "conversions": 15,
            "revenue": 75000.00,
            "conversion_rate": 30.00
        }
    ]
}
```

### 7. Get Campaign Leads
```http
GET /api/voice-leads/campaign/{campaignId}
```

#### Query Parameters
- `status`: Filter by status
- `priority`: Filter by priority

#### Response (200 OK)
```json
[
    {
        "id": 1,
        "first_name": "John",
        "last_name": "Doe",
        // ... other lead fields
    }
]
```

### 8. Get Lead by ID
```http
GET /api/voice-leads/{id}
```

#### Response (200 OK)
```json
{
    "id": 1,
    "first_name": "John",
    "last_name": "Doe",
    // ... all lead fields
}
```

### 9. Update Lead
```http
PUT /api/voice-leads/{id}
```

#### Request Body
Same as create lead

#### Response (200 OK)
```json
{
    "message": "Voice lead updated successfully"
}
```

### 10. Delete Lead
```http
DELETE /api/voice-leads/{id}
```

#### Response (200 OK)
```json
{
    "message": "Voice lead deleted successfully"
}
```

### 11. Update Lead Status
```http
PATCH /api/voice-leads/{id}/status
```

#### Request Body
```json
{
    "status": "in_progress",
    "sub_status": "attempting_contact"
}
```

#### Response (200 OK)
```json
{
    "message": "Lead status updated successfully"
}
```

### 12. Assign Lead
```http
PATCH /api/voice-leads/{id}/assign
```

#### Request Body
```json
{
    "assigned_to": 123
}
```

#### Response (200 OK)
```json
{
    "message": "Lead assigned successfully"
}
```

### 13. Schedule Call
```http
PATCH /api/voice-leads/{id}/schedule
```

#### Request Body
```json
{
    "scheduled_call_time": "2024-02-20T14:00:00Z"
}
```

#### Response (200 OK)
```json
{
    "message": "Call scheduled successfully"
}
```

### 14. Record Call Attempt
```http
POST /api/voice-leads/{id}/call-attempt
```

#### Request Body
```json
{
    "duration": 180,
    "notes": "Customer was busy, requested callback",
    "disposition": "callback_requested",
    "status": "scheduled"
}
```

#### Response (200 OK)
```json
{
    "message": "Call attempt recorded successfully"
}
```

### 15. Mark Lead as Converted
```http
PATCH /api/voice-leads/{id}/convert
```

#### Request Body
```json
{
    "value": 1000.00
}
```

#### Response (200 OK)
```json
{
    "message": "Lead marked as converted successfully"
}
```

### 16. Get Campaign Lead Statistics
```http
GET /api/voice-leads/campaign/{campaignId}/stats
```

#### Response (200 OK)
```json
{
    "total_leads": 100,
    "completed_leads": 50,
    "failed_leads": 10,
    "converted_leads": 40,
    "average_lead_score": 75.5,
    "total_conversion_value": 40000.00,
    "average_call_duration": 180
}
```

### 17. Bulk Update Company Leads
```http
PATCH /api/company/voice-leads/company/{companyId}/bulk-update
```

#### Request Body
```json
{
    "lead_ids": [1, 2, 3],
    "updates": {
        "status": "in_progress",
        "priority": 2,
        "assigned_to": 123,
        "notes": "Bulk update notes"
    }
}
```

#### Response (200 OK)
```json
{
    "message": "Leads updated successfully",
    "updated_count": 3
}
```

### 18. Bulk Assign Company Leads
```http
PATCH /api/company/voice-leads/company/{companyId}/bulk-assign
```

#### Request Body
```json
{
    "lead_ids": [1, 2, 3],
    "assigned_to": 123
}
```

#### Response (200 OK)
```json
{
    "message": "Leads assigned successfully",
    "assigned_count": 3
}
```

### 19. Import Company Leads from File
```http
POST /api/company/voice-leads/company/{companyId}/import
Content-Type: multipart/form-data
```

#### Request Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| file | File | Yes | CSV or Excel file containing lead data |
| campaign_id | integer | Yes | ID of the campaign to associate leads with |
| default_values | JSON object | No | Default values to apply to all imported leads |

#### File Format Requirements
- Supported formats: CSV (.csv) or Excel (.xlsx, .xls)
- Maximum file size: 10MB
- First row must contain column headers
- Required column: `phone`
- Optional columns:
  - first_name
  - last_name
  - email
  - company_name
  - job_title
  - industry
  - priority
  - best_time_to_call
  - timezone
  - preferred_language
  - country
  - state
  - city
  - address
  - postal_code
  - source
  - source_details
  - annual_revenue
  - company_size
  - lead_score
  - interest_level
  - notes
  - tags

#### Phone Number Format
Phone numbers in the file will be automatically formatted to E.164 format:
- Numbers without country code (10 digits) will be assumed to be US/Canada (+1)
- Numbers with country code but no '+' will have '+' added
- Numbers already in E.164 format will be kept as is
- Invalid phone numbers will cause an error

#### Example CSV Format
```csv
first_name,last_name,phone,email,company_name,job_title
John,Doe,+1234567890,john@example.com,ABC Corp,Manager
Jane,Smith,1234567890,jane@example.com,XYZ Inc,Director
```

#### Example Excel Format
The Excel file should follow the same column structure as the CSV format.

#### Example Request using curl
```bash
curl -X POST \
  -H "Authorization: Bearer YOUR_API_TOKEN" \
  -F "file=@leads.csv" \
  -F "campaign_id=123" \
  -F "default_values={\"status\":\"pending\",\"source\":\"bulk_import\"}" \
  https://api.example.com/api/company/voice-leads/company/456/import
```

#### Success Response (201 Created)
```json
{
    "message": "Leads imported successfully",
    "imported_count": 2,
    "leads": [
        {
            "id": 1,
            "first_name": "John",
            "last_name": "Doe",
            "phone": "+1234567890",
            "email": "john@example.com",
            "company_name": "ABC Corp",
            "job_title": "Manager",
            "status": "pending",
            "source": "bulk_import",
            "campaign_id": 123,
            "company_id": 456,
            "created_at": "2024-03-20T10:00:00Z",
            "updated_at": "2024-03-20T10:00:00Z"
        },
        {
            "id": 2,
            "first_name": "Jane",
            "last_name": "Smith",
            "phone": "+11234567890",
            "email": "jane@example.com",
            "company_name": "XYZ Inc",
            "job_title": "Director",
            "status": "pending",
            "source": "bulk_import",
            "campaign_id": 123,
            "company_id": 456,
            "created_at": "2024-03-20T10:00:00Z",
            "updated_at": "2024-03-20T10:00:00Z"
        }
    ]
}
```

#### Error Responses

##### 400 Bad Request
```json
{
    "message": "Error importing leads",
    "error": "Detailed error message"
}
```

Possible error messages:
- "No file uploaded"
- "Invalid file type. Only CSV and Excel files are allowed."
- "File size exceeds 10MB limit"
- "campaign_id is required"
- "No valid leads found in the file"
- "Invalid phone number format: {phone}"
- "Missing required fields: phone"
- "Invalid email format"
- "Lead score must be between 0 and 100"
- "Invalid status value"
- "Invalid interest level"
- "Invalid campaign_id or campaign does not belong to company"

##### 500 Internal Server Error
```json
{
    "message": "Error importing leads",
    "error": "Internal server error message"
}
```

#### Notes
1. The file will be automatically deleted after processing, regardless of success or failure
2. All leads are validated before import
3. The import process uses a database transaction to ensure data consistency
4. If any lead fails validation, the entire import will be rolled back
5. Default values can be used to set common fields for all imported leads
6. Phone numbers are automatically formatted to E.164 format
7. The import process is atomic - either all leads are imported or none
8. All text fields are automatically trimmed
9. Timezone defaults to UTC if not specified
10. The API supports bulk imports of up to 1000 leads per request

### 20. Import Company Leads from JSON
```http
POST /api/company/voice-leads/company/{companyId}/import-json
Content-Type: application/json
```

#### Request Body Schema
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| campaign_id | integer | Yes | ID of the campaign to associate leads with |
| leads | array | Yes | Array of lead objects |
| default_values | object | No | Default values to apply to all imported leads |

#### Lead Object Schema
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| phone | string | Yes | Phone number (must be in E.164 format with '+' prefix, e.g., +1234567890) |
| first_name | string | No | Lead's first name |
| last_name | string | No | Lead's last name |
| email | string | No | Email address |
| company_name | string | No | Company name |
| job_title | string | No | Job title |
| industry | string | No | Industry sector |
| priority | integer | No | Lead priority (1-5) |
| best_time_to_call | string | No | Preferred call time (HH:MM:SS) |
| timezone | string | No | Lead's timezone |
| preferred_language | string | No | Preferred language (default: 'en-US') |
| country | string | No | Country |
| state | string | No | State/Province |
| city | string | No | City |
| address | string | No | Street address |
| postal_code | string | No | Postal/ZIP code |
| source | string | No | Lead source |
| source_details | string | No | Additional source information |
| annual_revenue | number | No | Company's annual revenue |
| company_size | string | No | Company size range |
| lead_score | integer | No | Lead scoring (0-100) |
| interest_level | enum | No | Interest level (must be one of: 'low', 'medium', 'high') |
| notes | string | No | Additional notes |
| tags | array | No | Array of tags (will be stored in custom_fields) |

#### Example Request Body
```json
{
    "campaign_id": 123,
    "leads": [
        {
            "first_name": "John",
            "last_name": "Doe",
            "phone": "+1234567890",
            "email": "john@example.com",
            "company_name": "ABC Corp",
            "job_title": "Manager",
            "industry": "Technology",
            "priority": 1,
            "lead_score": 85,
            "interest_level": "high",
            "tags": ["enterprise", "high-value"]
        },
        {
            "first_name": "Jane",
            "last_name": "Smith",
            "phone": "1234567890",
            "email": "jane@example.com",
            "company_name": "XYZ Inc",
            "job_title": "Director",
            "industry": "Healthcare",
            "priority": 2,
            "lead_score": 75,
            "interest_level": "medium",
            "tags": ["healthcare", "mid-market"]
        }
    ],
    "default_values": {
        "status": "pending",
        "source": "api_import",
        "timezone": "UTC"
    }
}
```

#### Example Request using curl
```bash
curl -X POST \
  -H "Authorization: Bearer YOUR_API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "campaign_id": 123,
    "leads": [
      {
        "first_name": "John",
        "last_name": "Doe",
        "phone": "+1234567890",
        "email": "john@example.com"
      }
    ],
    "default_values": {
      "status": "pending",
      "source": "api_import"
    }
  }' \
  https://api.example.com/api/company/voice-leads/company/456/import-json
```

#### Success Response (201 Created)
```json
{
    "message": "Leads imported successfully",
    "imported_count": 2,
    "leads": [
        {
            "id": 1,
            "first_name": "John",
            "last_name": "Doe",
            "phone": "+1234567890",
            "email": "john@example.com",
            "company_name": "ABC Corp",
            "job_title": "Manager",
            "status": "pending",
            "source": "api_import",
            "campaign_id": 123,
            "company_id": 456,
            "custom_fields": {
                "tags": ["enterprise", "high-value"]
            },
            "created_at": "2024-03-20T10:00:00Z",
            "updated_at": "2024-03-20T10:00:00Z"
        },
        {
            "id": 2,
            "first_name": "Jane",
            "last_name": "Smith",
            "phone": "+11234567890",
            "email": "jane@example.com",
            "company_name": "XYZ Inc",
            "job_title": "Director",
            "status": "pending",
            "source": "api_import",
            "campaign_id": 123,
            "company_id": 456,
            "custom_fields": {
                "tags": ["healthcare", "mid-market"]
            },
            "created_at": "2024-03-20T10:00:00Z",
            "updated_at": "2024-03-20T10:00:00Z"
        }
    ]
}
```

#### Error Responses

##### 400 Bad Request
```json
{
    "message": "Error importing leads",
    "error": "Detailed error message"
}
```

Possible error messages:
- "campaign_id is required"
- "leads must be a non-empty array"
- "Invalid phone number format: {phone}"
- "Missing required fields: phone"
- "Invalid email format"
- "Lead score must be between 0 and 100"
- "Invalid status value"
- "Invalid interest level"
- "Invalid campaign_id or campaign does not belong to company"

##### 500 Internal Server Error
```json
{
    "message": "Error importing leads",
    "error": "Internal server error message"
}
```

#### Notes
1. All leads are validated before import
2. The import process uses a database transaction to ensure data consistency
3. If any lead fails validation, the entire import will be rolled back
4. Default values can be used to set common fields for all imported leads
5. Phone numbers are automatically formatted to E.164 format
6. The import process is atomic - either all leads are imported or none
7. Maximum request size is determined by your server configuration
8. All text fields are automatically trimmed
9. Timezone defaults to UTC if not specified
10. The API supports bulk imports of up to 1000 leads per request

### 21. Export Company Leads
```http
GET /api/company/voice-leads/company/{companyId}/export
```

#### Query Parameters
- `format`: Export format ('csv' or 'xlsx', default: 'csv')
- `campaign_ids`: Comma-separated list of campaign IDs to filter
- `status`: Filter by lead status
- `start_date`: Filter leads created after this date (YYYY-MM-DD)
- `end_date`: Filter leads created before this date (YYYY-MM-DD)

#### Response
- For CSV format: Returns a CSV file with lead data
- For XLSX format: Returns an Excel file with lead data

Headers will be set appropriately:
- For CSV: `Content-Type: text/csv`
- For XLSX: `Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`

## Error Responses

### 400 Bad Request
```json
{
    "message": "Error message",
    "error": "Detailed error description"
}
```

### 404 Not Found
```json
{
    "message": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
    "message": "Error message",
    "error": "Detailed error description"
}
```

## Data Types

### Campaign Status
- `draft`: Initial state for new campaigns
- `active`: Campaign is currently running
- `paused`: Campaign is temporarily stopped
- `completed`: Campaign has finished

### Lead Status
- `pending`: Initial state
- `in_progress`: Currently being worked on
- `completed`: Successfully completed
- `failed`: Failed to reach/convert
- `scheduled`: Scheduled for future contact
- `blacklisted`: Do not contact

### Priority Levels
- `low`
- `medium`
- `high`

### Interest Levels
- `low`
- `medium`
- `high`

## Best Practices
1. Always start campaigns in `draft` status for testing
2. Set appropriate `retry_delay_minutes` to avoid overwhelming leads
3. Configure `working_days` and calling hours according to local regulations
4. Monitor campaign statistics regularly
5. Set realistic `calls_per_day` limits
6. Properly handle lead status transitions
7. Record detailed call notes and dispositions
8. Use appropriate lead scoring
9. Respect do-not-call preferences 