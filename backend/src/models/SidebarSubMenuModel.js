const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class SidebarSubMenuModel extends Model {
    static associate(models) {
        // Define association with SidebarMenuModel
        this.belongsTo(models.SidebarMenuModel, {
            foreignKey: 'sidebar_menu_id',
            as: 'parent_menu'
        });
        // Define association with CompanyRolePermissionModel
        this.hasMany(models.CompanyRolePermissionModel, {
            foreignKey: 'sidebar_sub_menu_id',
            as: 'permissions'
        });
    }
}

SidebarSubMenuModel.init({
    id: {
        type: DataTypes.INTEGER(11),
        primaryKey: true,
        autoIncrement: true
    },
    company_id: {
        type: DataTypes.INTEGER(10),
        allowNull: true
    },
    sidebar_menu_id: {
        type: DataTypes.INTEGER(10),
        allowNull: true,
        references: {
            model: 'sidebar_menus',
            key: 'id'
        }
    },
    menu: {
        type: DataTypes.STRING(500),
        allowNull: true
    },
    key: {
        type: DataTypes.STRING(500),
        allowNull: true
    },
    lang_key: {
        type: DataTypes.STRING(250),
        allowNull: true
    },
    url: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    level: {
        type: DataTypes.INTEGER(5),
        allowNull: true
    },
    access_permissions: {
        type: DataTypes.STRING(500),
        allowNull: true
    },
    permission_group_id: {
        type: DataTypes.INTEGER(11),
        allowNull: true
    },
    activate_controller: {
        type: DataTypes.STRING(100),
        allowNull: true,
        comment: 'income'
    },
    activate_methods: {
        type: DataTypes.STRING(500),
        allowNull: true,
        comment: 'index,edit'
    },
    addon_permission: {
        type: DataTypes.STRING(100),
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
    modelName: 'SidebarSubMenuModel',
    tableName: 'sidebar_sub_menus',
    timestamps: false,
    engine: 'InnoDB',
    charset: 'utf8',
    collate: 'utf8_general_ci'
});

module.exports = SidebarSubMenuModel;
