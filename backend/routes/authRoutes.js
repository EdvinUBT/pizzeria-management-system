const express = require('express');
const router = express.Router();
const { register, login, refreshAccessToken, logout, logoutAll } = require('../controllers/authController');
const { verifyToken } = require('../middleware/authMiddleware');
const { validateRegister, validateLogin } = require('../middleware/validateMiddleware');

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Autentifikimi - Register, Login, Logout
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Regjistrimi i perdoruesit te ri
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - emri
 *               - mbiemri
 *               - email
 *               - password
 *             properties:
 *               emri:
 *                 type: string
 *                 example: Edvin
 *               mbiemri:
 *                 type: string
 *                 example: Test
 *               email:
 *                 type: string
 *                 example: edvin@test.com
 *               password:
 *                 type: string
 *                 example: Test1234!
 *               phone_number:
 *                 type: string
 *                 example: "044123456"
 *     responses:
 *       201:
 *         description: Perdoruesi u regjistrua me sukses
 *       400:
 *         description: Validimi deshtoi ose email ekziston
 */
router.post('/register', validateRegister, register);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Kyçja e perdoruesit
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: edvin@test.com
 *               password:
 *                 type: string
 *                 example: Test1234!
 *     responses:
 *       200:
 *         description: Login i suksesshem, kthen access token dhe refresh token
 *       401:
 *         description: Email ose fjalekalimi i gabuar
 */
router.post('/login', validateLogin, login);
//kur e bon /api/auth/login 
//qet /api/auth e merr prej server 
//tash /api/auth erdhem prej server i kena thone hajde ne authRoutes per ma shume menaxhim 
//kur na ja bojme /login serveri e lyp thote okej per kit pjese koka fjala 
//thote hajde te qikjo validateLogin hin 
//nese gjithecka eshte ne rregull ne validateLogin qe i ka shenu perdoruesi email dhe password 
// thote okej vazhdo tash te login controller aty ku eshte tamon kodi me verifiku a jon te dhanat e sakta prej databazes 
//tash edhe login u bo sukses dmth e ka bo sign jwt edhe tash ky vazhdon jwt ruhet si me thone ne memorie me qato te dhana 
//kur ja dergojna na access tokenin copy naj endpointi qysh ja dergojsha une dashboard 
/**
 * @swagger
 * /api/auth/refresh-token:
 *   post:
 *     summary: Rinovimi i access tokenit me refresh token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 example: "eyJhbGciOiJIUzI1NiIs..."
 *     responses:
 *       200:
 *         description: Token i ri u gjenerua me sukses
 *       401:
 *         description: Refresh tokeni i pavlefshem ose i skaduar
 */
router.post('/refresh-token', refreshAccessToken);

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Dalja nga sistemi (revokon refresh tokenin)
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *     responses:
 *       200:
 *         description: Logout i suksesshem
 */
router.post('/logout', logout);

/**
 * @swagger
 * /api/auth/logout-all:
 *   post:
 *     summary: Dalja nga te gjitha pajisjet
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Te gjitha tokenat u revokuan
 *       401:
 *         description: Tokeni mungon ose i pavlefshem
 */
router.post('/logout-all', verifyToken, logoutAll);

module.exports = router;