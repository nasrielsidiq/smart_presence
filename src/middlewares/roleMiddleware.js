/**
 * Middleware to check if the user has one of the allowed roles.
 * @param {Array<string>} allowedRoles - An array of allowed roles.
 * @returns {Function} - The middleware function.
 */
const roleMiddleware = (allowedRoles) => {
    return (req, res, next) => {
        if (!req.user || !allowedRoles.includes(req.user.privilege)) {
            return res.status(403).json({ error: 'Access denied. Insufficient privileges.' });
        }
        next();
    };
};

module.exports = roleMiddleware;
