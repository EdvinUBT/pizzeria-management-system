const bcrypt = require('bcryptjs');
const usersRepository = require('../repositories/usersRepository');

const usersService = {
    getAll: async () => {
        return await usersRepository.getAll();
    },

    getById: async (id) => {
        const user = await usersRepository.getById(id);
        if (!user) {
            throw { status: 404, message: 'Perdoruesi nuk u gjet' };
        }
        return user;
    },

    create: async (data, userId) => {
        const existing = await usersRepository.getByEmail(data.email);
        if (existing) {
            throw { status: 400, message: 'Ky email eshte i regjistruar tashme!' };
        }

        const salt = await bcrypt.genSalt(10);
        const password_hash = await bcrypt.hash(data.password, salt);

        return await usersRepository.create({
            emri: data.emri,
            mbiemri: data.mbiemri,
            email: data.email,
            password_hash,
            phone_number: data.phone_number || null,
            statusi: data.statusi || 'aktiv',
            created_by: userId
        });
    },

    update: async (id, data, userId) => {
        const user = await usersRepository.getById(id);
        if (!user) {
            throw { status: 404, message: 'Perdoruesi nuk u gjet' };
        }

        return await usersRepository.update(id, {
            emri: data.emri,
            mbiemri: data.mbiemri,
            email: data.email,
            phone_number: data.phone_number || null,
            statusi: data.statusi || 'aktiv',
            updated_by: userId
        });
    },

    ndryshStatusin: async (id, statusi, userId) => {
        const user = await usersRepository.getById(id);
        if (!user) {
            throw { status: 404, message: 'Perdoruesi nuk u gjet' };
        }
        return await usersRepository.updateStatusi(id, statusi, userId);
    },

    delete: async (id) => {
        const user = await usersRepository.getById(id);
        if (!user) {
            throw { status: 404, message: 'Perdoruesi nuk u gjet' };
        }
        return await usersRepository.delete(id);
    }
};

module.exports = usersService;