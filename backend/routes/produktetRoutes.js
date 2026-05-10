const express = require('express');
const router = express.Router();
const { getProduktet, getProdukti, getProduktetSipasKategorise, krijoProdukt, perditesoProdukt, fshiProdukt } = require('../controllers/produktetController');
const { verifyToken, verifyRole } = require('../middleware/authMiddleware');

// GET /api/produktet - Merr te gjitha produktet
router.get('/', getProduktet);

// GET /api/produktet/:id - Merr nje produkt
router.get('/:id', getProdukti);

// GET /api/produktet/kategoria/:kategoriId - Merr produktet sipas kategorise
router.get('/kategoria/:kategoriId', getProduktetSipasKategorise);

// POST /api/produktet - Krijo produkt (vetem admin/menaxher)
router.post('/', verifyToken, verifyRole('admin', 'menaxher'), krijoProdukt);

// PUT /api/produktet/:id - Perditeso produkt (vetem admin/menaxher)
router.put('/:id', verifyToken, verifyRole('admin', 'menaxher'), perditesoProdukt);

// DELETE /api/produktet/:id - Fshi produkt (vetem admin)
router.delete('/:id', verifyToken, verifyRole('admin'), fshiProdukt);

module.exports = router;