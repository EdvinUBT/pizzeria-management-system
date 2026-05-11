const express = require('express');
const router = express.Router();
const { getProduktet, getProdukti, getProduktetSipasKategorise, krijoProdukt, perditesoProdukt, fshiProdukt } = require('../controllers/produktetController');
const { verifyToken, verifyRole } = require('../middleware/authMiddleware');
const { validateProdukt } = require('../middleware/validateMiddleware');

router.get('/', getProduktet);
router.get('/:id', getProdukti);
router.get('/kategoria/:kategoriId', getProduktetSipasKategorise);
router.post('/', verifyToken, verifyRole('admin', 'menaxher'), validateProdukt, krijoProdukt);
router.put('/:id', verifyToken, verifyRole('admin', 'menaxher'), validateProdukt, perditesoProdukt);
router.delete('/:id', verifyToken, verifyRole('admin'), fshiProdukt);

module.exports = router;