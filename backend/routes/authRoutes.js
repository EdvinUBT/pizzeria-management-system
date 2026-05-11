const express = require('express');
const router = express.Router();
const { register, login, refreshAccessToken, logout } = require('../controllers/authController');
const { validateRegister, validateLogin } = require('../middleware/validateMiddleware');

// POST /api/auth/register - Regjistrimi
router.post('/register', validateRegister, register);

// POST /api/auth/login - Login
router.post('/login', validateLogin, login);

// POST /api/auth/refresh-token - Rinovimi i tokenit
router.post('/refresh-token', refreshAccessToken);

// POST /api/auth/logout - Logout
router.post('/logout', logout);

module.exports = router;