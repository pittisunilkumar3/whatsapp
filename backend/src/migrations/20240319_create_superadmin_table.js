const db = require('../../db');

async function up() {
	const sql = `
		CREATE TABLE IF NOT EXISTS superadmin (
			id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
			first_name VARCHAR(50) NOT NULL,
			last_name VARCHAR(50) NOT NULL,
			username VARCHAR(50) UNIQUE NOT NULL,
			email VARCHAR(255) UNIQUE NOT NULL,
			password_hash VARCHAR(255) NOT NULL,
			phone_number VARCHAR(20) DEFAULT NULL,
			country_code VARCHAR(5) DEFAULT NULL,
			is_active BOOLEAN DEFAULT TRUE,
			last_login TIMESTAMP NULL DEFAULT NULL,
			created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
			updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
			deleted_at TIMESTAMP NULL DEFAULT NULL,
			password_reset_token VARCHAR(255) DEFAULT NULL,
			password_reset_expiry TIMESTAMP NULL DEFAULT NULL,
			two_factor_secret VARCHAR(255) DEFAULT NULL,
			two_factor_enabled BOOLEAN DEFAULT FALSE
		)
	`;
	await db.query(sql);
}

async function down() {
	await db.query('DROP TABLE IF EXISTS superadmin');
}

module.exports = {
	up,
	down
};