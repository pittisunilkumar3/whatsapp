# Butterfly CRM

A modern, feature-rich Customer Relationship Management system with integrated communication channels and role-based access control.

## Features

### Communication Channels
- **Voice Communication**: Make calls and utilize voice cloning features
- **WhatsApp Integration**: Send messages and manage WhatsApp campaigns
- **SMS Management**: Handle text message campaigns and notifications
- **Email System**: Manage email campaigns and communications

## Role-Based Access Control

### Super Admin
- **Dashboard Access**: System-wide analytics and metrics
- **Company Management**: 
	- Create, view, edit, and delete companies
	- Monitor company usage and subscription status
	- Export company data
- **User Management**: 
	- Manage all user accounts across companies
	- Assign and modify roles
- **System Settings**: 
	- Configure global system parameters
	- Access audit logs
	- Manage billing and subscriptions
- **Analytics**: Access to system-wide analytics and reports

### Company Admin
- **Company Dashboard**: Company-specific metrics and KPIs
- **Employee Management**:
	- Add and manage company employees
	- Assign roles within company scope
	- Monitor employee performance
- **Communication Settings**:
	- Configure communication channels
	- Manage templates and prompts
	- Set conversation scoring parameters
- **Company Settings**:
	- Update company profile
	- Configure company-specific parameters
	- Manage subscription and billing

### Employee
- **Personal Dashboard**: Individual performance metrics
- **Communication Tools**:
	- Access assigned communication channels
	- Use voice, WhatsApp, SMS, and email
	- View personal analytics
- **Campaign Participation**:
	- Execute assigned campaigns
	- Track campaign performance
	- Access templates and resources

## Navigation Structure

### Main Sidebar
- **Dashboard**: Role-specific overview
	- Super Admin: System-wide metrics
	- Company Admin: Company metrics
	- Employee: Personal metrics
- **Companies** (Super Admin only):
	- Company list view
	- Company details
	- Usage statistics
- **Communication Hub**:
	- Voice Communication
	- WhatsApp Integration
	- SMS Management
	- Email System
- **Analytics & Reports**:
	- Performance metrics
	- Usage statistics
	- Communication analytics
- **Settings**: Role-based configuration options

### Quick Actions Menu
- New Company (Super Admin)
- New Campaign
- New Message
- Generate Report
- Export Data

### User Menu
- Profile Settings
- Preferences
- Notifications
- Logout

## API Documentation

### Super Admin
- **Access**: Full system access
- **Capabilities**:
	- Create, update, and delete companies
	- Manage all system settings
	- View and manage all companies' data
	- Access to all analytics and reports
	- Manage user roles and permissions

### Company Admin
- **Access**: Company-level management
- **Capabilities**:
	- Manage company profile and settings
	- Create and manage employees
	- View company analytics and reports
	- Manage communication channels
	- Access to company-specific data

### Employee
- **Access**: Regular user access
- **Capabilities**:
	- Use communication channels (voice, WhatsApp, SMS, email)
	- View personal analytics and reports
	- Access to assigned tasks and campaigns
	- View company announcements and updates

## Sidebar Functionality

The sidebar provides navigation and quick access to key features:

### Main Navigation
- **Dashboard**: Overview of key metrics and activities
- **Companies**: Manage and view company information
- **Users**: Manage user accounts and permissions
- **Analytics**: View detailed reports and insights
- **Settings**: Configure system and user preferences

### Quick Actions
- **New Company**: Create a new company profile
- **New Campaign**: Start a new communication campaign
- **New User**: Add a new user account
- **Reports**: Generate and view reports

### User Menu
- **Profile**: View and edit user profile
- **Settings**: Configure user preferences
- **Logout**: Sign out of the system

## API Documentation

### Base URL
`https://api.butterflycrm.com/v1`

### Authentication
- **Bearer Token Required**
- Token format: `Bearer <your-token>`
- Tokens expire after 24 hours

### Base URLs
- Production: `https://api.butterflycrm.com/v1`
- Development: `http://localhost:8000/v1`

### Endpoints

### Company Management
#### List Companies
```http
GET /companies
```
Query Parameters:
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)
- `status`: Filter by status
- `plan`: Filter by plan type

