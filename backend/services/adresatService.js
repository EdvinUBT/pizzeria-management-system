const adresatRepository = require('../repositories/adresatRepository');

const adresatService = {
    getByKlientId: async (klientId) => {
        return await adresatRepository.getByKlientId(klientId);
    },

    create: async (data, userId) => {
        if (data.eshte_default) {
            await adresatRepository.resetDefault(data.klient_id);
        }

        return await adresatRepository.create({
            klient_id: data.klient_id,
            emertimi: data.emertimi,
            adresa: data.adresa,
            qyteti: data.qyteti || null,
            kodi_postar: data.kodi_postar || null,
            eshte_default: data.eshte_default || false,
            created_by: userId
        });
    },

    update: async (id, data, userId) => {
        const adresa = await adresatRepository.getById(id);
        if (!adresa) {
            throw { status: 404, message: 'Adresa nuk u gjet' };
        }

        if (data.eshte_default) {
            await adresatRepository.resetDefault(adresa.klient_id);
        }

        return await adresatRepository.update(id, {
            emertimi: data.emertimi,
            adresa: data.adresa,
            qyteti: data.qyteti || null,
            kodi_postar: data.kodi_postar || null,
            eshte_default: data.eshte_default || false,
            updated_by: userId
        });
    },

    delete: async (id) => {
        const adresa = await adresatRepository.getById(id);
        if (!adresa) {
            throw { status: 404, message: 'Adresa nuk u gjet' };
        }
        return await adresatRepository.delete(id);
    }
};

module.exports = adresatService;