const express = require('express');
const cors = require('cors');
const superAdminSidebarMenuRoutes = require('./routes/superAdminSidebarMenuRoutes');

// Call Agent Routes
const callAgentRoutes = require('./callagent/routes/callAgentRoutes');
const callCampaignRoutes = require('./callagent/routes/callCampaignRoutes');
const callLeadRoutes = require('./callagent/routes/callLeadRoutes');
const callRoutes = require('./callagent/routes/callRoutes');
const callReportRoutes = require('./callagent/routes/callReportRoutes');
const companyRoutes = require('./routes/companyRoutes');
const companyEmployeeRoutes = require('./routes/companyEmployeeRoutes');
const emailConfigRoutes = require('./routes/emailConfigRoutes');
const twilioConfigRoutes = require('./routes/twilioConfigRoutes');
const permGroupCombPermCatRoutes = require('./routes/permGroupCombPermCatRoutes');
const permissionCategoryRoutes = require('./routes/permissionCategoryRoutes');
const permissionGroupRoutes = require('./routes/permissionGroupRoutes');
const rolePermissionRoutes = require('./routes/rolePermissionRoutes');
const roleRoutes = require('./routes/roleRoutes');
const sidebarCombinedRoutes = require('./routes/sidebarCombinedRoutes');
const sidebarMenuRoutes = require('./routes/sidebarMenuRoutes');
const sidebarSubMenuRoutes = require('./routes/sidebarSubMenuRoutes');
const staffRoleRoutes = require('./routes/staffRoleRoutes');
const staffRoutes = require('./routes/staffRoutes');
const superAdminEmailConfigRoutes = require('./routes/superAdminEmailConfigRoutes');
const superAdminRoutes = require('./routes/superAdminRoutes');
const superadminSidebarCombinedRoutes = require('./routes/superadminSidebarCombinedRoutes');
const superAdminSidebarSubMenuRoutes = require('./routes/superAdminSidebarSubMenuRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/superadmin-sidebar-menus', superAdminSidebarMenuRoutes);
app.use('/api/companies', companyRoutes);
app.use('/api/company-employees', companyEmployeeRoutes);
app.use('/api/email-config', emailConfigRoutes);
app.use('/api/twilio-config', twilioConfigRoutes);
app.use('/api/perm-group-comb-perm-cat', permGroupCombPermCatRoutes);
app.use('/api/permission-categories', permissionCategoryRoutes);
app.use('/api/permission-groups', permissionGroupRoutes);
app.use('/api/role-permissions', rolePermissionRoutes);
app.use('/api/roles', roleRoutes);
app.use('/api/sidebar-combined', sidebarCombinedRoutes);
app.use('/api/sidebar-menus', sidebarMenuRoutes);
app.use('/api/sidebar-sub-menus', sidebarSubMenuRoutes);
app.use('/api/staff-roles', staffRoleRoutes);
app.use('/api/staff', staffRoutes);
app.use('/api/superadmin-email-config', superAdminEmailConfigRoutes);
app.use('/api/superadmin', superAdminRoutes);
app.use('/api/superadmin-sidebar-combined', superadminSidebarCombinedRoutes);
app.use('/api/superadmin-sidebar-sub-menus', superAdminSidebarSubMenuRoutes);

// Call Agent Routes
app.use('/api/call-agents', callAgentRoutes);
app.use('/api/call-campaigns', callCampaignRoutes);
app.use('/api/call-leads', callLeadRoutes);
app.use('/api/calls', callRoutes);
app.use('/api/call-reports', callReportRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
	console.error(err.stack);
	res.status(500).json({
		success: false,
		message: 'Internal Server Error',
		error: process.env.NODE_ENV === 'development' ? err.message : undefined
	});
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});

module.exports = app;