const db = require('../../../db');

class CallReport {
	static async create(reportData) {
		const query = `INSERT INTO call_reports SET ?`;
		return db.query(query, [reportData]);
	}

	static async findById(reportId) {
		const query = `SELECT * FROM call_reports WHERE report_id = ?`;
		return db.query(query, [reportId]);
	}

	static async findByCompany(companyId) {
		const query = `SELECT * FROM call_reports WHERE company_id = ?`;
		return db.query(query, [companyId]);
	}

	static async findByCampaign(campaignId) {
		const query = `SELECT * FROM call_reports WHERE campaign_id = ?`;
		return db.query(query, [campaignId]);
	}

	static async findAll(filters = {}) {
		let query = `SELECT * FROM call_reports WHERE 1=1`;
		const values = [];

		if (filters.company_id) {
			query += ` AND company_id = ?`;
			values.push(filters.company_id);
		}

		if (filters.campaign_id) {
			query += ` AND campaign_id = ?`;
			values.push(filters.campaign_id);
		}

		if (filters.report_date) {
			query += ` AND report_date = ?`;
			values.push(filters.report_date);
		}

		if (filters.report_type) {
			query += ` AND report_type = ?`;
			values.push(filters.report_type);
		}

		if (filters.is_active !== undefined) {
			query += ` AND is_active = ?`;
			values.push(filters.is_active);
		}

		return db.query(query, values);
	}

	static async update(reportId, reportData) {
		const query = `UPDATE call_reports SET ? WHERE report_id = ?`;
		return db.query(query, [reportData, reportId]);
	}

	static async delete(reportId) {
		const query = `DELETE FROM call_reports WHERE report_id = ?`;
		return db.query(query, [reportId]);
	}

	static async toggleActive(reportId, isActive) {
		const query = `UPDATE call_reports SET is_active = ? WHERE report_id = ?`;
		return db.query(query, [isActive, reportId]);
	}
}

module.exports = CallReport;