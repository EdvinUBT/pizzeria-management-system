const menyteRepository = require('../repositories/menyteRepository');

const menyteService = {
    getAll: async () => {
        return await menyteRepository.getAll();
    },

    getById: async (id) => {
        const menyja = await menyteRepository.getById(id);
        if (!menyja) {
            throw { status: 404, message: 'Menyja nuk u gjet' };
        }
        const produktet = await menyteRepository.getProduktet(id);
        return { ...menyja, produktet };
    },

    create: async (data, userId) => {
        return await menyteRepository.create({
            emri_menys: data.emri_menys,
            pershkrimi: data.pershkrimi || null,
            data_fillimit: data.data_fillimit || null,
            data_mbarimit: data.data_mbarimit || null,
            aktive: data.aktive !== undefined ? data.aktive : true,
            created_by: userId
        });
    },

    update: async (id, data, userId) => {
        const menyja = await menyteRepository.getById(id);
        if (!menyja) {
            throw { status: 404, message: 'Menyja nuk u gjet' };
        }

        return await menyteRepository.update(id, {
            emri_menys: data.emri_menys,
            pershkrimi: data.pershkrimi || null,
            data_fillimit: data.data_fillimit || null,
            data_mbarimit: data.data_mbarimit || null,
            aktive: data.aktive !== undefined ? data.aktive : true,
            updated_by: userId
        });
    },

    shtoProdukt: async (menyId, data, userId) => {
        const menyja = await menyteRepository.getById(menyId);
        if (!menyja) {
            throw { status: 404, message: 'Menyja nuk u gjet' };
        }

        return await menyteRepository.shtoProdukt({
            meny_id: menyId,
            produkt_id: data.produkt_id,
            cmimi_special: data.cmimi_special || null,
            renditja: data.renditja || 0,
            created_by: userId
        });
    },

    hiqProdukt: async (menyId, produktId) => {
        const deleted = await menyteRepository.hiqProdukt(menyId, produktId);
        if (!deleted) {
            throw { status: 404, message: 'Produkti nuk u gjet ne kete meny' };
        }
        return deleted;
    },

    delete: async (id) => {
        const menyja = await menyteRepository.getById(id);
        if (!menyja) {
            throw { status: 404, message: 'Menyja nuk u gjet' };
        }
        return await menyteRepository.delete(id);
    }
};

module.exports = menyteService;