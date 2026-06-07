const produktetRepository = require('../repositories/produktetRepository');

const produktetService = {
    getAll: async () => {
        return await produktetRepository.getAll();
    },

    getById: async (id) => {
        const produkti = await produktetRepository.getById(id);
        if (!produkti) {
            throw { status: 404, message: 'Produkti nuk u gjet' };
        }
        return produkti;
    },

    getByKategori: async (kategoriId) => {
        return await produktetRepository.getByKategori(kategoriId);
    },

    create: async (data, userId) => {
        return await produktetRepository.create({
            kategori_id: data.kategori_id,
            emri_produktit: data.emri_produktit,
            pershkrimi: data.pershkrimi || null,
            cmimi_baze: data.cmimi_baze,
            foto_url: data.foto_url || null,
            aktive: data.aktive !== undefined ? data.aktive : true,
            koha_pergatitjes_min: data.koha_pergatitjes_min || 0,
            created_by: userId
        });
    },

    update: async (id, data, userId) => {
        const produkti = await produktetRepository.getById(id);
        if (!produkti) {
            throw { status: 404, message: 'Produkti nuk u gjet' };
        }

        return await produktetRepository.update(id, {
            kategori_id: data.kategori_id,
            emri_produktit: data.emri_produktit,
            pershkrimi: data.pershkrimi || null,
            cmimi_baze: data.cmimi_baze,
            foto_url: data.foto_url || null,
            aktive: data.aktive !== undefined ? data.aktive : true,
            koha_pergatitjes_min: data.koha_pergatitjes_min || 0,
            updated_by: userId
        });
    },

    delete: async (id) => {
        const produkti = await produktetRepository.getById(id);
        if (!produkti) {
            throw { status: 404, message: 'Produkti nuk u gjet' };
        }
        return await produktetRepository.delete(id);
    }
};

module.exports = produktetService;