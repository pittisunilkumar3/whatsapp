const express = require('express');
const cors = require('cors');
const superAdminSidebarMenuRoutes = require('./routes/superAdminSidebarMenuRoutes');
const companyRoutes = require('./routes/companyRoutes');
const companyEmployeeRoutes = require('./routes/companyEmployeeRoutes');
const emailConfigRoutes = require('./routes/emailConfigRoutes');
const twilioConfigRoutes = require('./routes/twilioConfigRoutes');

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