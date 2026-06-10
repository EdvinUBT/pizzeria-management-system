const kategoriteRepository = require('../repositories/kategoriteRepository');

const kategoriteService = {
    getAll: async () => {
        return await kategoriteRepository.getAll();
    },

    getById: async (id) => {
        const kategoria = await kategoriteRepository.getById(id);
        if (!kategoria) {
            throw { status: 404, message: 'Kategoria nuk u gjet' };
        }
        return kategoria;
    },

    create: async (data, userId) => {
        return await kategoriteRepository.create({
            emri_kategorise: data.emri_kategorise,
            pershkrimi: data.pershkrimi || null,
            renditja: data.renditja || 0,
            aktive: data.aktive !== undefined ? data.aktive : true,
            created_by: userId
        });
    },

    update: async (id, data, userId) => {
        const kategoria = await kategoriteRepository.getById(id);
        if (!kategoria) {
            throw { status: 404, message: 'Kategoria nuk u gjet' };
        }

        const updated = await kategoriteRepository.update(id, {
            emri_kategorise: data.emri_kategorise,
            pershkrimi: data.pershkrimi || null,
            renditja: data.renditja || 0,
            aktive: data.aktive !== undefined ? data.aktive : true,
            updated_by: userId
        });

        return updated;
    },

    delete: async (id) => {
        const kategoria = await kategoriteRepository.getById(id);
        if (!kategoria) {
            throw { status: 404, message: 'Kategoria nuk u gjet' };
        }

        return await kategoriteRepository.delete(id);
    }
};

module.exports = kategoriteService;