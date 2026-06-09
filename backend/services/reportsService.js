const reportsRepository = require('../repositories/reportsRepository');

const reportsService = {
    getShitjetSipasKategorise: async (dataNga, dataDeri) => {
        return await reportsRepository.getShitjetSipasKategorise(dataNga, dataDeri);
    },

    getShitjetSipasProdukteve: async (dataNga, dataDeri, limit) => {
        return await reportsRepository.getShitjetSipasProdukteve(dataNga, dataDeri, limit);
    },

    getShitjetDitore: async (dataNga, dataDeri) => {
        return await reportsRepository.getShitjetDitore(dataNga, dataDeri);
    },

    getShitjetMujore: async (dataNga, dataDeri) => {
        return await reportsRepository.getShitjetMujore(dataNga, dataDeri);
    },

    getStatuSetPorosive: async (dataNga, dataDeri) => {
        return await reportsRepository.getStatuSetPorosive(dataNga, dataDeri);
    },

    getMetodatPageses: async (dataNga, dataDeri) => {
        return await reportsRepository.getMetodatPageses(dataNga, dataDeri);
    },

    getFullReport: async (dataNga, dataDeri) => {
        const [kategorite, produktet, ditore, mujore, statuset, metodat] = await Promise.all([
            reportsRepository.getShitjetSipasKategorise(dataNga, dataDeri),
            reportsRepository.getShitjetSipasProdukteve(dataNga, dataDeri, 10),
            reportsRepository.getShitjetDitore(dataNga, dataDeri),
            reportsRepository.getShitjetMujore(dataNga, dataDeri),
            reportsRepository.getStatuSetPorosive(dataNga, dataDeri),
            reportsRepository.getMetodatPageses(dataNga, dataDeri)
        ]);

        return { kategorite, produktet, ditore, mujore, statuset, metodat };
    }
};

module.exports = reportsService;