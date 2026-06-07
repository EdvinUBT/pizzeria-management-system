const perberesitRepository = require('../repositories/perberesitRepository');

const perberesitService = {
    getAll: async () => {
        return await perberesitRepository.getAll();
    },

    getById: async (id) => {
        const perberesi = await perberesitRepository.getById(id);
        if (!perberesi) {
            throw { status: 404, message: 'Perberesi nuk u gjet' };
        }
        return perberesi;
    },

    create: async (data, userId) => {
        return await perberesitRepository.create({
            emri_perberesit: data.emri_perberesit,
            njesia_matese: data.njesia_matese || null,
            sasia_stok: data.sasia_stok || 0,
            cmimi_shtese: data.cmimi_shtese || 0,
            alergjene: data.alergjene || null,
            created_by: userId
        });
    },

    update: async (id, data, userId) => {
        const perberesi = await perberesitRepository.getById(id);
        if (!perberesi) {
            throw { status: 404, message: 'Perberesi nuk u gjet' };
        }

        return await perberesitRepository.update(id, {
            emri_perberesit: data.emri_perberesit,
            njesia_matese: data.njesia_matese || null,
            sasia_stok: data.sasia_stok || 0,
            cmimi_shtese: data.cmimi_shtese || 0,
            alergjene: data.alergjene || null,
            updated_by: userId
        });
    },

    delete: async (id) => {
        const perberesi = await perberesitRepository.getById(id);
        if (!perberesi) {
            throw { status: 404, message: 'Perberesi nuk u gjet' };
        }
        return await perberesitRepository.delete(id);
    }
};

module.exports = perberesitService;