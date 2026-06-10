const rolesRepository = require('../repositories/rolesRepository');

const rolesService = {
    getAll: async () => {
        return await rolesRepository.getAll();
    },

    getById: async (id) => {
        const roli = await rolesRepository.getById(id);
        if (!roli) {
            throw { status: 404, message: 'Roli nuk u gjet' };
        }
        return roli;
    },

    create: async (data, userId) => {
        const existing = await rolesRepository.getByEmertimi(data.emertimi);
        if (existing) {
            throw { status: 400, message: 'Ky rol ekziston tashme!' };
        }

        return await rolesRepository.create({
            emertimi: data.emertimi,
            pershkrimi: data.pershkrimi || null,
            normalized_name: data.emertimi.toUpperCase(),
            created_by: userId
        });
    },

    update: async (id, data, userId) => {
        const roli = await rolesRepository.getById(id);
        if (!roli) {
            throw { status: 404, message: 'Roli nuk u gjet' };
        }

        return await rolesRepository.update(id, {
            emertimi: data.emertimi,
            pershkrimi: data.pershkrimi || null,
            normalized_name: data.emertimi.toUpperCase(),
            updated_by: userId
        });
    },

    delete: async (id) => {
        const roli = await rolesRepository.getById(id);
        if (!roli) {
            throw { status: 404, message: 'Roli nuk u gjet' };
        }
        return await rolesRepository.delete(id);
    }
};

module.exports = rolesService;