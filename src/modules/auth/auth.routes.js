const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('./auth.controller');
const { validateRegister, validateLogin } = require('./auth.validation');

router.post('/register', validateRegister, registerUser);
router.post('/login', validateLogin, loginUser);

module.exports = router;