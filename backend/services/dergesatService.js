const dergesatRepository = require('../repositories/dergesatRepository');

const dergesatService = {
    getAll: async () => {
        return await dergesatRepository.getAll();
    },

    getById: async (id) => {
        const dergesa = await dergesatRepository.getById(id);
        if (!dergesa) {
            throw { status: 404, message: 'Dergesa nuk u gjet' };
        }
        return dergesa;
    },

    create: async (data, userId) => {
        const dergesa = await dergesatRepository.create({
            porosi_id: data.porosi_id,
            punonjes_id: data.punonjes_id,
            adresa: data.adresa || null,
            created_by: userId
        });

        await dergesatRepository.updatePorosiStatusi(data.porosi_id, 'ne_dergim');

        return dergesa;
    },

    updateStatusi: async (id, statusi, userId) => {
        const dergesa = await dergesatRepository.getById(id);
        if (!dergesa) {
            throw { status: 404, message: 'Dergesa nuk u gjet' };
        }

        const updated = await dergesatRepository.updateStatusi(id, statusi, userId);

        if (statusi === 'dorezuar') {
            const porosiId = await dergesatRepository.getPorosiId(id);
            if (porosiId) {
                await dergesatRepository.updatePorosiStatusi(porosiId, 'dorezuar');
            }
        }

        return updated;
    },

    delete: async (id) => {
        const dergesa = await dergesatRepository.getById(id);
        if (!dergesa) {
            throw { status: 404, message: 'Dergesa nuk u gjet' };
        }
        return await dergesatRepository.delete(id);
    }
};

module.exports = dergesatService;