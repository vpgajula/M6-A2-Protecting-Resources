const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { authenticateUser, authorizeUser } = require('../middleware');

exports.register = async (req, res) => {
    try {
        const { email, password, role } = req.body;

        User.create({
            email: email,
            password: password,
            role: role
        }).then(user => res.json({
            success: true,
            message: 'User registered successfully',
            user
        }));
    } catch (error) {
        console.log(error);
        const errors = validationResult(req);
        const errorDetails = [
            {
                "location": "Register",
                "msg": ` ${email} ${error}`,
                "param": email
            }
        ];
        res.json({ errors: errorDetails });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'Invalid email or password'
            });
        };

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: 'Invalid email or password'
            });
        };

        const token = jwt.sign({ userId: user._id, role: user.role }, 'secret', {
            expiresIn: '10d' //process.env.JWT_EXPIRES_IN
        });

        const cookieOptions = {
            expires: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
            httpOnly: true
        };

        res.cookie('jwt', token, cookieOptions);

        res.json({
            success: true,
            token
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'An error occured'
        });
    }
};

exports.protected = async (req, res, next) => {

    const authHeader = req.headers.authorization;
    console.log(`Token is: ${authHeader}`);

    try {
        //const jsonToken = JSON.parse(atob(token.split('.')[1])) //this option works
        // const [tokenType, base64Token] = token.split('='); //this option works
        // const jsonToken = JSON.parse(
        //     Buffer.from(token.split('.')[1], 'base64').toString('utf-8')
        // );
        const decodedToken = await jwt.verify(authHeader, 'secret'); //this option works
        const { userId, role } = decodedToken;
        // const { role } = req.user;
        // console.log(`Role is : ${role}`);

        if (role === "admin") {
            res.json({
                role: role,
                success: true,
                message: 'You have accessed a protected resource'
            });
            next();
        } else {
            res.status(403).json({ // Return 403 Forbidden status code if the user is not an admin
                role: role,
                success: false,
                message: 'You are not authorized to access this resource'
            });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'An error occurred'
        });
    };
};
