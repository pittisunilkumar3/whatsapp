const mysql = require('mysql2');
require('dotenv').config();

// First create a connection without database selection
const initialPool = mysql.createPool({
	host: process.env.DB_HOST,
	user: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	waitForConnections: true,
	connectionLimit: 10,
	queueLimit: 0
});

const initializeDatabase = async () => {
	try {
		const promisePool = initialPool.promise();
		await promisePool.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME}\``);
		console.log('Database created or already exists');
	} catch (error) {
		console.error('Error creating database:', error);
		throw error;
	}
};

// Create the main connection pool with database selected
const pool = mysql.createPool({
	host: process.env.DB_HOST,
	user: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	database: process.env.DB_NAME,
	waitForConnections: true,
	connectionLimit: 10,
	queueLimit: 0
});

// Initialize database before exporting
initializeDatabase()
	.then(() => console.log('Database initialization completed'))
	.catch(err => {
		console.error('Failed to initialize database:', err);
		process.exit(1);
	});

module.exports = pool.promise();