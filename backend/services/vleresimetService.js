const vleresimetRepository = require('../repositories/vleresimetRepository');

const vleresimetService = {
    getAll: async () => {
        return await vleresimetRepository.getAll();
    },

    getByPorosiId: async (porosiId) => {
        return await vleresimetRepository.getByPorosiId(porosiId);
    },

    create: async (data, userId) => {
        const existing = await vleresimetRepository.getByKlientAndPorosi(data.klient_id, data.porosi_id);
        if (existing) {
            throw { status: 400, message: 'Kjo porosi eshte vleresuar tashme!' };
        }

        return await vleresimetRepository.create({
            klient_id: data.klient_id,
            porosi_id: data.porosi_id,
            yjet: data.yjet,
            komenti: data.komenti || null,
            created_by: userId
        });
    },

    update: async (id, data, userId) => {
        const vleresimi = await vleresimetRepository.getById(id);
        if (!vleresimi) {
            throw { status: 404, message: 'Vleresimi nuk u gjet' };
        }

        return await vleresimetRepository.update(id, {
            yjet: data.yjet,
            komenti: data.komenti || null,
            updated_by: userId
        });
    },

    delete: async (id) => {
        const vleresimi = await vleresimetRepository.getById(id);
        if (!vleresimi) {
            throw { status: 404, message: 'Vleresimi nuk u gjet' };
        }
        return await vleresimetRepository.delete(id);
    }
};

module.exports = vleresimetService;