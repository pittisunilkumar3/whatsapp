const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class TestSuperadminSidebarSubMenu extends Model {
	static associate(models) {
		this.belongsTo(models.TestSuperadminSidebarMenu, {
			foreignKey: 'superadmin_sidebar_menu_id',
			as: 'test_superadmin_sidebar_menu'
		});
	}
}

TestSuperadminSidebarSubMenu.init({
	id: {
		type: DataTypes.INTEGER(11),
		primaryKey: true,
		autoIncrement: true
	},
	superadmin_sidebar_menu_id: {
		type: DataTypes.INTEGER(10),
		allowNull: true,
		references: {
			model: 'superadmin_sidebar_menus',
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
		defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
		onUpdate: sequelize.literal('CURRENT_TIMESTAMP')
	}
}, {
	sequelize,
	modelName: 'superadmin_sidebar_sub_menus',
	tableName: 'superadmin_sidebar_sub_menus',
	timestamps: false,
	engine: 'InnoDB',
	charset: 'utf8',
	collate: 'utf8_general_ci'
});

module.exports = TestSuperadminSidebarSubMenu;