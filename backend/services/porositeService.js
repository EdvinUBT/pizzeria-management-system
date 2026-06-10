const porositeRepository = require('../repositories/porositeRepository');

const porositeService = {
    getAll: async () => {
        return await porositeRepository.getAll();
    },

    getById: async (id) => {
        const porosia = await porositeRepository.getById(id);
        if (!porosia) {
            throw { status: 404, message: 'Porosia nuk u gjet' };
        }
        const detajet = await porositeRepository.getDetajet(id);
        return { ...porosia, detajet };
    },

    getByKlientId: async (klientId) => {
        return await porositeRepository.getByKlientId(klientId);
    },

    create: async (data, userId) => {
        const porosi = await porositeRepository.create({
            klient_id: data.klient_id,
            metoda_pageses: data.metoda_pageses || 'cash',
            adresa_dergeses: data.adresa_dergeses || null,
            shenimet: data.shenimet || null,
            created_by: userId
        });

        let totali = 0;

        if (data.detajet && data.detajet.length > 0) {
            for (const detaj of data.detajet) {
                const nentotali = detaj.sasia * detaj.cmimi_njesi;
                totali += nentotali;

                await porositeRepository.createDetaj({
                    porosi_id: porosi.porosi_id,
                    produkt_id: detaj.produkt_id,
                    sasia: detaj.sasia,
                    cmimi_njesi: detaj.cmimi_njesi,
                    personalizimi: detaj.personalizimi || null,
                    nentotali,
                    created_by: userId
                });
            }

            await porositeRepository.updateTotali(porosi.porosi_id, totali);
        }

        return { porosi_id: porosi.porosi_id, totali };
    },

    updateStatusi: async (id, statusi, userId) => {
        const porosia = await porositeRepository.getById(id);
        if (!porosia) {
            throw { status: 404, message: 'Porosia nuk u gjet' };
        }
        return await porositeRepository.updateStatusi(id, statusi, userId);
    },

    anulo: async (id, userId) => {
        const porosia = await porositeRepository.getById(id);
        if (!porosia) {
            throw { status: 404, message: 'Porosia nuk u gjet' };
        }
        return await porositeRepository.updateStatusi(id, 'anuluar', userId);
    },

    delete: async (id) => {
        const porosia = await porositeRepository.getById(id);
        if (!porosia) {
            throw { status: 404, message: 'Porosia nuk u gjet' };
        }
        return await porositeRepository.delete(id);
    },

    search: async (filters) => {
        return await porositeRepository.search(filters);
    }
};

module.exports = porositeService;