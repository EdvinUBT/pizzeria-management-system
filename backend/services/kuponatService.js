const kuponatRepository = require('../repositories/kuponatRepository');

const kuponatService = {
    getAll: async () => {
        return await kuponatRepository.getAll();
    },

    getByKod: async (kodi) => {
        const kuponi = await kuponatRepository.getByKod(kodi);
        if (!kuponi) {
            throw { status: 404, message: 'Kuponi nuk u gjet ose ka skaduar!' };
        }
        return kuponi;
    },

    create: async (data, userId) => {
        const existing = await kuponatRepository.getByKodOnly(data.kodi);
        if (existing) {
            throw { status: 400, message: 'Ky kod kuponi ekziston tashme!' };
        }

        return await kuponatRepository.create({
            kodi: data.kodi,
            zbritja_perqind: data.zbritja_perqind,
            zbritja_max: data.zbritja_max || null,
            porosi_min: data.porosi_min || 0,
            data_fillimit: data.data_fillimit,
            data_skadimit: data.data_skadimit,
            perdorimet_max: data.perdorimet_max || 1,
            created_by: userId
        });
    },

    update: async (id, data, userId) => {
        const kuponi = await kuponatRepository.getById(id);
        if (!kuponi) {
            throw { status: 404, message: 'Kuponi nuk u gjet' };
        }

        return await kuponatRepository.update(id, {
            kodi: data.kodi,
            zbritja_perqind: data.zbritja_perqind,
            zbritja_max: data.zbritja_max || null,
            porosi_min: data.porosi_min || 0,
            data_fillimit: data.data_fillimit,
            data_skadimit: data.data_skadimit,
            perdorimet_max: data.perdorimet_max || 1,
            aktiv: data.aktiv !== undefined ? data.aktiv : true,
            updated_by: userId
        });
    },

    apliko: async (kodi, porosiId) => {
        const kuponi = await kuponatRepository.getByKod(kodi);
        if (!kuponi) {
            throw { status: 400, message: 'Kuponi nuk eshte i vlefshem!' };
        }

        const porosi = await kuponatRepository.getPorosiTotali(porosiId);
        if (!porosi) {
            throw { status: 404, message: 'Porosia nuk u gjet!' };
        }

        if (porosi.totali < kuponi.porosi_min) {
            throw { status: 400, message: `Porosi minimale per kete kupon: ${kuponi.porosi_min} EUR` };
        }

        let zbritja = (porosi.totali * kuponi.zbritja_perqind) / 100;
        if (kuponi.zbritja_max && zbritja > kuponi.zbritja_max) {
            zbritja = kuponi.zbritja_max;
        }

        const totaliRi = porosi.totali - zbritja;

        await kuponatRepository.updatePorosiTotali(porosiId, totaliRi);
        await kuponatRepository.incrementPerdorimet(kuponi.kupon_id);

        return { zbritja, totali_ri: totaliRi };
    },

    delete: async (id) => {
        const kuponi = await kuponatRepository.getById(id);
        if (!kuponi) {
            throw { status: 404, message: 'Kuponi nuk u gjet' };
        }
        return await kuponatRepository.delete(id);
    },

    search: async (filters) => {
        return await kuponatRepository.search(filters);
    }
};

module.exports = kuponatService;