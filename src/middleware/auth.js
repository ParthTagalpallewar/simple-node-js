const authMiddleware = (req, res, next) => {

    // Check whether user has a session
    if (!req.session.userId) {
        return res.status(401).json({
            message: "You must login first"
        });
    }

    // User is authenticated
    next();
};

module.exports = authMiddleware;