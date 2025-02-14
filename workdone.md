# WhatsApp CRM Project Documentation

## Project Overview
A comprehensive CRM system with WhatsApp integration, featuring multi-portal access (Super Admin, Company Admin, and Employee) for managing customer relationships, communications, and business operations.

## Project Setup & Configuration

### Environment Requirements
1. Frontend Requirements
   - Node.js (v16+)
   - npm/pnpm
   - TypeScript
   - Vite
   - React

2. Backend Requirements
   - Node.js (v16+)
   - MySQL
   - Redis (optional)
   - TypeScript
   - Express

3. Development Tools
   - Git
   - VS Code
   - Postman/Insomnia
   - MySQL Workbench
   - Docker (optional)

### Configuration Files
1. Frontend Configuration
   - .env
     - API base URL
     - WebSocket URL
     - Environment mode
   - vite.config.ts
   - tsconfig.json
   - package.json

2. Backend Configuration
   - .env
     - Database credentials
     - JWT secrets
     - API keys
     - Service URLs
   - package.json
   - tsconfig.json

3. Database Configuration
   - Migration files
   - Seed data
   - Connection config
   - Backup settings
   - Indexing setup

### Setup Instructions
1. Installation Steps
   ```bash
   # Frontend Setup
   cd frontend
   pnpm install
   pnpm dev

   # Backend Setup
   cd backend
   npm install
   npm run migrate
   npm run dev
   ```

2. Configuration Steps
   - Environment setup
   - Database creation
   - Migration execution
   - Service configuration
   - API key setup

## Portal Features

### Super Admin Portal

#### Completed Features
1. User Management
   - Super admin authentication and authorization
   - Role and permission management system
   - Company creation and configuration
   - Staff account management
   - Permission category management
   - Permission group management

2. System Configuration
   - Dynamic sidebar menu configuration
   - Email system configuration
   - System-wide settings management
   - Sidebar menu and submenu management
   - Role permissions configuration

3. Company Management
   - Company profile creation and management
   - Company employee role configuration
   - Company-specific permissions setup
   - Company employee management
   - Department and role structuring

4. Documentation & Monitoring
   - API documentation management
   - Permission documentation
   - Role permissions documentation
   - System health monitoring
   - Activity logging

#### Pending Features
1. Analytics Dashboard
   - Real-time system monitoring
   - Subscription tracking
   - Company performance analytics
   - Usage statistics
   - Revenue tracking

2. Advanced Settings
   - Global template management
   - System backup configuration
   - Maintenance scheduling
   - Security policy management

### Company Admin Portal

#### Completed Features
1. Company Management
   - Employee onboarding and management
   - Role and permission assignments
   - Department structure management
   - Employee activity monitoring
   - Company profile management

2. Communication Setup
   - Email configuration and templates
   - WhatsApp business integration
   - Message template management
   - Communication channel setup
   - Automated response configuration

3. Access Control
   - Role-based access management
   - Permission level configuration
   - User activity tracking
   - Security policy enforcement
   - Access log monitoring

#### Pending Features
1. Campaign Management
   - Multi-channel campaign creation
   - Template design and management
   - Campaign scheduling
   - Target audience segmentation
   - Performance analytics
   - A/B testing capabilities

2. Analytics & Reporting
   - Real-time performance metrics
   - Employee productivity tracking
   - Communication analytics
   - ROI measurement
   - Custom report generation

### Employee Portal

#### Completed Features
1. Communication Tools
   - Smart inbox implementation
   - Template-based messaging
   - Basic message management
   - Contact management
   - Message scheduling

2. Profile Management
   - Personal information management
   - Settings customization
   - Activity history tracking
   - Performance metrics view
   - Task management

#### Pending Features
1. Advanced Communication
   - Voice call system integration
   - Campaign execution tools
   - Automated response management
   - Multi-channel communication
   - Message analytics

