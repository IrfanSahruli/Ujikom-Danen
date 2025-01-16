const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

protect = (roles = []) => {
    return (req, res, next) => {
        const token = req.cookies.token;

        if (!token) {
            return res.status(401).json({ message: 'Login dulu guys' });
        }

        try {
            const decoded = jwt.verify(token, process.env.SECRET_KEY);
            req.user = decoded;

            if (roles.length && !roles.includes(req.user.role)) {
                return res.status(403).json({ message: 'Akses tidak diizinkan' });
            }

            next();
        } catch (error) {
            res.status(401).json({ message: error.message });
        }
    };
};

module.exports = protect;