#### Create Company
```http
POST /companies
```
Required fields:
- `name`: Company name
- `industry`: Industry type
- `location`: Company location
- `contactPerson`: Primary contact
- `email`: Contact email
- `phone`: Contact phone
- `plan`: Subscription plan

### User Management
#### Create User
```http
POST /users
```
Required fields:
- `email`: User email
- `password`: User password
- `role`: User role
- `companyId`: Associated company

#### Update User
```http
PUT /users/{id}
```
Updatable fields:
- `email`: User email
- `role`: User role
- `status`: User status
- `permissions`: User permissions

#### Analytics
- **GET /analytics**: Get system-wide analytics
- **GET /analytics/companies/{id}**: Get company-specific analytics
- **GET /analytics/users/{id}**: Get user-specific analytics

### Communication APIs
#### Voice Calls
```http
POST /communications/voice
```
Required fields:
- `recipient`: Phone number
- `message`: Voice message or script
- `callerId`: Caller ID to display

#### WhatsApp Messages
```http
POST /communications/whatsapp
```
Required fields:
- `recipient`: WhatsApp number
- `message`: Message content
- `templateId`: Template ID (if using template)

### Response Codes
- **400**: Bad Request
- **401**: Unauthorized
- **403**: Forbidden
- **404**: Not Found
- **500**: Internal Server Error

### Key Features
- Multi-channel Communication Hub
- Real-time Analytics Dashboard
- Role-based Permission System
- Campaign Management
- User Management
- Audit Logging
- Responsive Design

## Tech Stack

- **Frontend**: React with TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Custom store implementation
- **UI Components**: Custom component library
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **Routing**: React Router

## Frontend Architecture

### Component Library
#### UI Components
- **Core Components**:
	- `Button`: Customizable button with variants (primary, secondary, ghost)
	- `Input`: Form input with validation and error states
	- `Card`: Container component with shadow and hover effects
	- `Modal`: Accessible modal dialog with animations
	- `Dropdown`: Custom select component with search
	- `StatusPill`: Status indicator with different states
	- `Tabs`: Tabbed interface with animations
	- `Switch`: Toggle switch with accessibility support
	- `DateRangePicker`: Date range selection with calendar
	- `DataTable`: Advanced table with sorting and filtering

#### Layout Components
- **AppLayout**: Main application layout with sidebar and navbar
- **Sidebar**: Responsive navigation sidebar with collapsible sections
- **Navbar**: Top navigation with user menu and notifications
- **SkipNavigation**: Accessibility feature for keyboard navigation

#### Communication Components
- **Voice**:
	- `VoiceCloneModal`: Voice cloning interface
	- `VoiceCampaignCard`: Campaign management card
	- `VoiceCallHandler`: Call handling interface
- **Messaging**:
	- `SmartInbox`: Unified messaging inbox
	- `MessageBubble`: Chat message component
	- `TemplatesTab`: Message template management
- **Email**:
	- `EmailTemplateEditor`: Rich text email editor
	- `CampaignCreation`: Email campaign builder

#### Analytics Components
- **Charts**:
	- `LineChart`: Time series visualization
	- `BarChart`: Comparison visualization
	- `PieChart`: Distribution visualization
	- `FunnelChart`: Conversion visualization
	- `HeatmapChart`: Activity patterns
	- `SankeyChart`: Flow visualization
- **Metrics**:
	- `MetricCard`: KPI display card
	- `ChannelMetrics`: Channel performance metrics
	- `CohortAnalysis`: User cohort analysis
	- `AttributionModeling`: Marketing attribution

### State Management
- Custom store implementation using React Context
- Zustand for global state management
- Optimistic updates for better UX
- Persistent storage for user preferences

### Performance Optimization
- Code splitting using React.lazy
- Dynamic imports for routes
- Memoization using useMemo and useCallback
- Virtual scrolling for large lists
- Image optimization and lazy loading

### Accessibility Features
- ARIA labels and roles
- Keyboard navigation support
- Focus management
- Screen reader compatibility
- High contrast mode
- Skip navigation links

### Development Guidelines

