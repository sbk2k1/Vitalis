const Router = require('express').Router;
const router = Router();

// user controllers

const userControllers = require('../controllers/userControllers');

// user login
router.post('/login', userControllers.login);

// user register
router.post('/register', userControllers.register);

module.exports = router;