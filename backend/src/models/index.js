const sequelize = require('../config/database');
const TestSuperadminRole = require('./TestSuperadminRole');
const TestSuperadminSidebarMenu = require('./TestSuperadminSidebarMenu');
const TestSuperadminSidebarSubMenu = require('./TestSuperadminSidebarSubMenu');
const TestSuperadminRolePermission = require('./TestSuperadminRolePermission');
const CompanyRoleModel = require('./CompanyRoleModel');
const SidebarMenuModel = require('./SidebarMenuModel');
const SidebarSubMenuModel = require('./SidebarSubMenuModel');
const CompanyRolePermissionModel = require('./CompanyRolePermissionModel');

const models = {
    TestSuperadminRole,
    TestSuperadminSidebarMenu,
    TestSuperadminSidebarSubMenu,
    TestSuperadminRolePermission,
    CompanyRoleModel,
    SidebarMenuModel,
    SidebarSubMenuModel,
    CompanyRolePermissionModel
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