const db = require('./db');
const runMigrations = require('./src/migrations/migrationRunner');
require('dotenv').config();

(async () => {
	try {
		console.log('Starting migrations...');
		await runMigrations();
		console.log('Migrations completed successfully');
		process.exit(0);
	} catch (error) {
		console.error('Migration failed:', error);
		process.exit(1);
	}
})();
