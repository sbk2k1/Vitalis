const User = require('../models/user');
const createToken = require('../services/crypto').createToken;
const bcrypt = require('bcrypt');

// function register - service required = createUserService

const register = async (req, res) => {
    try {
        console.log("request received")
        // hash the password
        const hash_password = await bcrypt.hash(req.body.password, 10);

        const user = new User({
            name: req.body.name,
            username: req.body.username,
            password: hash_password,
        });
        const newUser = await user.save();
        const token = createToken({
            _id: newUser._id,
            name: newUser.name,
            username: newUser.username,
        });
        return res.status(201).json({ token, username: newUser.username });
    } catch (err) {
        return res.status(400).json({ message: err });
    }
}

// function login - service required = userLoginService

const login = async (req, res) => {
    console.log("login request received")
    try {
        // needs on username and password
        if (!req.body.username || !req.body.password) {
            return res.status(400).json({ message: "username and password required" });
        }
        // find user by username
        const user = await User.findOne({ username: req.body.username });
        // if user not found
        if (!user) {
            return res.status(400).json({ message: "user not found" });
        }
        // compare password
        const isMatch = await bcrypt.compare(req.body.password, user.password);
        // if password does not match
        if (!isMatch) {
            return res.status(400).json({ message: "wrong password" });
        }
        // if password matches
        const token = createToken({
            _id: user._id,
            name: user.name,
            username: user.username,
        });
        return res.status(200).json({ token, username: user.username });
    } catch (err) {
        return res.status(400).json({ message: err.message });
    }
}

module.exports = {
    register,
    login
}