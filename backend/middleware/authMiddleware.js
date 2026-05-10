const jwt = require('jsonwebtoken');

// Middleware per te verifikuar JWT tokenin
const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({
            sukses: false,
            mesazhi: 'Qasja e refuzuar! Token mungon.'
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(403).json({
            sukses: false,
            mesazhi: 'Token i pavlefshem ose i skaduar!'
        });
    }
};

// Middleware per te verifikuar rolin
const verifyRole = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user || !req.user.roles) {
            return res.status(403).json({
                sukses: false,
                mesazhi: 'Qasja e refuzuar! Nuk keni rol te caktuar.'
            });
        }

        const hasRole = req.user.roles.some(role => allowedRoles.includes(role));

        if (!hasRole) {
            return res.status(403).json({
                sukses: false,
                mesazhi: 'Nuk keni autorizim per kete veprim!'
            });
        }

        next();
    };
};

module.exports = { verifyToken, verifyRole };