2. Performance & Analytics
   - Personal performance dashboard
   - Task completion tracking
   - Success rate metrics
   - Goal tracking
   - Performance reports

## Technical Implementation

### Frontend Architecture
1. Core Components
   - Responsive UI components
   - Form validation system
   - Error handling
   - Loading states
   - Toast notifications

2. State Management
   - Authentication store
   - User preferences
   - Application state
   - Real-time updates

3. API Integration
   - REST API clients
   - WebSocket integration
   - Error handling
   - Request/response interceptors

### Backend Architecture

#### API Structure

## API & WebSocket Services

### API Implementation
1. Core Services
   - Authentication service
     - Super admin login
     - Company login
     - Employee login
     - Token management
     - Session handling

   - Profile Management
     - Super admin profile
     - Company profile
     - Employee profile
     - Profile updates
     - Data validation

2. API Configuration
   - Axios instance setup
   - Base URL configuration
   - Request interceptors
     - Token injection
     - Headers setup
   - Response interceptors
     - Error handling
     - Token expiration
     - Authentication redirect

3. Type Definitions
   - Response interfaces
     - Login responses
     - Profile data
     - Company data
     - Employee data
   - Request payloads
     - Login data
     - Profile updates
     - Configuration data

### WebSocket Implementation
1. Real-time Features
   - Connection management
   - Event handling
   - Message processing
   - Error handling
   - Reconnection logic

2. WebSocket Events
   - Message events
   - Status updates
   - Notification events
   - System events
   - Error events

3. Data Synchronization
   - Real-time updates
   - State management
   - Cache invalidation
   - Error recovery
   - Connection status

## WebSocket Implementation Details

### Connection Management
1. WebSocket Service
   - Connection initialization
   - Automatic reconnection
     - Retry attempts (max 5)
     - Exponential backoff
     - Connection state tracking
   - Clean disconnection
   - Event handling

2. Message Handling
   - Type-based subscription
   - Message routing
   - Handler management
     - Handler registration
     - Handler removal
   - Message parsing
   - Error handling

3. Real-time Features
   - Event subscription
   - Message broadcasting
   - Connection status
   - Reconnection logic
   - State synchronization

### WebSocket Events
1. System Events
   - Connection open
   - Connection close
   - Message received
   - Error occurred
   - Reconnection attempt

2. Message Types
   - Chat messages
   - Status updates
   - Notifications
   - System alerts
   - Error messages

3. Event Handlers
   - Message handlers
   - Connection handlers
   - Error handlers
   - Status handlers
   - Cleanup handlers

### Implementation Features
1. Configuration
   - WebSocket URL
   - Reconnection settings
   - Message types
   - Handler maps
   - Connection state

2. Error Handling
   - Connection errors
   - Message errors
   - Parse errors
   - State errors
   - Recovery logic

## State Management & Data Flow

### Application State
1. Authentication State
   - User credentials
   - Access tokens
   - Permissions
   - Session management
   - User preferences

2. Application Data
   - User data
   - Company data
   - Communication data
   - Campaign data
   - Analytics data

3. UI State
   - Loading states
   - Error states
   - Form states
   - Navigation state
   - Modal states

### Data Flow Architecture
1. API Integration
   - REST endpoints
   - WebSocket connections
   - Real-time updates
   - Error handling
   - Data caching

2. State Updates
   - Action dispatching
   - State mutations
   - Side effects
   - Error handling
   - State persistence

3. Data Synchronization
   - Real-time sync
   - Offline support
   - Data validation
   - Conflict resolution
   - Cache management

### Performance Optimization
1. State Management
   - Selective updates
   - Memoization
   - State normalization
   - Cache strategies
   - Batch updates

2. Data Loading
   - Lazy loading
   - Prefetching
   - Pagination
   - Infinite scroll
   - Data caching

## Navigation & Menu Management

### Sidebar Implementation
1. Menu Structure
   - Main menu items
     - Icon
     - Menu title
     - Language key
     - Activation status
     - Permission level
   - Submenu items
     - Menu title
     - URL path
     - Access permissions
     - Activation status