#### Component Development
1. **Component Structure**:
	 ```typescript
	 /components
	 ├── ui/              # Reusable UI components
	 ├── layout/          # Layout components
	 ├── communication/   # Communication features
	 ├── analytics/       # Analytics components
	 ├── settings/        # Settings components
	 └── shared/          # Shared utilities
	 ```

2. **Component Template**:
	 ```typescript
	 interface Props {
		 // Props interface
	 }

	 export const Component: React.FC<Props> = ({ ...props }) => {
		 // Component logic
		 return (
			 // JSX
		 );
	 };
	 ```

#### Styling Guidelines
- Use Tailwind CSS utility classes
- Follow BEM naming convention for custom CSS
- Maintain consistent spacing scale
- Use CSS variables for theming
- Responsive design breakpoints:
	- sm: 640px
	- md: 768px
	- lg: 1024px
	- xl: 1280px
	- 2xl: 1536px

#### Testing Strategy
- Unit tests with Jest and React Testing Library
- Integration tests for complex features
- E2E tests with Cypress
- Visual regression testing
- Accessibility testing with axe-core

#### Code Quality
- ESLint configuration
- Prettier formatting
- TypeScript strict mode
- Husky pre-commit hooks
- Conventional commits

#### Build and Deployment
- Vite build configuration
- Environment variables
- Docker containerization
- CI/CD pipeline
- Performance monitoring

### Development Workflow
1. **Setup Development Environment**:
	 ```bash
	 # Install dependencies
	 pnpm install

	 # Setup husky
	 pnpm husky install

	 # Start development server
	 pnpm dev
	 ```

2. **Creating New Components**:
	 ```bash
	 # Generate component scaffold
	 pnpm generate component ComponentName

	 # Generate page component
	 pnpm generate page PageName
	 ```

3. **Testing**:
	 ```bash
	 # Run unit tests
	 pnpm test

	 # Run tests with coverage
	 pnpm test:coverage

	 # Run E2E tests
	 pnpm test:e2e
	 ```

4. **Building**:
	 ```bash
	 # Production build
	 pnpm build

	 # Preview build
	 pnpm preview
	 ```

### Environment Configuration
```env
# .env.example
VITE_API_URL=http://localhost:8000
VITE_WS_URL=ws://localhost:8000
VITE_ENVIRONMENT=development
VITE_SENTRY_DSN=your-sentry-dsn
```

### Communication Features

#### Voice Communication
- **Voice Cloning**:
	- AI-powered voice synthesis
	- Multiple voice profiles
	- Natural language processing
	- Real-time voice modification
- **Call Management**:
	- Auto-dialer system
	- Call recording and transcription
	- Sentiment analysis
	- Call scheduling and queuing

#### WhatsApp Integration
- **Features**:
	- Bulk messaging
	- Template management
	- Media sharing
	- Interactive buttons
	- List messages
- **Automation**:
	- Auto-replies
	- Welcome messages
	- Follow-up sequences
	- Custom workflows

#### SMS Management
- **Campaign Features**:
	- Bulk SMS
	- Scheduled delivery
	- Dynamic variables
	- URL shortening
- **Analytics**:
	- Delivery rates
	- Click tracking
	- Response analytics
	- ROI measurement

#### Email System
- **Campaign Tools**:
	- Visual email builder
	- Template library
	- A/B testing
	- Personalization
- **Automation**:
	- Drip campaigns
	- Trigger-based emails
	- Segmentation
	- Dynamic content

### Analytics Capabilities

#### Real-time Analytics
- **Dashboard Metrics**:
	- Active users
	- Message volume
	- Response rates
	- Conversion tracking
- **Performance Indicators**:
	- Channel effectiveness
	- Team performance
	- Campaign success
	- ROI analysis

#### Advanced Analytics
- **Cohort Analysis**:
	- User segmentation
	- Behavior patterns
	- Retention metrics
	- Growth analysis
- **Predictive Analytics**:
	- Lead scoring
	- Churn prediction
	- Revenue forecasting
	- Trend analysis

#### Custom Reports
- **Report Builder**:
	- Drag-and-drop interface
	- Custom metrics
	- Multiple visualizations
	- Export options
