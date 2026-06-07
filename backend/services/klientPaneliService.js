const klientPaneliRepository = require('../repositories/klientPaneliRepository');

const klientPaneliService = {
    getProfilin: async (klientId) => {
        const profili = await klientPaneliRepository.getProfilin(klientId);
        if (!profili) {
            throw { status: 404, message: 'Klienti nuk u gjet!' };
        }
        return profili;
    },

    perditesoProfilin: async (klientId, data, userId) => {
        const updated = await klientPaneliRepository.perditesoProfilin(klientId, {
            emri: data.emri,
            mbiemri: data.mbiemri,
            telefoni: data.telefoni || null,
            adresa: data.adresa || null,
            updated_by: userId
        });
        if (!updated) {
            throw { status: 404, message: 'Klienti nuk u gjet!' };
        }
        return updated;
    },

    getPorositeEMia: async (klientId) => {
        return await klientPaneliRepository.getPorositeEKlientit(klientId);
    },

    getDetajetEPorosise: async (porosiId, klientId) => {
        const porosia = await klientPaneliRepository.getPorosia(porosiId, klientId);
        if (!porosia) {
            throw { status: 404, message: 'Porosia nuk u gjet!' };
        }
        const detajet = await klientPaneliRepository.getDetajetEPorosise(porosiId);
        const dergesa = await klientPaneliRepository.getDergesa(porosiId);
        return { ...porosia, detajet, dergesa };
    },

    krijoPorosi: async (klientId, data, userId) => {
        const porosi = await klientPaneliRepository.krijoPorosi({
            klient_id: klientId,
            metoda_pageses: data.metoda_pageses || 'cash',
            adresa_dergeses: data.adresa_dergeses || null,
            shenimet: data.shenimet || null,
            created_by: userId
        });

        let totali = 0;

        if (data.detajet && data.detajet.length > 0) {
            for (const detaj of data.detajet) {
                let cmimi = detaj.cmimi_njesi;
                if (!cmimi) {
                    cmimi = await klientPaneliRepository.getCmimiProduktit(detaj.produkt_id);
                }
                const nentotali = detaj.sasia * cmimi;
                totali += nentotali;

                await klientPaneliRepository.krijoDetaj({
                    porosi_id: porosi.porosi_id,
                    produkt_id: detaj.produkt_id,
                    sasia: detaj.sasia,
                    cmimi_njesi: cmimi,
                    personalizimi: detaj.personalizimi || null,
                    nentotali,
                    created_by: userId
                });
            }
        }

        let zbritja = 0;
        if (data.kupon_kodi) {
            const kupon = await klientPaneliRepository.getKuponValid(data.kupon_kodi);
            if (kupon && totali >= kupon.porosi_min) {
                zbritja = (totali * kupon.zbritja_perqind) / 100;
                if (kupon.zbritja_max && zbritja > kupon.zbritja_max) {
                    zbritja = parseFloat(kupon.zbritja_max);
                }
                await klientPaneliRepository.incrementKupon(kupon.kupon_id);
            }
        }

        const totaliPerfundimtar = totali - zbritja;
        await klientPaneliRepository.updateTotali(porosi.porosi_id, totaliPerfundimtar);

        return { porosi_id: porosi.porosi_id, totali: totaliPerfundimtar, zbritja };
    },

    anuloPorosi: async (porosiId, klientId) => {
        const porosia = await klientPaneliRepository.getPorosia(porosiId, klientId);
        if (!porosia) {
            throw { status: 404, message: 'Porosia nuk u gjet!' };
        }
        if (porosia.statusi !== 'ne_pritje') {
            throw { status: 400, message: 'Vetem porosite ne pritje mund te anulohen!' };
        }
        await klientPaneliRepository.anuloPorosiStatus(porosiId);
    },

    krijoVleresim: async (klientId, porosiId, data, userId) => {
        const porosia = await klientPaneliRepository.getPorosiDorezuar(porosiId, klientId);
        if (!porosia) {
            throw { status: 400, message: 'Vetem porosite e dorezuara mund te vleresohen!' };
        }

        const existing = await klientPaneliRepository.getVleresimEkzistues(klientId, porosiId);
        if (existing) {
            throw { status: 400, message: 'Kjo porosi eshte vleresuar tashme!' };
        }

        return await klientPaneliRepository.krijoVleresim({
            klient_id: klientId,
            porosi_id: porosiId,
            yjet: data.yjet,
            komenti: data.komenti || null,
            created_by: userId
        });
    },

    getMenyteAktive: async () => {
        const menyte = await klientPaneliRepository.getMenyteAktive();
        for (let meny of menyte) {
            meny.produktet = await klientPaneliRepository.getProduktetEMenys(meny.meny_id);
        }
        return menyte;
    },

    verifikoKupon: async (kodi, totali) => {
        const kupon = await klientPaneliRepository.getKuponValid(kodi);
        if (!kupon) {
            throw { status: 400, message: 'Kuponi nuk eshte i vlefshem!' };
        }
        if (totali < kupon.porosi_min) {
            throw { status: 400, message: `Porosi minimale per kete kupon: ${kupon.porosi_min} EUR` };
        }

        let zbritja = (totali * kupon.zbritja_perqind) / 100;
        if (kupon.zbritja_max && zbritja > kupon.zbritja_max) {
            zbritja = parseFloat(kupon.zbritja_max);
        }

        return {
            zbritja_perqind: kupon.zbritja_perqind,
            zbritja,
            totali_ri: totali - zbritja
        };
    },

    getVleresimetProdukteve: async () => {
        const rows = await klientPaneliRepository.getVleresimetProdukteve();
        const komentet = await klientPaneliRepository.getKomentetProdukteve();

        const komenteSipasProduktit = {};
        for (const k of komentet) {
            if (!komenteSipasProduktit[k.produkt_id]) {
                komenteSipasProduktit[k.produkt_id] = [];
            }
            if (komenteSipasProduktit[k.produkt_id].length < 3) {
                komenteSipasProduktit[k.produkt_id].push(k);
            }
        }

        const rezultati = {};
        for (const r of rows) {
            rezultati[r.produkt_id] = {
                mesatarja: r.mesatarja_yjeve,
                numri: r.numri_vleresimeve,
                komentet: komenteSipasProduktit[r.produkt_id] || []
            };
        }
        return rezultati;
    }
};

module.exports = klientPaneliService;