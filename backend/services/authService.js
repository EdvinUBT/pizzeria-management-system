const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authRepository = require('../repositories/authRepository');

const authService = {
    register: async (data) => {
        const existing = await authRepository.getUserByEmail(data.email);
        if (existing) {
            throw { status: 400, message: 'Ky email eshte i regjistruar tashme!' };
        }

        const salt = await bcrypt.genSalt(10);
        const password_hash = await bcrypt.hash(data.password, salt);

        const user = await authRepository.createUser({
            emri: data.emri,
            mbiemri: data.mbiemri,
            email: data.email,
            password_hash,
            phone_number: data.phone_number || null
        });

        const role = await authRepository.getRoleByEmertimi('user');
        if (role) {
            await authRepository.assignRole(user.id, role.id);
        }

        await authRepository.createKlient({
            emri: data.emri,
            mbiemri: data.mbiemri,
            email: data.email,
            telefoni: data.phone_number || '',
            fjalekalimi_hash: password_hash
        });

        return { userId: user.id };
    },

    login: async (email, password) => {
        const user = await authRepository.getUserByEmail(email);
        if (!user) {
            throw { status: 401, message: 'Email ose fjalekalim i gabuar!' };
        }

        if (user.statusi === 'bllokuar') {
            throw { status: 403, message: 'Llogaria juaj eshte e bllokuar!' };
        }

        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            await authRepository.incrementFailedAttempts(user.id);
            throw { status: 401, message: 'Email ose fjalekalim i gabuar!' };
        }

        await authRepository.resetFailedAttempts(user.id);

        const userRoles = await authRepository.getUserRoles(user.id);

        const accessToken = jwt.sign(
            { id: user.id, email: user.email, roles: userRoles },
            process.env.JWT_SECRET,
            { expiresIn: '15m' }
        );

        const refreshToken = jwt.sign(
            { id: user.id },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
        await authRepository.saveRefreshToken(user.id, refreshToken, expires);

        const klient = await authRepository.getKlientByEmail(user.email);

        return {
            accessToken,
            refreshToken,
            perdoruesi: {
                id: user.id,
                emri: user.emri,
                mbiemri: user.mbiemri,
                email: user.email,
                roles: userRoles,
                klient_id: klient?.klient_id || null
            }
        };
    },

    refreshAccessToken: async (refreshToken) => {
        if (!refreshToken) {
            throw { status: 401, message: 'Refresh token mungon!' };
        }

        const tokenRecord = await authRepository.getValidRefreshToken(refreshToken);
        if (!tokenRecord) {
            throw { status: 403, message: 'Refresh token i pavlefshem ose i skaduar!' };
        }

        const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
        const user = await authRepository.getUserById(decoded.id);
        const userRoles = await authRepository.getUserRoles(decoded.id);

        const newAccessToken = jwt.sign(
            { id: user.id, email: user.email, roles: userRoles },
            process.env.JWT_SECRET,
            { expiresIn: '15m' }
        );

        await authRepository.revokeRefreshToken(refreshToken);

        const newRefreshToken = jwt.sign(
            { id: decoded.id },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
        await authRepository.saveRefreshToken(decoded.id, newRefreshToken, expires);

        return { accessToken: newAccessToken, refreshToken: newRefreshToken };
    },

    logout: async (refreshToken) => {
        if (refreshToken) {
            await authRepository.revokeRefreshToken(refreshToken);
        }
    },

    logoutAll: async (userId) => {
        await authRepository.revokeAllRefreshTokens(userId);
    }
};

module.exports = authService;