2. Portal-specific Menus
   - Super Admin Sidebar
     - Combined menu structure
     - Permission groups
     - System level access
     - Activation control
     - Submenu management

   - Company Sidebar
     - Company-specific menus
     - Role-based access
     - URL management
     - Language support
     - Access control

3. Menu Configuration
   - Permission management
     - Access permissions
     - Group permissions
     - Role-based display
     - Active status
   - Menu customization
     - Icon selection
     - Language keys
     - URL paths
     - Display levels

### Navigation Features
1. Access Control
   - Permission checking
   - Role validation
   - System level access
   - Active status
   - URL restrictions

2. Menu Management
   - Dynamic loading
   - State management
   - Error handling
   - Cache management
   - Update handling

## Page Structure & Routing

### Portal Pages
1. Super Admin Portal
   - Dashboard: System overview
   - Companies: Company management
   - Role Permissions: Access control
   - Permissions: Permission management
   - Email Integration: Email setup
   - Audit Logs: System monitoring
   - Profile: Admin profile
   - Billing: Payment management

2. Company Admin Portal
   - Dashboard: Company overview
   - Employees: Staff management
   - Employee Permissions: Access control
   - Communication
     - Email: Email management
     - WhatsApp: WhatsApp setup
   - Conversation Scoring: Quality metrics
   - Prompt Settings: AI configuration
   - Integrations: Service setup

3. Employee Portal
   - Dashboard: Activity overview
   - Communication Hub: Message center
   - Analytics: Performance metrics
   - Profile: Personal settings

### Communication Pages
1. Channel Management
   - WhatsApp: WhatsApp messaging
   - SMS: Text messaging
   - Email: Email communication
   - Voice: Voice calls

2. Campaign Pages
   - Campaign Creation
   - Template Management
   - Performance Tracking
   - Analytics Dashboard

3. Lead Management
   - Lead Dashboard
   - Contact Management
   - Follow-up Tracking
   - Performance Metrics

#### API Structure
1. Super Admin APIs
   - Company CRUD operations
   - System configuration
   - Role management
   - Permission control
   - User management

2. Company Admin APIs
   - Employee management
   - Communication settings
   - Template management
   - Campaign management
   - Analytics endpoints

3. Employee APIs
   - Communication endpoints
   - Profile management
   - Campaign execution
   - Analytics access

## API Documentation

### Authentication APIs
1. Super Admin Authentication
   - POST /api/superadmin/login
   - POST /api/superadmin/logout
   - PUT /api/superadmin/profile
   - GET /api/superadmin/profile

2. Company Authentication
   - POST /api/companies/login
   - POST /api/companies/logout
   - PUT /api/companies/profile
   - GET /api/companies/profile

3. Employee Authentication
   - POST /api/company-employees/login
   - POST /api/company-employees/logout
   - PUT /api/company-employees/profile
   - GET /api/company-employees/profile

### Management APIs
1. Role Management
   - GET /api/roles
   - POST /api/roles
   - PUT /api/roles/:id
   - DELETE /api/roles/:id
   - GET /api/role-permissions

2. Permission Management
   - GET /api/permissions
   - POST /api/permissions
   - GET /api/permission-groups
   - GET /api/permission-categories
   - POST /api/role-permissions

3. Company Management
   - GET /api/companies
   - POST /api/companies
   - PUT /api/companies/:id
   - DELETE /api/companies/:id
   - GET /api/company-employees

### Configuration APIs
1. Email Configuration
   - GET /api/email-config
   - POST /api/email-config
   - PUT /api/email-config/:id
   - GET /api/superadmin-email-config

2. Sidebar Configuration
   - GET /api/sidebar-menu
   - GET /api/sidebar-submenu
   - GET /api/superadmin-sidebar-menu
   - GET /api/sidebar-combined

