const db = require('../../db');
const bcrypt = require('bcrypt');

class SuperAdmin {
	static async findById(id) {
		const [rows] = await db.query('SELECT * FROM superadmin WHERE id = ? AND deleted_at IS NULL', [id]);
		return rows[0];
	}

	static async findByEmail(email) {
		console.log('Finding superadmin by email:', email);
		const query = 'SELECT * FROM superadmin WHERE email = ? AND deleted_at IS NULL';
		console.log('Query:', query);
		const [rows] = await db.query(query, [email]);
		console.log('Query result:', rows);
		return rows[0];
	}

	static async create(data) {
		const { first_name, last_name, username, email, password, phone_number, country_code } = data;
		const password_hash = await bcrypt.hash(password, 10);
		
		const [result] = await db.query(
			'INSERT INTO superadmin (first_name, last_name, username, email, password_hash, phone_number, country_code) VALUES (?, ?, ?, ?, ?, ?, ?)',
			[first_name, last_name, username, email, password_hash, phone_number, country_code]
		);
		return result.insertId;
	}

	static async update(id, data) {
		const updates = [];
		const values = [];
		
		Object.keys(data).forEach(key => {
			if (data[key] !== undefined) {
				updates.push(`${key} = ?`);
				values.push(data[key]);
			}
		});
		
		values.push(id);
		const [result] = await db.query(
			`UPDATE superadmin SET ${updates.join(', ')} WHERE id = ?`,
			values
		);
		return result.affectedRows > 0;
	}

	static async delete(id) {
		const [result] = await db.query(
			'DELETE FROM superadmin WHERE id = ?',
			[id]
		);
		return result.affectedRows > 0;
	}

	static async updateLastLogin(id) {
		const [result] = await db.query(
			'UPDATE superadmin SET last_login = CURRENT_TIMESTAMP WHERE id = ?',
			[id]
		);
		return result.affectedRows > 0;
	}

	static async verifyPassword(superadmin, password) {
		return bcrypt.compare(password, superadmin.password_hash);
	}
}

module.exports = SuperAdmin;