const db = require('../../db');

async function up() {
	const query = `
		CREATE TABLE IF NOT EXISTS superadmin_roles_permissions (
			id INT PRIMARY KEY AUTO_INCREMENT,
			role_id INT DEFAULT NULL,
			superadmin_sidebar_menu_id INT NOT NULL,
			superadmin_sidebar_sub_menu_id INT NOT NULL,
			can_view INT DEFAULT NULL,
			can_add INT DEFAULT NULL,
			can_edit INT DEFAULT NULL,
			can_delete INT DEFAULT NULL,
			created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
			FOREIGN KEY (role_id) REFERENCES roles(id),
			FOREIGN KEY (superadmin_sidebar_menu_id) REFERENCES superadmin_sidebar_menus(id),
			FOREIGN KEY (superadmin_sidebar_sub_menu_id) REFERENCES superadmin_sidebar_sub_menus(id)
		) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;
	`;
	
	try {
		await db.query(query);
		console.log('Superadmin roles permissions table created successfully');
	} catch (error) {
		console.error('Error creating superadmin roles permissions table:', error);
		throw error;
	}
}

async function down() {
	const query = 'DROP TABLE IF EXISTS superadmin_roles_permissions';
	
	try {
		await db.query(query);
		console.log('Superadmin roles permissions table dropped successfully');
	} catch (error) {
		console.error('Error dropping superadmin roles permissions table:', error);
		throw error;
	}
}

module.exports = {
	up,
	down
};