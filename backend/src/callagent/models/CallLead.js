const db = require('../../../db');

class CallLead {
	static async create(leadData) {
		const query = `INSERT INTO call_leads SET ?`;
		return db.query(query, [leadData]);
	}

	static async findById(leadId) {
		const query = `SELECT * FROM call_leads WHERE lead_id = ?`;
		return db.query(query, [leadId]);
	}

	static async findByCompany(companyId) {
		const query = `SELECT * FROM call_leads WHERE company_id = ?`;
		return db.query(query, [companyId]);
	}

	static async findByCampaign(campaignId) {
		const query = `SELECT * FROM call_leads WHERE campaign_id = ?`;
		return db.query(query, [campaignId]);
	}

	static async findAll(filters = {}) {
		let query = `SELECT * FROM call_leads WHERE 1=1`;
		const values = [];

		if (filters.company_id) {
			query += ` AND company_id = ?`;
			values.push(filters.company_id);
		}

		if (filters.campaign_id) {
			query += ` AND campaign_id = ?`;
			values.push(filters.campaign_id);
		}

		if (filters.assigned_agent_id) {
			query += ` AND assigned_agent_id = ?`;
			values.push(filters.assigned_agent_id);
		}

		if (filters.is_active !== undefined) {
			query += ` AND is_active = ?`;
			values.push(filters.is_active);
		}

		if (filters.lead_status) {
			query += ` AND lead_status = ?`;
			values.push(filters.lead_status);
		}

		return db.query(query, values);
	}

	static async update(leadId, leadData) {
		const query = `UPDATE call_leads SET ? WHERE lead_id = ?`;
		return db.query(query, [leadData, leadId]);
	}

	static async delete(leadId) {
		const query = `DELETE FROM call_leads WHERE lead_id = ?`;
		return db.query(query, [leadId]);
	}

	static async updateStatus(leadId, status) {
		const query = `UPDATE call_leads SET lead_status = ? WHERE lead_id = ?`;
		return db.query(query, [status, leadId]);
	}

	static async updateScore(leadId, score) {
		const query = `UPDATE call_leads SET lead_score = ?, lead_score_updated_at = CURRENT_TIMESTAMP WHERE lead_id = ?`;
		return db.query(query, [score, leadId]);
	}

	static async toggleActive(leadId, isActive) {
		const query = `UPDATE call_leads SET is_active = ? WHERE lead_id = ?`;
		return db.query(query, [isActive, leadId]);
	}
}

module.exports = CallLead;