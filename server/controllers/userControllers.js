const User = require('../models/user');
const createToken = require('../services/crypto').createToken;
const userServices = require('../services/db/user');

// function register - service required = createUserService

const register = async (req, res) => {
    try {
        const user = {
            name: req.body.name,
            username: req.body.username,
            password: hash_password,
        };

        const newUser = await userServices.createUserService(user);

        if (!newUser.created) {
            return res.status(400).json({
                error: true,
                message: newUser.message
            });
        }

        // if user created
        const token = createToken({
            _id: newUser.user._id,
            name: newUser.user.name,
            username: newUser.user.username,
        });

        return res.status(201).json({
            error: false,
            token,
            username: newUser.user.username
        });
    } catch (err) {
        return res.status(400).json({
            error: true,
            message: err
        });
    }
}

// function login - service required = userLoginService

const login = async (req, res) => {
    try {
        // needs on username and password
        if (!req.body.username || !req.body.password) {
            return res.status(400).json({
                error: true,
                message: "username and password required"
            });
        }

        const login = await userServices.userLoginService(req.body);

        if (!login.login) {
            return res.status(400).json({
                error: true,
                message: login.message
            });
        }

        // if login goes through
        const token = createToken({
            _id: login.user._id,
            name: login.user.name,
            username: login.user.username,
        });
        return res.status(200).json({
            error: false,
            token,
            username: login.user.username
        });
    } catch (err) {
        return res.status(400).json({
            error: true,
            message: err.message
        });
    }
}

module.exports = {
    register,
    login
}