const produktPerberesitService = require('../services/produktPerberesitService');

const getPerberesitEProduktit = async (req, res) => {
    try {
        const te_dhena = await produktPerberesitService.getByProduktId(req.params.produktId);
        res.json({ sukses: true, te_dhena });
    } catch (error) {
        console.error('Gabim:', error);
        res.status(error.status || 500).json({ sukses: false, mesazhi: error.message || 'Gabim ne server' });
    }
};

const shtoPerberesNeProdukt = async (req, res) => {
    try {
        const lidhja = await produktPerberesitService.create(req.params.produktId, req.body, req.user?.id);
        res.status(201).json({
            sukses: true,
            mesazhi: 'Perberesi u shtua ne produkt me sukses!',
            produkt_perberes_id: lidhja.produkt_perberes_id
        });
    } catch (error) {
        console.error('Gabim:', error);
        res.status(error.status || 500).json({ sukses: false, mesazhi: error.message || 'Gabim ne server' });
    }
};

const perditesoPerberesNeProdukt = async (req, res) => {
    try {
        await produktPerberesitService.update(req.params.id, req.body, req.user?.id);
        res.json({ sukses: true, mesazhi: 'Perberesi u perditesua me sukses!' });
    } catch (error) {
        console.error('Gabim:', error);
        res.status(error.status || 500).json({ sukses: false, mesazhi: error.message || 'Gabim ne server' });
    }
};

const hiqPerberesNgaProdukti = async (req, res) => {
    try {
        await produktPerberesitService.delete(req.params.produktId, req.params.perberesId);
        res.json({ sukses: true, mesazhi: 'Perberesi u hoq nga produkti me sukses!' });
    } catch (error) {
        console.error('Gabim:', error);
        res.status(error.status || 500).json({ sukses: false, mesazhi: error.message || 'Gabim ne server' });
    }
};

module.exports = { getPerberesitEProduktit, shtoPerberesNeProdukt, perditesoPerberesNeProdukt, hiqPerberesNgaProdukti };