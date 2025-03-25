/**
 * Middleware to check if the user has one of the allowed roles.
 * @param {Array<string>} allowedRoles - An array of allowed roles.
 * @returns {Function} - The middleware function.
 */
const roleMiddleware = (allowedRoles) => {
    /**
     * Middleware function to check user privileges.
     * @param {Object} req - The request object.
     * @param {Object} res - The response object.
     * @param {Function} next - The next middleware function.
     */
    return (req, res, next) => {
        console.log(req.user);
        if (!req.user || !allowedRoles.includes(req.user.privilege)) {
            return res.status(403).json({ error: 'Access denied. Insufficient privileges.' });
        }
        // console.log(req.user.privilage);
        next();
    };
};

module.exports = roleMiddleware;
