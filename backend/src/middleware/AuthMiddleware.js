const jwt = require('jsonwebtoken');

const validateToken = (req, res, next) => {
	const accessToken = req.header("accessToken");

	if (!accessToken) {
		return res.status(401).json({ error: "User not authenticated!" });
	}

	try {
		const validToken = jwt.verify(accessToken, process.env.JWT_SECRET);
		req.user = validToken;
		if (validToken) {
			return next();
		}
	} catch (err) {
		return res.status(401).json({ error: err.message });
	}
};

module.exports = { validateToken };
