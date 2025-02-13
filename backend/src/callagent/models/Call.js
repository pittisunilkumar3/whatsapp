const db = require('../../../db');

class Call {
	static async create(callData) {
		const query = `INSERT INTO calls SET ?`;
		return db.query(query, [callData]);
	}

	static async findById(callId) {
		const query = `SELECT * FROM calls WHERE call_id = ?`;
		return db.query(query, [callId]);
	}

	static async findByCompany(companyId) {
		const query = `SELECT * FROM calls WHERE company_id = ?`;
		return db.query(query, [companyId]);
	}

	static async findByAgent(agentId) {
		const query = `SELECT * FROM calls WHERE call_agent_id = ?`;
		return db.query(query, [agentId]);
	}

	static async findByLead(leadId) {
		const query = `SELECT * FROM calls WHERE call_lead_id = ?`;
		return db.query(query, [leadId]);
	}

	static async findAll(filters = {}) {
		let query = `SELECT * FROM calls WHERE 1=1`;
		const values = [];

		if (filters.company_id) {
			query += ` AND company_id = ?`;
			values.push(filters.company_id);
		}

		if (filters.call_agent_id) {
			query += ` AND call_agent_id = ?`;
			values.push(filters.call_agent_id);
		}

		if (filters.call_lead_id) {
			query += ` AND call_lead_id = ?`;
			values.push(filters.call_lead_id);
		}

		return db.query(query, values);
	}

	static async update(callId, callData) {
		const query = `UPDATE calls SET ? WHERE call_id = ?`;
		return db.query(query, [callData, callId]);
	}

	static async delete(callId) {
		const query = `DELETE FROM calls WHERE call_id = ?`;
		return db.query(query, [callId]);
	}

	static async updateOutcome(callId, outcome) {
		const query = `UPDATE calls SET call_outcome = ? WHERE call_id = ?`;
		return db.query(query, [outcome, callId]);
	}

	static async scheduleFollowUp(callId, followUpDate, followUpTime) {
		const query = `UPDATE calls SET follow_up_date = ?, follow_up_time = ? WHERE call_id = ?`;
		return db.query(query, [followUpDate, followUpTime, callId]);
	}
}

module.exports = Call;