3. Integration Configuration
   - GET /api/twilio-config
   - POST /api/twilio-config
   - PUT /api/twilio-config/:id
   - GET /api/whatsapp-config

## API Response Formats & Error Handling

### Success Response Format
1. Single Resource
```json
{
    "message": "Operation successful",
    "data": {
        "id": 1,
        "name": "Resource Name",
        "created_at": "2024-02-20T10:00:00.000Z",
        "updated_at": "2024-02-20"
    }
}
```

2. Collection Response
```json
{
    "data": [
        {
            "id": 1,
            "name": "Resource 1",
            "created_at": "2024-02-20T10:00:00.000Z"
        },
        {
            "id": 2,
            "name": "Resource 2",
            "created_at": "2024-02-20T10:00:00.000Z"
        }
    ]
}
```

3. Operation Response
```json
{
    "message": "Operation completed successfully",
    "data": {
        "affectedRows": 1,
        "insertId": 1
    }
}
```

### Error Response Format
1. Client Errors (4xx)
```json
{
    "error": "Error message description",
    "code": 400,
    "details": {
        "field": "Error details"
    }
}
```

2. Server Errors (5xx)
```json
{
    "error": "Internal server error message",
    "code": 500
}
```

### Common Error Types
1. Validation Errors
   - Missing required fields
   - Invalid data format
   - Unique constraint violation
   - Foreign key constraint

2. Authentication Errors
   - Invalid credentials
   - Token expired
   - Invalid token
   - Insufficient permissions

3. Resource Errors
   - Not found
   - Already exists
   - Access denied
   - Resource locked

#### Database Schema
1. User Management
   - Super admin profiles
   - Company employees
   - Roles and permissions
   - User preferences

2. Communication
   - Message templates
   - Campaign data
   - Communication logs
   - Call records

3. System Configuration
   - Global settings
   - Company settings
   - Email configurations
   - Integration settings

## Project Structure

### Frontend Structure
1. Source Directory (/frontend/src)
   - /components
     - /ui: Reusable UI components
     - /auth: Authentication components
     - /layout: Layout components
     - /settings: Settings components
     - /analytics: Analytics components
     - /communication: Communication components
     - /campaigns: Campaign management
     - /charts: Data visualization
     - /leads: Lead management

   - /pages
     - Dashboard
     - Settings
     - Analytics
     - Communication
     - Campaigns
     - Profile
     - Auth pages

   - /services
     - API services
     - WebSocket services
     - Authentication
     - Storage

   - /store
     - Authentication store
     - User preferences
     - Application state

### Backend Structure
1. Source Directory (/backend/src)
   - /models
     - User models
     - Company models
     - Communication models
     - Campaign models
     - Configuration models

   - /routes
     - Authentication routes
     - User management
     - Company management
     - Communication
     - Analytics

   - /migrations
     - Database schema
     - Data migrations
     - Schema updates

   - /callagent
     - Voice integration
     - Call management
     - Campaign handling

## UI Component Implementation

### Core Components
1. Form Components
   - Input: Text input with validation
   - Select: Dropdown selection
   - Checkbox: Toggle selection
   - RadioButton: Option selection
   - Button: Action buttons
   - Switch: Toggle switches
   - Textarea: Multi-line input

2. Layout Components
   - Card: Content containers
   - Modal: Popup dialogs
   - Tabs: Content organization
   - Accordion: Collapsible content
   - Timeline: Sequential display
   - DataTable: Data grid display
   - KanbanBoard: Task management

3. Interactive Components
   - DateRangePicker: Date selection
   - PromptEditor: Text editing
   - SmartInbox: Message management
   - ActivityList: Action tracking
   - ChannelMetrics: Performance display
   - ConversationScore: Quality metrics

### Feature Components
1. Communication Components
   - MessageBubble: Chat messages
   - NotificationToast: Alerts
   - ChannelIcon: Channel indicators
   - StatusPill: Status display
   - ProgressBar: Progress tracking

