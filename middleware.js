const jwt = require('jsonwebtoken');

//this is the authentication and authorization middleware
const authenticateUser = (req, res, next) => {
    const token = req.headers.authorization;

    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Unauthorized'
        });
    }
    try {
        const decodedToken = jwt.verify(token, 'secret');
        req.user = decodedToken;
        next();
    } catch (error) {
        console.error(error);
        res.status(401).json({
            success: false,
            message: 'Invalid Token'
        });
    };
};

const authorizeUser = (req, res) => { //this piece of code requires work
    res.status(200).json({
        success: true,
        message: 'You have accessed a protected resource'
    });
};

module.exports = { authenticateUser, authorizeUser };
