const bcrypt = require('bcryptjs');
const klientetRepository = require('../repositories/klientetRepository');

const klientetService = {
    getAll: async () => {
        return await klientetRepository.getAll();
    },

    getById: async (id) => {
        const klienti = await klientetRepository.getById(id);
        if (!klienti) {
            throw { status: 404, message: 'Klienti nuk u gjet' };
        }
        return klienti;
    },

    create: async (data, userId) => {
        const existing = await klientetRepository.getByEmail(data.email);
        if (existing) {
            throw { status: 400, message: 'Ky email eshte i regjistruar tashme!' };
        }

        const salt = await bcrypt.genSalt(10);
        const fjalekalimi_hash = await bcrypt.hash(data.fjalekalimi, salt);

        return await klientetRepository.create({
            emri: data.emri,
            mbiemri: data.mbiemri,
            email: data.email,
            telefoni: data.telefoni || null,
            adresa: data.adresa || null,
            fjalekalimi_hash,
            created_by: userId
        });
    },

    update: async (id, data, userId) => {
        const klienti = await klientetRepository.getById(id);
        if (!klienti) {
            throw { status: 404, message: 'Klienti nuk u gjet' };
        }

        return await klientetRepository.update(id, {
            emri: data.emri,
            mbiemri: data.mbiemri,
            email: data.email,
            telefoni: data.telefoni || null,
            adresa: data.adresa || null,
            updated_by: userId
        });
    },

    delete: async (id) => {
        const klienti = await klientetRepository.getById(id);
        if (!klienti) {
            throw { status: 404, message: 'Klienti nuk u gjet' };
        }
        return await klientetRepository.delete(id);
    }
};

module.exports = klientetService;