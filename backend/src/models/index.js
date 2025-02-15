const sequelize = require('../config/database');
const TestSuperadminRole = require('./TestSuperadminRole');
const TestSuperadminSidebarMenu = require('./TestSuperadminSidebarMenu');
const TestSuperadminSidebarSubMenu = require('./TestSuperadminSidebarSubMenu');
const TestSuperadminRolePermission = require('./TestSuperadminRolePermission');

const models = {
	TestSuperadminRole,
	TestSuperadminSidebarMenu,
	TestSuperadminSidebarSubMenu,
	TestSuperadminRolePermission
};

// Initialize associations
Object.values(models).forEach(model => {
	if (model.associate) {
		model.associate(models);
	}
});

module.exports = {
	sequelize,
	...models
};