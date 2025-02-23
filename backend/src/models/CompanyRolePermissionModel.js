const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class CompanyRolePermissionModel extends Model {
    static associate(models) {
        this.belongsTo(models.CompanyRoleModel, {
            foreignKey: 'company_roles_role_id',
            as: 'role'
        });
        this.belongsTo(models.SidebarMenuModel, {
            foreignKey: 'sidebar_menu_id',
            as: 'menu'
        });
        this.belongsTo(models.SidebarSubMenuModel, {
            foreignKey: 'sidebar_sub_menu_id',
            as: 'submenu'
        });
    }
}

CompanyRolePermissionModel.init({
    id: {
        type: DataTypes.INTEGER(11),
        primaryKey: true,
        autoIncrement: true
    },
    company_id: {
        type: DataTypes.INTEGER(11),
        allowNull: false
    },
    company_roles_role_id: {
        type: DataTypes.INTEGER(11),
        allowNull: true,
        references: {
            model: 'company_roles',
            key: 'id'
        }
    },
    sidebar_menu_id: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        references: {
            model: 'sidebar_menus',
            key: 'id'
        }
    },
    sidebar_sub_menu_id: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        references: {
            model: 'sidebar_sub_menus',
            key: 'id'
        }
    },
    can_view: {
        type: DataTypes.INTEGER(11),
        allowNull: true
    },
    can_add: {
        type: DataTypes.INTEGER(11),
        allowNull: true
    },
    can_edit: {
        type: DataTypes.INTEGER(11),
        allowNull: true
    },
    can_delete: {
        type: DataTypes.INTEGER(11),
        allowNull: true
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    sequelize,
    modelName: 'CompanyRolePermissionModel',
    tableName: 'company_roles_permissions',
    timestamps: false,
    engine: 'InnoDB',
    charset: 'utf8',
    collate: 'utf8_general_ci'
});

module.exports = CompanyRolePermissionModel;
