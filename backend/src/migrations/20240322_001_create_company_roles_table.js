const db = require('../../db');

async function up() {
	const query = `
		CREATE TABLE IF NOT EXISTS company_roles (
			id INT PRIMARY KEY AUTO_INCREMENT,
			company_id INT NOT NULL,
			name VARCHAR(100) DEFAULT NULL,
			slug VARCHAR(150) DEFAULT NULL,
			is_active INT DEFAULT 0,
			is_system INT(1) NOT NULL DEFAULT 0,
			is_superadmin INT NOT NULL DEFAULT 0,
			created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
			updated_at DATE DEFAULT NULL,
			FOREIGN KEY (company_id) REFERENCES companies(id)
		) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;
	`;
	
	try {
		await db.query('SET FOREIGN_KEY_CHECKS = 0');
		await db.query(query);
		await db.query('SET FOREIGN_KEY_CHECKS = 1');
		console.log('Company roles table created successfully');
	} catch (error) {
		console.error('Error creating company roles table:', error);
		throw error;
	}
}

async function down() {
	const query = 'DROP TABLE IF EXISTS company_roles';
	
	try {
		await db.query('SET FOREIGN_KEY_CHECKS = 0');
		await db.query(query);
		await db.query('SET FOREIGN_KEY_CHECKS = 1');
		console.log('Company roles table dropped successfully');
	} catch (error) {
		console.error('Error dropping company roles table:', error);
		throw error;
	}
}

module.exports = {
	up,
	down
};