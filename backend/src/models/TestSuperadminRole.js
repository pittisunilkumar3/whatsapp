const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class TestSuperadminRole extends Model {
	static associate(models) {
		this.hasMany(models.TestSuperadminRolePermission, {
			foreignKey: 'role_id'
		});
	}
}

TestSuperadminRole.init({
	id: {
		type: DataTypes.INTEGER,
		primaryKey: true,
		autoIncrement: true
	},
	name: {
		type: DataTypes.STRING(100),
		allowNull: false
	},
	slug: {
		type: DataTypes.STRING(150),
		allowNull: false,
		unique: true
	},
	is_active: {
		type: DataTypes.INTEGER,
		defaultValue: 0
	},
	is_system: {
		type: DataTypes.INTEGER,
		defaultValue: 0
	},
	is_superadmin: {
		type: DataTypes.INTEGER,
		defaultValue: 0
	},
	created_at: {
		type: DataTypes.DATE,
		defaultValue: DataTypes.NOW
	},
	updated_at: {
		type: DataTypes.DATE
	}
}, {
	sequelize,
	modelName: 'TestSuperadminRole',
	tableName: 'roles',
	timestamps: false
});

module.exports = TestSuperadminRole;