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

        // Kur krijohet dergesa, porosia kalon ne "ne_dergim"
        await dergesatRepository.updatePorosiStatusi(data.porosi_id, 'ne_dergim');

        return dergesa;
    },

    updateStatusi: async (id, statusi, userId) => {
        const dergesa = await dergesatRepository.getById(id);
        if (!dergesa) {
            throw { status: 404, message: 'Dergesa nuk u gjet' };
        }

        await dergesatRepository.updateStatusi(id, statusi, userId);

        // Sinkronizo statusin e porosise sipas statusit te dergeses
        const porosiId = await dergesatRepository.getPorosiId(id);
        if (porosiId) {
            if (statusi === 'ne_rruge') {
                await dergesatRepository.updatePorosiStatusi(porosiId, 'ne_dergim');
            } else if (statusi === 'dorezuar') {
                await dergesatRepository.updatePorosiStatusi(porosiId, 'dorezuar');
            } else if (statusi === 'deshtuar') {
                await dergesatRepository.updatePorosiStatusi(porosiId, 'ne_pritje');
            }
        }

        return true;
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