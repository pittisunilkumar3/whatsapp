const db = require('../../db');

async function up() {
	const query = `
		CREATE TABLE IF NOT EXISTS company_roles_permissions (
			id INT PRIMARY KEY AUTO_INCREMENT,
			company_id INT NOT NULL,
			company_roles_role_id INT DEFAULT NULL,
			sidebar_menu_id INT NOT NULL,
			sidebar_sub_menu_id INT NOT NULL,
			can_view INT DEFAULT NULL,
			can_add INT DEFAULT NULL,
			can_edit INT DEFAULT NULL,
			can_delete INT DEFAULT NULL,
			created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
			FOREIGN KEY (company_id) REFERENCES companies(id),
			FOREIGN KEY (company_roles_role_id) REFERENCES company_roles(id),
			FOREIGN KEY (sidebar_menu_id) REFERENCES sidebar_menus(id),
			FOREIGN KEY (sidebar_sub_menu_id) REFERENCES sidebar_sub_menus(id)
		) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;
	`;
	
	try {
		await db.query(query);
		console.log('Company roles permissions table created successfully');
	} catch (error) {
		console.error('Error creating company roles permissions table:', error);
		throw error;
	}
}

async function down() {
	const query = 'DROP TABLE IF EXISTS company_roles_permissions';
	
	try {
		await db.query(query);
		console.log('Company roles permissions table dropped successfully');
	} catch (error) {
		console.error('Error dropping company roles permissions table:', error);
		throw error;
	}
}

module.exports = {
	up,
	down
};