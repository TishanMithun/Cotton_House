// roleMiddleware.js

const authorizeRoles = (...allowedRoles) => {
    return (req, res, next) => {
        console.log("AuthorizeRoles - req.user:", req.user);
        if (!req.user || !allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: 'You are not allowed to access this route'
            });
        }
        next();
    };
};

export default authorizeRoles;
