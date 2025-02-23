const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class SidebarMenuModel extends Model {
    static associate(models) {
        // Define association with SidebarSubMenuModel
        this.hasMany(models.SidebarSubMenuModel, {
            foreignKey: 'sidebar_menu_id',
            as: 'submenus',
            onDelete: 'CASCADE'
        });
        // Define association with CompanyRolePermissionModel
        this.hasMany(models.CompanyRolePermissionModel, {
            foreignKey: 'sidebar_menu_id',
            as: 'permissions'
        });
    }
}

SidebarMenuModel.init({
    id: {
        type: DataTypes.INTEGER(11),
        primaryKey: true,
        autoIncrement: true
    },
    company_id: {
        type: DataTypes.INTEGER(10),
        allowNull: true
    },
    permission_group_id: {
        type: DataTypes.INTEGER(10),
        allowNull: true
    },
    icon: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    menu: {
        type: DataTypes.STRING(500),
        allowNull: true
    },
    activate_menu: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    lang_key: {
        type: DataTypes.STRING(250),
        allowNull: false
    },
    system_level: {
        type: DataTypes.INTEGER(3),
        defaultValue: 0
    },
    level: {
        type: DataTypes.INTEGER(5),
        allowNull: true
    },
    sidebar_display: {
        type: DataTypes.INTEGER(1),
        defaultValue: 0
    },
    access_permissions: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    is_active: {
        type: DataTypes.INTEGER(1),
        defaultValue: 1
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    sequelize,
    modelName: 'SidebarMenuModel',
    tableName: 'sidebar_menus',
    timestamps: false,
    engine: 'InnoDB',
    charset: 'utf8',
    collate: 'utf8_general_ci'
});

module.exports = SidebarMenuModel;
