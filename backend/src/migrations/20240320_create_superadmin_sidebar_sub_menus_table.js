const db = require('../../db');

async function up() {
	const query = `
		CREATE TABLE IF NOT EXISTS superadmin_sidebar_sub_menus (
			id INT(11) NOT NULL AUTO_INCREMENT,
			superadmin_sidebar_menu_id INT(10) DEFAULT NULL,
			menu VARCHAR(500) DEFAULT NULL,
			\`key\` VARCHAR(500) DEFAULT NULL,
			lang_key VARCHAR(250) DEFAULT NULL,
			url TEXT DEFAULT NULL,
			level INT(5) DEFAULT NULL,
			access_permissions VARCHAR(500) DEFAULT NULL,
			permission_group_id INT(11) DEFAULT NULL,
			activate_controller VARCHAR(100) DEFAULT NULL COMMENT 'income',
			activate_methods VARCHAR(500) DEFAULT NULL COMMENT 'index,edit',
			addon_permission VARCHAR(100) DEFAULT NULL,
			is_active INT(1) DEFAULT 1,
			created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
			PRIMARY KEY (id),
			FOREIGN KEY (superadmin_sidebar_menu_id) REFERENCES superadmin_sidebar_menus(id)
		) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;
	`;
	
	try {
		await db.query(query);
		console.log('SuperAdmin Sidebar Sub Menus table created successfully');
	} catch (error) {
		console.error('Error creating superadmin_sidebar_sub_menus table:', error);
		throw error;
	}
}

async function down() {
	const query = 'DROP TABLE IF EXISTS superadmin_sidebar_sub_menus';
	
	try {
		await db.query(query);
		console.log('SuperAdmin Sidebar Sub Menus table dropped successfully');
	} catch (error) {
		console.error('Error dropping superadmin_sidebar_sub_menus table:', error);
		throw error;
	}
}

module.exports = {
	up,
	down
};