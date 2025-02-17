const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const TwilioConfig = sequelize.define('TwilioConfig', {
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
	account_sid: {
		type: DataTypes.STRING,
		allowNull: false,
		validate: {
			notNull: { msg: 'Account SID is required' },
			notEmpty: { msg: 'Account SID cannot be empty' }
		}
	},
	auth_token: {
		type: DataTypes.STRING,
		allowNull: false,
		validate: {
			notNull: { msg: 'Auth token is required' },
			notEmpty: { msg: 'Auth token cannot be empty' }
		}
	},
	phone_number: {
		type: DataTypes.STRING,
		allowNull: false,
		validate: {
			notNull: { msg: 'Phone number is required' },
			notEmpty: { msg: 'Phone number cannot be empty' }
		}
	},
	messaging_service_sid: {
		type: DataTypes.STRING,
		allowNull: true
	},
	region: {
		type: DataTypes.STRING,
		allowNull: false,
		defaultValue: 'us1'
	},
	api_base_url: {
		type: DataTypes.STRING,
		allowNull: false,
		defaultValue: 'https://api.twilio.com'
	}
}, {
	timestamps: true,
	createdAt: 'created_at',
	updatedAt: 'updated_at',
	tableName: 'twilio_config', // Explicitly define the table name
	freezeTableName: true // Prevent Sequelize from pluralizing the table name
});

// Sync the model with the database
// (async () => {
// 	try {
// 		await TwilioConfig.sync();
// 		console.log('TwilioConfig table created successfully');
// 	} catch (error) {
// 		console.error('Error creating TwilioConfig table:', error);
// 	}
// })();

module.exports = TwilioConfig;


