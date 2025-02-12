const db = require('../../db');

async function up() {
	const query = `
		CREATE TABLE IF NOT EXISTS superadmin_sidebar_menus (
			id INT(11) NOT NULL AUTO_INCREMENT,
			permission_group_id INT(10) DEFAULT NULL,
			icon VARCHAR(100) DEFAULT NULL,
			menu VARCHAR(500) DEFAULT NULL,
			activate_menu VARCHAR(100) DEFAULT NULL,
			lang_key VARCHAR(250) NOT NULL,
			system_level INT(3) DEFAULT 0,
			level INT(5) DEFAULT NULL,
			sidebar_display INT(1) DEFAULT 0,
			access_permissions TEXT DEFAULT NULL,
			is_active INT(1) NOT NULL DEFAULT 1,
			created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
			PRIMARY KEY (id)
		) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;
	`;
	
	try {
		await db.query(query);
		console.log('SuperAdmin Sidebar Menus table created successfully');
	} catch (error) {
		console.error('Error creating superadmin_sidebar_menus table:', error);
		throw error;
	}
}

async function down() {
	const query = 'DROP TABLE IF EXISTS superadmin_sidebar_menus';
	
	try {
		await db.query(query);
		console.log('SuperAdmin Sidebar Menus table dropped successfully');
	} catch (error) {
		console.error('Error dropping superadmin_sidebar_menus table:', error);
		throw error;
	}
}

module.exports = {
	up,
	down
};