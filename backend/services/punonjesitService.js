const punonjesitRepository = require('../repositories/punonjesitRepository');

const punonjesitService = {
    getAll: async () => {
        return await punonjesitRepository.getAll();
    },

    getById: async (id) => {
        const punonjesi = await punonjesitRepository.getById(id);
        if (!punonjesi) {
            throw { status: 404, message: 'Punonjesi nuk u gjet' };
        }
        return punonjesi;
    },

    create: async (data, userId) => {
        return await punonjesitRepository.create({
            emri: data.emri,
            mbiemri: data.mbiemri,
            roli: data.roli,
            telefoni: data.telefoni || null,
            email: data.email || null,
            aktiv: data.aktiv !== undefined ? data.aktiv : true,
            created_by: userId
        });
    },

    update: async (id, data, userId) => {
        const punonjesi = await punonjesitRepository.getById(id);
        if (!punonjesi) {
            throw { status: 404, message: 'Punonjesi nuk u gjet' };
        }

        return await punonjesitRepository.update(id, {
            emri: data.emri,
            mbiemri: data.mbiemri,
            roli: data.roli,
            telefoni: data.telefoni || null,
            email: data.email || null,
            aktiv: data.aktiv !== undefined ? data.aktiv : true,
            updated_by: userId
        });
    },

    delete: async (id) => {
        const punonjesi = await punonjesitRepository.getById(id);
        if (!punonjesi) {
            throw { status: 404, message: 'Punonjesi nuk u gjet' };
        }
        return await punonjesitRepository.delete(id);
    },

    search: async (filters) => {
        return await punonjesitRepository.search(filters);
    }
};

module.exports = punonjesitService;