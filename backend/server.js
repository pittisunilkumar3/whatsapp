const express = require('express');
const cors = require('cors');
const db = require('./db');
const Role = require('./src/models/Role');
const roleRoutes = require('./src/routes/roleRoutes');
const permissionGroupRoutes = require('./src/routes/permissionGroupRoutes');
const permissionCategoryRoutes = require('./src/routes/permissionCategoryRoutes');
const rolePermissionRoutes = require('./src/routes/rolePermissionRoutes');
const permGroupCombPermCatRoutes = require('./src/routes/permGroupCombPermCatRoutes');
const sidebarMenuRoutes = require('./src/routes/sidebarMenuRoutes');
const sidebarSubMenuRoutes = require('./src/routes/sidebarSubMenuRoutes');
const sidebarCombinedRoutes = require('./src/routes/sidebarCombinedRoutes');
const staffRoleRoutes = require('./src/routes/staffRoleRoutes');
const staffRoutes = require('./src/routes/staffRoutes');
const companyRoutes = require('./src/routes/companyRoutes');
const companyEmployeeRoutes = require('./src/routes/companyEmployeeRoutes');
const superAdminRoutes = require('./src/routes/superAdminRoutes');
const superAdminSidebarMenuRoutes = require('./src/routes/superAdminSidebarMenuRoutes');
const superAdminSidebarSubMenuRoutes = require('./src/routes/superAdminSidebarSubMenuRoutes');
const superAdminSidebarCombinedRoutes = require('./src/routes/superadminSidebarCombinedRoutes');
const superAdminEmailConfigRoutes = require('./src/routes/superAdminEmailConfigRoutes');

const callCampaignRoutes = require('./src/callagent/routes/callCampaignRoutes');
const callAgentRoutes = require('./src/callagent/routes/callAgentRoutes');
const callLeadRoutes = require('./src/callagent/routes/callLeadRoutes');
const callRoutes = require('./src/callagent/routes/callRoutes');
const callReportRoutes = require('./src/callagent/routes/callReportRoutes');




require('dotenv').config();

console.log('Starting server initialization...');
console.log('Environment variables loaded:', {
	DB_HOST: process.env.DB_HOST,
	DB_USER: process.env.DB_USER,
	DB_NAME: process.env.DB_NAME,
	PORT: process.env.PORT
});

const app = express();
app.use(cors());
app.use(express.json());

// API routes
console.log('Setting up API routes...');
app.use('/api/roles', roleRoutes);
app.use('/api/permission-groups', permissionGroupRoutes);
app.use('/api/permission-categories', permissionCategoryRoutes);
app.use('/api/role-permissions', rolePermissionRoutes);
app.use('/api', permGroupCombPermCatRoutes);
app.use('/api/sidebar-menus', sidebarMenuRoutes);
app.use('/api/sidebar-sub-menus', sidebarSubMenuRoutes);
app.use('/api/sidebar-combined', sidebarCombinedRoutes);
app.use('/api/staff-roles', staffRoleRoutes);
app.use('/api/staff', staffRoutes);
app.use('/api/companies', companyRoutes);
app.use('/api/company-employees', companyEmployeeRoutes);
app.use('/api/superadmin', superAdminRoutes);
app.use('/api/superadmin-sidebar-menus', superAdminSidebarMenuRoutes);
app.use('/api/superadmin-sidebar-sub-menus', superAdminSidebarSubMenuRoutes);
app.use('/api/superadmin-sidebar', superAdminSidebarCombinedRoutes);
app.use('/api/superadmin/email-config', superAdminEmailConfigRoutes);

app.use('/api/callagent/campaigns', callCampaignRoutes);
app.use('/api/callagent/agents', callAgentRoutes);
app.use('/api/callagent/leads', callLeadRoutes);
app.use('/api/callagent/calls', callRoutes);
app.use('/api/callagent/reports', callReportRoutes);
console.log('API routes setup completed');

// Test API endpoint
app.get('/api/test', async (req, res) => {
	try {
		console.log('Testing database connection...');
		const [result] = await db.query('SELECT 1 as test');
		console.log('Database connection test successful');
		res.json({ message: 'Database connection successful', data: result });
	} catch (error) {
		console.error('Database connection test failed:', error);
		res.status(500).json({ error: error.message });
	}
});

// Add test endpoint to verify companies table structure
app.get('/api/test/companies', async (req, res) => {
	try {
		console.log('Fetching companies table structure...');
		const [result] = await db.query('SHOW COLUMNS FROM companies');
		console.log('Companies table structure retrieved successfully');
		res.json({ message: 'Companies table structure', data: result });
	} catch (error) {
		console.error('Failed to fetch companies table structure:', error);
		res.status(500).json({ error: error.message });
	}
});

// Initialize database and start server
(async () => {
	try {
		console.log('Starting database initialization...');
		console.log('Testing database connection...');
		
		try {
			await db.query('SELECT 1');
			console.log('Database connection successful');
		} catch (dbError) {
			console.error('Database connection failed:', dbError);
			throw dbError;
		}
		
		const PORT = process.env.PORT || 5000;
		const server = app.listen(PORT, () => {
			console.log(`Server running on port ${PORT}`);
		});


		server.on('error', (err) => {
			console.error('Server failed to start:', err);
			console.error('Error details:', err.stack);
			process.exit(1);
		});

		// Handle process termination
		process.on('SIGTERM', () => {
			console.log('SIGTERM received. Shutting down gracefully...');
			server.close(() => {
				console.log('Server closed');
				process.exit(0);
			});
		});

		process.on('uncaughtException', (err) => {
			console.error('Uncaught Exception:', err);
			console.error('Stack trace:', err.stack);
			process.exit(1);
		});

		process.on('unhandledRejection', (reason, promise) => {
			console.error('Unhandled Rejection at:', promise);
			console.error('Reason:', reason);
			process.exit(1);
		});
	} catch (error) {
		console.error('Server initialization failed:', error);
		console.error('Error details:', error.stack);
		process.exit(1);
	}
})();


