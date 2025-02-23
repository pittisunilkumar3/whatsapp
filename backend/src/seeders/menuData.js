const { SidebarMenuModel, SidebarSubMenuModel, CompanyRolePermissionModel } = require('../models');

async function seedMenuData(companyId, roleId) {
    try {
        // Create main menu
        const dashboardMenu = await SidebarMenuModel.create({
            company_id: companyId,
            menu: 'Dashboard',
            icon: 'fa-dashboard',
            is_active: 1,
            lang_key: 'dashboard',
            level: 1,
            sidebar_display: 1,
            system_level: 0
        });

        console.log('Created dashboard menu:', dashboardMenu.toJSON());

        // Create submenus
        const overview = await SidebarSubMenuModel.create({
            company_id: companyId,
            sidebar_menu_id: dashboardMenu.id,
            menu: 'Overview',
            key: 'overview',
            url: '/dashboard/overview',
            is_active: 1,
            lang_key: 'overview',
            level: 1
        });

        console.log('Created overview submenu:', overview.toJSON());

        const analytics = await SidebarSubMenuModel.create({
            company_id: companyId,
            sidebar_menu_id: dashboardMenu.id,
            menu: 'Analytics',
            key: 'analytics',
            url: '/dashboard/analytics',
            is_active: 1,
            lang_key: 'analytics',
            level: 1
        });

        console.log('Created analytics submenu:', analytics.toJSON());

        // Create permissions
        const overviewPerm = await CompanyRolePermissionModel.create({
            company_id: companyId,
            company_roles_role_id: roleId,
            sidebar_menu_id: dashboardMenu.id,
            sidebar_sub_menu_id: overview.id,
            can_view: 1,
            can_add: 0,
            can_edit: 1,
            can_delete: 0
        });

        console.log('Created overview permissions:', overviewPerm.toJSON());

        const analyticsPerm = await CompanyRolePermissionModel.create({
            company_id: companyId,
            company_roles_role_id: roleId,
            sidebar_menu_id: dashboardMenu.id,
            sidebar_sub_menu_id: analytics.id,
            can_view: 1,
            can_add: 1,
            can_edit: 1,
            can_delete: 1
        });

        console.log('Created analytics permissions:', analyticsPerm.toJSON());

        // Verify the data was created
        const verifyMenu = await SidebarMenuModel.findOne({
            where: { id: dashboardMenu.id },
            include: [{
                model: SidebarSubMenuModel,
                as: 'submenus'
            }]
        });

        console.log('Verification - Menu with submenus:', JSON.stringify(verifyMenu, null, 2));

        const verifyPermissions = await CompanyRolePermissionModel.findAll({
            where: {
                company_id: companyId,
                company_roles_role_id: roleId
            }
        });

        console.log('Verification - Permissions:', JSON.stringify(verifyPermissions, null, 2));

        return {
            menu: verifyMenu,
            permissions: verifyPermissions
        };
    } catch (error) {
        console.error('Error seeding menu data:', error);
        throw error;
    }
}

module.exports = seedMenuData;
