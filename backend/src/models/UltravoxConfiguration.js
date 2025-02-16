const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const UltravoxConfiguration = sequelize.define('UltravoxConfiguration', {
	id: {
		type: DataTypes.INTEGER,
		primaryKey: true,
		autoIncrement: true
	},
	company_id: {
		type: DataTypes.INTEGER,
		allowNull: false,
		validate: {
			notNull: { msg: 'Company ID is required' },
			notEmpty: { msg: 'Company ID cannot be empty' }
		}
	},
	apikey: {
		type: DataTypes.STRING(255),
		allowNull: false,
		validate: {
			notNull: { msg: 'API Key is required' },
			notEmpty: { msg: 'API Key cannot be empty' }
		}
	},
	apiurl: {
		type: DataTypes.STRING(255),
		allowNull: false,
		validate: {
			notNull: { msg: 'API URL is required' },
			notEmpty: { msg: 'API URL cannot be empty' }
		}
	},
	model: {
		type: DataTypes.STRING(255),
		allowNull: false,
		defaultValue: 'fixie-ai/ultravox'
	},
	voice: {
		type: DataTypes.STRING(50),
		allowNull: false,
		defaultValue: 'terrence'
	},
	firstspeaker: {
		type: DataTypes.STRING(50),
		allowNull: false,
		defaultValue: 'FIRST_SPEAKER_USER'
	},
	system_prompt: {
		type: DataTypes.TEXT,
		allowNull: false,
		validate: {
			notNull: { msg: 'System prompt is required' },
			notEmpty: { msg: 'System prompt cannot be empty' }
		}
	},
	is_active: {
		type: DataTypes.BOOLEAN,
		defaultValue: true
	}
}, {
	timestamps: true,
	createdAt: 'created_at',
	tableName: 'ultravox_configurations',
	updatedAt: 'updated_at',
	freezeTableName: true
});

// Sync the model with the database
(async () => {
    try {
        await UltravoxConfiguration.sync();
        console.log('UltravoxConfiguration table created successfully');
    } catch (error) {
        console.error('Error creating UltravoxConfiguration table:', error);
    }
})();

module.exports = UltravoxConfiguration;