- **Scheduled Reports**:
	- Automated delivery
	- Multiple formats
	- Custom recipients
	- Report templates

### Security Measures

#### Authentication
- **Multi-factor Authentication**:
	- SMS verification
	- Email verification
	- Authenticator app
	- Hardware key support
- **Session Management**:
	- Secure token handling
	- Session timeout
	- Device tracking
	- Login history

#### Data Protection
- **Encryption**:
	- At-rest encryption
	- In-transit encryption
	- End-to-end encryption
	- Key management
- **Access Control**:
	- Role-based access
	- IP whitelisting
	- Device restrictions
	- Audit logging

#### Compliance
- **Standards**:
	- GDPR compliance
	- HIPAA compliance
	- SOC 2 Type II
	- ISO 27001
- **Data Governance**:
	- Data retention
	- Data deletion
	- Privacy controls
	- Consent management

### Performance Monitoring

#### System Monitoring
- **Infrastructure**:
	- Server health
	- Database performance
	- API response times
	- Error tracking
- **Application**:
	- User experience
	- Page load times
	- Resource usage
	- Memory leaks

#### Error Handling
- **Error Tracking**:
	- Real-time alerts
	- Error grouping
	- Stack traces
	- Context capture
- **Recovery**:
	- Automatic retries
	- Fallback mechanisms
	- Circuit breakers
	- Graceful degradation

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or pnpm

### Installation

1. Clone the repository:
```bash
git clone [repository-url]
cd butterfly-crm
```

2. Install dependencies:
```bash
pnpm install
# or
npm install
```

3. Start the development server:
```bash
pnpm dev
# or
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Default Login Credentials

#### Super Admin
- Email: super@test.com
- Password: super123

#### Company Admin
- Email: admin@test.com
- Password: admin123

#### Employee
- Email: employee@test.com
- Password: employee123

## Project Structure

```
src/
├── components/     # Reusable UI components
├── pages/          # Page components
├── store/          # State management
├── services/       # API services
├── routes/         # Route configurations
├── types/          # TypeScript type definitions
├── styles/         # Global styles
└── assets/         # Static assets
```

## Available Scripts

- `pnpm dev`: Start development server
- `pnpm build`: Build for production
- `pnpm preview`: Preview production build
- `pnpm lint`: Run ESLint
- `pnpm type-check`: Run TypeScript type checking

### Deployment Guide

#### Production Deployment
- **Prerequisites**:
	- Node.js v14+
	- Docker
	- SSL certificate
	- Domain configuration

#### Deployment Steps
1. **Build Application**:
	 ```bash
	 # Install dependencies
	 pnpm install --production

	 # Build application
	 pnpm build
	 ```

2. **Docker Deployment**:
	 ```bash
	 # Build Docker image
	 docker build -t butterfly-crm .

	 # Run container
	 docker run -d -p 80:80 butterfly-crm
	 ```

3. **Environment Setup**:
	 ```bash
	 # Copy environment file
	 cp .env.example .env.production

	 # Configure environment variables
	 nano .env.production
	 ```

#### CI/CD Pipeline
- GitHub Actions workflow
- Automated testing
- Build verification
- Deployment automation
- Performance monitoring

### Troubleshooting Guide

#### Common Issues

1. **Authentication Issues**
	 - Check token expiration
	 - Verify credentials
	 - Clear browser cache
	 - Check network connectivity

2. **Performance Issues**
	 - Monitor API response times
	 - Check browser console
	 - Verify resource loading
	 - Monitor memory usage

3. **API Connection Issues**
	 - Verify API endpoint
	 - Check CORS configuration
	 - Validate request format
	 - Monitor rate limits

#### Debug Tools
- Browser DevTools
- Network monitoring
- Performance profiling
- Error logging

#### Support Resources
- Technical documentation
- API reference
- Community forums
- Support tickets

### Maintenance

#### Regular Tasks
- Dependency updates
- Security patches
- Performance optimization
- Database maintenance

#### Backup Procedures
- Database backups
- File system backups
- Configuration backups
- Recovery testing

#### Monitoring
- System health
- User activity
- Error rates
- Performance metrics

## Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add some amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, please email support@butterflycrm.com or open an issue in the repository.
