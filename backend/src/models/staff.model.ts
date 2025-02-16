import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/database';

class Staff extends Model {
  public id!: number;
  public employee_id!: string;
  public first_name!: string;
  public last_name!: string;
  public email!: string;
  public phone!: string;
  public role!: string;
  public status!: 'active' | 'inactive';
  public created_at!: Date;
  public updated_at!: Date;
}

Staff.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    employee_id: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
    first_name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    last_name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(200),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    role: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: 'staff',
    },
    status: {
      type: DataTypes.ENUM('active', 'inactive'),
      defaultValue: 'active',
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: 'staff',
    timestamps: true,
    underscored: true,
  }
);

export default Staff; 