2. Data Display
   - MetricCard: KPI display
   - DataTable: Data presentation
   - Timeline: Event tracking
   - ActivityList: Action logging
   - ChannelMetrics: Performance metrics

3. User Interface
   - AccessibilityProvider: A11y support
   - KeyboardNavigation: Keyboard control
   - SkipNavigation: Accessibility
   - Tooltip: Help text
   - PopOver: Contextual info

### Accessibility Features
1. Navigation Support
   - Keyboard navigation
   - Screen reader support
   - Focus management
   - Skip links
   - ARIA labels

2. Visual Assistance
   - Color contrast
   - Font scaling
   - Icon alternatives
   - Focus indicators
   - Error states

## Implementation Details

### Database Implementation
1. Core Tables
   - users
   - companies
   - roles
   - permissions
   - configurations

2. Communication Tables
   - messages
   - templates
   - campaigns
   - call_logs

3. Analytics Tables
   - metrics
   - reports
   - analytics_data
   - performance_logs

### API Implementation
1. Authentication APIs
   - /api/auth/login
   - /api/auth/logout
   - /api/auth/refresh
   - /api/auth/profile

2. User Management APIs
   - /api/users
   - /api/roles
   - /api/permissions
   - /api/companies

3. Communication APIs
   - /api/messages
   - /api/templates
   - /api/campaigns
   - /api/calls

### Integration Implementation
1. WhatsApp Integration
   - Business API setup
   - Webhook handling
   - Message management
   - Template system

2. Voice Integration
   - Twilio integration
   - Call management
   - Recording system
   - Analytics

3. Email Integration
   - SMTP configuration
   - Template system
   - Campaign management
   - Tracking system

## Configuration & Environment Setup

### Development Environment
1. Frontend Configuration
   - Node.js and npm setup
   - React + TypeScript
   - Vite configuration
   - ESLint and Prettier
   - Development server

2. Backend Configuration
   - Node.js environment
   - Database connection
   - Environment variables
   - Development server
   - API documentation

3. Database Setup
   - MySQL configuration
   - Migration setup
   - Seed data
   - Test database
   - Backup system

### Deployment Configuration
1. Production Setup
   - Environment variables
   - Security configurations
   - SSL certificates
   - Domain setup
   - Server configuration

2. Build Process
   - Frontend build
   - Backend build
   - Asset optimization
   - Dependency management
   - Version control

3. Deployment Process
   - Server setup
   - Database migration
   - Service deployment
   - SSL configuration
   - Monitoring setup

## Testing & Quality Assurance

### Testing Implementation
1. Unit Tests
   - Component testing
   - Service testing
   - API testing
   - Model testing
   - Utility testing

2. Integration Tests
   - API integration
   - Database operations
   - External services
   - Authentication flow
   - Business logic

3. End-to-End Tests
   - User flows
   - Cross-portal testing
   - Performance testing
   - Security testing
   - UI/UX testing

## Security Implementation

### Authentication Security
1. User Authentication
   - JWT implementation
   - Token management
   - Session handling
   - Password policies
   - MFA support

2. Access Control
   - Role-based access
   - Permission management
   - Resource protection
   - API security
   - Data access control

3. Data Security
   - Encryption at rest
   - Data masking
   - Secure storage
   - Backup encryption
   - Access logging

## Monitoring & Logging

### System Monitoring
1. Performance Monitoring
   - Server metrics
   - Application metrics
   - Database metrics
   - API performance
   - Resource usage

2. Business Monitoring
   - User activity
   - Campaign performance
   - Communication metrics
   - Error rates
   - Success metrics

3. Security Monitoring
   - Access logs
   - Security events
   - Authentication attempts
   - API usage
   - Error tracking

### Logging System
1. Application Logs
   - Error logs
   - Access logs
   - Performance logs
   - Security logs
   - Audit trails

2. Integration Logs
   - WhatsApp logs
   - Email logs
   - Voice call logs
   - API logs
   - Webhook logs

