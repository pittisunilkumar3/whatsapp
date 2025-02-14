const db = require('../../db');

async function up() {
	const query = `
		CREATE TABLE IF NOT EXISTS company_employee_roles (
			id INT PRIMARY KEY AUTO_INCREMENT,
			company_id INT NOT NULL,
			role_id INT DEFAULT NULL,
			staff_id INT DEFAULT NULL,
			is_active INT DEFAULT 0,
			created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
			updated_at DATE DEFAULT NULL,
			FOREIGN KEY (company_id) REFERENCES companies(id),
			FOREIGN KEY (role_id) REFERENCES company_roles(id),
			FOREIGN KEY (staff_id) REFERENCES staff(id)
		) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;
	`;
	
	try {
		await db.query(query);
		console.log('Company employee roles table created successfully');
	} catch (error) {
		console.error('Error creating company employee roles table:', error);
		throw error;
	}
}

async function down() {
	const query = 'DROP TABLE IF EXISTS company_employee_roles';
	
	try {
		await db.query(query);
		console.log('Company employee roles table dropped successfully');
	} catch (error) {
		console.error('Error dropping company employee roles table:', error);
		throw error;
	}
}

module.exports = {
	up,
	down
};
