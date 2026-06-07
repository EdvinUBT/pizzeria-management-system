const dashboardRepository = require('../repositories/dashboardRepository');

const dashboardService = {
    getDashboard: async () => {
        const [
            totalPorosite, porosiSipasStatusit, totaliShitjeve,
            shitjetSotme, shitjetMuajore, totalKlientet,
            totalProduktet, totalPunonjesit, topProduktet,
            porositeEFundit, vleresimiMesatar, shitjet7Dite
        ] = await Promise.all([
            dashboardRepository.getTotalPorosite(),
            dashboardRepository.getPorosiSipasStatusit(),
            dashboardRepository.getTotaliShitjeve(),
            dashboardRepository.getShitjetSotme(),
            dashboardRepository.getShitjetMuajore(),
            dashboardRepository.getTotalKlientet(),
            dashboardRepository.getTotalProduktet(),
            dashboardRepository.getTotalPunonjesit(),
            dashboardRepository.getTopProduktet(),
            dashboardRepository.getPorositeEFundit(),
            dashboardRepository.getVleresimiMesatar(),
            dashboardRepository.getShitjet7Dite()
        ]);

        return {
            totalPorosite, porosiSipasStatusit, totaliShitjeve,
            shitjetSotme, shitjetMuajore, totalKlientet,
            totalProduktet, totalPunonjesit, topProduktet,
            porositeEFundit, vleresimiMesatar, shitjet7Dite
        };
    }
};

module.exports = dashboardService;