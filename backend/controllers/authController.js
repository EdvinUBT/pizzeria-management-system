const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// ==========================================
// REGJISTRIMI I PERDORUESIT
// ==========================================
const register = async (req, res) => {
    try {
        const { emri, mbiemri, email, password, phone_number } = req.body;

        // Kontrollo nese email ekziston
        const [existingUser] = await db.query(
            'SELECT id FROM users WHERE email = ?',
            [email]
        );

        if (existingUser.length > 0) {
            return res.status(400).json({
                sukses: false,
                mesazhi: 'Ky email eshte i regjistruar tashme!'
            });
        }

        // Enkripto fjalekalimin
        const salt = await bcrypt.genSalt(10);
        const password_hash = await bcrypt.hash(password, salt);

        // Shto perdoruesin ne databaze
        const [result] = await db.query(
            'INSERT INTO users (emri, mbiemri, email, password_hash, phone_number) VALUES (?, ?, ?, ?, ?)',
            [emri, mbiemri, email, password_hash, phone_number]
        );

        // Cakto rolin default "user"
        const [roleResult] = await db.query(
            'SELECT id FROM roles WHERE emertimi = ?',
            ['user']
        );

        if (roleResult.length > 0) {
            await db.query(
                'INSERT INTO user_roles (user_id, role_id) VALUES (?, ?)',
                [result.insertId, roleResult[0].id]
            );
        }

        res.status(201).json({
            sukses: true,
            mesazhi: 'Regjistrimi u krye me sukses!',
            userId: result.insertId
        });

    } catch (error) {
        console.error('Gabim gjate regjistrimit:', error);
        res.status(500).json({
            sukses: false,
            mesazhi: 'Gabim ne server gjate regjistrimit'
        });
    }
};

// ==========================================
// LOGIN I PERDORUESIT
// ==========================================
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Gjej perdoruesin me email
        const [users] = await db.query(
            'SELECT * FROM users WHERE email = ?',
            [email]
        );

        if (users.length === 0) {
            return res.status(401).json({
                sukses: false,
                mesazhi: 'Email ose fjalekalim i gabuar!'
            });
        }

        const user = users[0];

        // Kontrollo nese llogaria eshte e bllokuar
        if (user.statusi === 'bllokuar') {
            return res.status(403).json({
                sukses: false,
                mesazhi: 'Llogaria juaj eshte e bllokuar!'
            });
        }

        // Krahaso fjalekalimin
        const isMatch = await bcrypt.compare(password, user.password_hash);

        if (!isMatch) {
            // Rrit numrin e tentativave te deshtuar
            await db.query(
                'UPDATE users SET access_failed_count = access_failed_count + 1 WHERE id = ?',
                [user.id]
            );

            return res.status(401).json({
                sukses: false,
                mesazhi: 'Email ose fjalekalim i gabuar!'
            });
        }

        // Reseto tentativat e deshtuar
        await db.query(
            'UPDATE users SET access_failed_count = 0 WHERE id = ?',
            [user.id]
        );

        // Merr rolet e perdoruesit
        const [roles] = await db.query(
            `SELECT r.emertimi FROM roles r
             INNER JOIN user_roles ur ON r.id = ur.role_id
             WHERE ur.user_id = ?`,
            [user.id]
        );

        const userRoles = roles.map(r => r.emertimi);

        // Krijo Access Token
        const accessToken = jwt.sign(
            {
                id: user.id,
                email: user.email,
                roles: userRoles
            },
            process.env.JWT_SECRET,
            { expiresIn: '15m' }
        );

        // Krijo Refresh Token
        const refreshToken = jwt.sign(
            { id: user.id },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        // Ruaj refresh token ne databaze
        const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
        await db.query(
            'INSERT INTO refresh_tokens (user_id, token, expires) VALUES (?, ?, ?)',
            [user.id, refreshToken, expires]
        );

        res.json({
            sukses: true,
            mesazhi: 'Login u krye me sukses!',
            accessToken,
            refreshToken,
            perdoruesi: {
                id: user.id,
                emri: user.emri,
                mbiemri: user.mbiemri,
                email: user.email,
                roles: userRoles
            }
        });

    } catch (error) {
        console.error('Gabim gjate login:', error);
        res.status(500).json({
            sukses: false,
            mesazhi: 'Gabim ne server gjate login'
        });
    }
};

// ==========================================
// REFRESH TOKEN
// ==========================================
const refreshAccessToken = async (req, res) => {
    try {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            return res.status(401).json({
                sukses: false,
                mesazhi: 'Refresh token mungon!'
            });
        }

        // Kontrollo nese token ekziston ne databaze
        const [tokens] = await db.query(
            'SELECT * FROM refresh_tokens WHERE token = ? AND revoked IS NULL AND expires > NOW()',
            [refreshToken]
        );

        if (tokens.length === 0) {
            return res.status(403).json({
                sukses: false,
                mesazhi: 'Refresh token i pavlefshem ose i skaduar!'
            });
        }

        // Verifiko tokenin
        const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);

        // Merr rolet
        const [roles] = await db.query(
            `SELECT r.emertimi FROM roles r
             INNER JOIN user_roles ur ON r.id = ur.role_id
             WHERE ur.user_id = ?`,
            [decoded.id]
        );

        const userRoles = roles.map(r => r.emertimi);

        // Krijo access token te ri
        const [users] = await db.query('SELECT * FROM users WHERE id = ?', [decoded.id]);
        const user = users[0];

        const newAccessToken = jwt.sign(
            {
                id: user.id,
                email: user.email,
                roles: userRoles
            },
            process.env.JWT_SECRET,
            { expiresIn: '15m' }
        );

        res.json({
            sukses: true,
            accessToken: newAccessToken
        });

    } catch (error) {
        console.error('Gabim gjate refresh token:', error);
        res.status(500).json({
            sukses: false,
            mesazhi: 'Gabim ne server'
        });
    }
};

// ==========================================
// LOGOUT
// ==========================================
const logout = async (req, res) => {
    try {
        const { refreshToken } = req.body;

        // Revoko refresh tokenin
        await db.query(
            'UPDATE refresh_tokens SET revoked = NOW() WHERE token = ?',
            [refreshToken]
        );

        res.json({
            sukses: true,
            mesazhi: 'Logout u krye me sukses!'
        });

    } catch (error) {
        console.error('Gabim gjate logout:', error);
        res.status(500).json({
            sukses: false,
            mesazhi: 'Gabim ne server'
        });
    }
};

module.exports = { register, login, refreshAccessToken, logout };