## Maintenance & Support

### System Maintenance
1. Regular Updates
   - Security patches
   - Feature updates
   - Bug fixes
   - Performance optimization
   - Documentation updates

2. Backup Management
   - Database backups
   - File backups
   - Configuration backups
   - Recovery testing
   - Retention policies

3. Performance Optimization
   - Code optimization
   - Database optimization
   - Cache management
   - Resource optimization
   - Load balancing

## Call Agent System

### Voice Call Implementation
1. Call Management
   - Call initiation
   - Call recording
   - Call monitoring
   - Call quality tracking
   - Call analytics

2. Campaign Management
   - Campaign creation
   - Agent assignment
   - Schedule management
   - Performance tracking
   - Report generation

3. Lead Management
   - Lead assignment
   - Call scheduling
   - Follow-up tracking
   - Conversion tracking
   - Performance metrics

### Call Agent Features
1. Agent Management
   - Agent profiles
   - Availability tracking
   - Performance monitoring
   - Call assignment
   - Quality assessment

2. Call Features
   - Live call handling
   - Call recording
   - Call transfer
   - Conference calls
   - Call notes

3. Reporting System
   - Call reports
   - Agent performance
   - Campaign analytics
   - Lead conversion
   - Quality metrics

### Integration Points
1. Twilio Integration
   - Voice calls
   - Call recording
   - Call analytics
   - Number management
   - Webhook handling

2. CRM Integration
   - Lead management
   - Contact history
   - Call logging
   - Activity tracking
   - Performance metrics

## Development Status

### Completed Core Features
1. Authentication & Authorization
   - Multi-portal login system
   - Role-based access control
   - Permission management
   - Session handling

2. User Interface
   - Responsive design
   - Portal-specific layouts
   - Form validation
   - Error handling
   - Loading states

3. Database & API
   - Schema implementation
   - Migration system
   - API endpoints
   - Data validation

### In Progress
1. Communication Features
   - Voice call integration
   - Campaign automation
   - Template system
   - Message scheduling

2. Analytics System
   - Real-time metrics
   - Performance tracking
   - Report generation
   - Data visualization

### Pending Development
1. Advanced Features
   - AI-powered responses
   - Predictive analytics
   - Advanced automation
   - Integration expansions

2. System Optimization
   - Performance improvements
   - Scalability enhancements
   - Security hardening
   - Caching implementation

## Deployment & CI/CD

### Deployment Architecture
1. Production Environment
   - Load balanced servers
   - Database clusters
   - Redis cache
   - CDN setup
   - SSL certificates

2. Staging Environment
   - Testing servers
   - Test database
   - Integration testing
   - Performance testing
   - UAT environment

3. Development Environment
   - Local development
   - Development database
   - Mock services
   - Hot reloading
   - Debug tools

### CI/CD Pipeline
1. Build Process
   - Code compilation
   - Asset optimization
   - Dependency check
   - Security scan
   - Documentation generation

2. Testing Pipeline
   - Unit tests
   - Integration tests
   - E2E tests
   - Performance tests
   - Security tests

3. Deployment Process
   - Environment validation
   - Database migration
   - Service deployment
   - Health checks
   - Rollback procedures

### Monitoring & Alerts
1. System Monitoring
   - Server health
   - Database performance
   - API metrics
   - Error rates
   - Resource usage

2. Business Monitoring
   - User activity
   - Communication metrics
   - Campaign performance
   - Conversion rates
   - Success metrics

## Next Steps
1. Voice Integration
   - Complete voice call system
   - Call recording features
   - Voice analytics
   - Quality monitoring

2. Analytics Implementation
   - Dashboard completion
   - Report automation
   - Metric tracking
   - Performance analytics

3. Campaign Enhancement
   - Multi-channel campaigns
   - Advanced targeting
   - Performance tracking
   - A/B testing

4. System Improvements
   - Automated testing
   - Performance optimization
   - Security enhancements
   - Documentation updates