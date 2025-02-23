const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class CompanyRoleModel extends Model {
    static associate(models) {
        this.hasMany(models.CompanyRolePermissionModel, {
            foreignKey: 'company_roles_role_id',
            as: 'permissions'
        });
    }
}

CompanyRoleModel.init({
    id: {
        type: DataTypes.INTEGER(11),
        primaryKey: true,
        autoIncrement: true
    },
    company_id: {
        type: DataTypes.INTEGER(11),
        allowNull: false
    },
    name: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    slug: {
        type: DataTypes.STRING(150),
        allowNull: true
    },
    is_active: {
        type: DataTypes.INTEGER(11),
        defaultValue: 0
    },
    is_system: {
        type: DataTypes.INTEGER(1),
        defaultValue: 0
    },
    is_superadmin: {
        type: DataTypes.INTEGER(11),
        defaultValue: 0
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    updated_at: {
        type: DataTypes.DATE,
        allowNull: true
    }
}, {
    sequelize,
    modelName: 'CompanyRoleModel',
    tableName: 'company_roles',
    timestamps: false,
    engine: 'InnoDB',
    charset: 'utf8',
    collate: 'utf8_general_ci'
});

module.exports = CompanyRoleModel;
