const { Model, DataTypes, Sequelize } = require('sequelize');
const sequelize = require('../config/database');

class TestSuperadminRolePermission extends Model {
	static associate(models) {
		this.belongsTo(models.TestSuperadminRole, {
			foreignKey: 'role_id',
			as: 'test_superadmin_role'
		});
		this.belongsTo(models.TestSuperadminSidebarMenu, {
			foreignKey: 'superadmin_sidebar_menu_id',
			as: 'test_superadmin_sidebar_menu'
		});
		this.belongsTo(models.TestSuperadminSidebarSubMenu, {
			foreignKey: 'superadmin_sidebar_sub_menu_id',
			as: 'test_superadmin_sidebar_submenu'
		});
	}
}

TestSuperadminRolePermission.init({
	id: {
		type: DataTypes.INTEGER,
		primaryKey: true,
		autoIncrement: true
	},
	role_id: {
		type: DataTypes.INTEGER,
		allowNull: true,
		references: {
			model: 'roles',
			key: 'id'
		}
	},
	superadmin_sidebar_menu_id: {
		type: DataTypes.INTEGER,
		allowNull: false,
		references: {
			model: 'superadmin_sidebar_menus',
			key: 'id'
		}
	},
	superadmin_sidebar_sub_menu_id: {
		type: DataTypes.INTEGER,
		allowNull: false,
		references: {
			model: 'superadmin_sidebar_sub_menus',
			key: 'id'
		}
	},
	can_view: {
		type: DataTypes.INTEGER,
		allowNull: true
	},
	can_add: {
		type: DataTypes.INTEGER,
		allowNull: true
	},
	can_edit: {
		type: DataTypes.INTEGER,
		allowNull: true
	},
	can_delete: {
		type: DataTypes.INTEGER,
		allowNull: true
	},
	created_at: {
		type: DataTypes.DATE,
		defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
	}

}, {
	sequelize,
	modelName: 'TestSuperadminRolePermission',
	tableName: 'superadmin_roles_permissions',
	timestamps: false
});

module.exports = TestSuperadminRolePermission;