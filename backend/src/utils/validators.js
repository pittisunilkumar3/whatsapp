/**
 * Utility functions for input validation
 */

/**
 * Validates a date range to ensure start_date is before end_date
 * @param {string} start_date - Start date in YYYY-MM-DD format
 * @param {string} end_date - End date in YYYY-MM-DD format
 * @throws {Error} If dates are invalid or start_date is after end_date
 */
function validateDateRange(start_date, end_date) {
    const startDate = new Date(start_date);
    const endDate = new Date(end_date);

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        throw new Error('Invalid date format. Use YYYY-MM-DD format');
    }

    if (startDate > endDate) {
        throw new Error('Start date must be before end date');
    }
}

/**
 * Validates pagination parameters
 * @param {number|string} limit - Number of records to return
 * @param {number|string} offset - Number of records to skip
 * @throws {Error} If limit or offset are invalid
 */
function validatePagination(limit, offset) {
    const numLimit = Number(limit);
    const numOffset = Number(offset);

    if (isNaN(numLimit) || numLimit <= 0) {
        throw new Error('Limit must be a positive number');
    }

    if (isNaN(numOffset) || numOffset < 0) {
        throw new Error('Offset must be a non-negative number');
    }

    if (numLimit > 100) {
        throw new Error('Limit cannot exceed 100 records');
    }
}

module.exports = {
    validateDateRange,
    validatePagination
}; 