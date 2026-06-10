const produktPerberesitRepository = require('../repositories/produktPerberesitRepository');

const produktPerberesitService = {
    getByProduktId: async (produktId) => {
        return await produktPerberesitRepository.getByProduktId(produktId);
    },

    create: async (produktId, data, userId) => {
        return await produktPerberesitRepository.create({
            produkt_id: produktId,
            perberes_id: data.perberes_id,
            sasia_standarde: data.sasia_standarde || 0,
            eshte_opsionale: data.eshte_opsionale || false,
            created_by: userId
        });
    },

    update: async (id, data, userId) => {
        const lidhja = await produktPerberesitRepository.getById(id);
        if (!lidhja) {
            throw { status: 404, message: 'Lidhja nuk u gjet' };
        }

        return await produktPerberesitRepository.update(id, {
            sasia_standarde: data.sasia_standarde,
            eshte_opsionale: data.eshte_opsionale,
            updated_by: userId
        });
    },

    delete: async (produktId, perberesId) => {
        const deleted = await produktPerberesitRepository.delete(produktId, perberesId);
        if (!deleted) {
            throw { status: 404, message: 'Lidhja nuk u gjet' };
        }
        return deleted;
    }
};

module.exports = produktPerberesitService;