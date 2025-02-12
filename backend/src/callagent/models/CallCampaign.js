const db = require('../../../db');

class CallCampaign {
	static async create(campaignData) {
		const query = `INSERT INTO call_campaigns SET ?`;
		return db.query(query, [campaignData]);
	}

	static async findById(campaignId) {
		const query = `SELECT * FROM call_campaigns WHERE campaign_id = ?`;
		return db.query(query, [campaignId]);
	}

	static async findByCompany(companyId) {
		const query = `SELECT * FROM call_campaigns WHERE company_id = ?`;
		return db.query(query, [companyId]);
	}

	static async findAll(filters = {}) {
		let query = `SELECT * FROM call_campaigns WHERE 1=1`;
		const values = [];

		if (filters.company_id) {
			query += ` AND company_id = ?`;
			values.push(filters.company_id);
		}

		if (filters.is_active !== undefined) {
			query += ` AND is_active = ?`;
			values.push(filters.is_active);
		}

		if (filters.completion_status) {
			query += ` AND completion_status = ?`;
			values.push(filters.completion_status);
		}

		return db.query(query, values);
	}

	static async update(campaignId, campaignData) {
		const query = `UPDATE call_campaigns SET ? WHERE campaign_id = ?`;
		return db.query(query, [campaignData, campaignId]);
	}

	static async delete(campaignId) {
		const query = `DELETE FROM call_campaigns WHERE campaign_id = ?`;
		return db.query(query, [campaignId]);
	}

	static async updateStatus(campaignId, status) {
		const query = `UPDATE call_campaigns SET completion_status = ? WHERE campaign_id = ?`;
		return db.query(query, [status, campaignId]);
	}

	static async toggleActive(campaignId, isActive) {
		const query = `UPDATE call_campaigns SET is_active = ? WHERE campaign_id = ?`;
		return db.query(query, [isActive, campaignId]);
	}
}

module.exports = CallCampaign;