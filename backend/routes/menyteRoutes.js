const express = require('express');
const router = express.Router();
const { getMenyte, getMenuja, krijoMeny, perditesoMeny, shtoProduktNeMeny, hiqProduktNgaMenyja, fshiMeny } = require('../controllers/menyteController');
const { verifyToken, verifyRole } = require('../middleware/authMiddleware');

// GET /api/menyte - Merr te gjitha menyte
router.get('/', getMenyte);

// GET /api/menyte/:id - Merr nje meny me produktet
router.get('/:id', getMenuja);

// POST /api/menyte - Krijo meny (vetem admin/menaxher)
router.post('/', verifyToken, verifyRole('admin', 'menaxher'), krijoMeny);

// PUT /api/menyte/:id - Perditeso meny (vetem admin/menaxher)
router.put('/:id', verifyToken, verifyRole('admin', 'menaxher'), perditesoMeny);

// POST /api/menyte/:id/produkt - Shto produkt ne meny (vetem admin/menaxher)
router.post('/:id/produkt', verifyToken, verifyRole('admin', 'menaxher'), shtoProduktNeMeny);

// DELETE /api/menyte/:id/produkt/:produktId - Hiq produkt nga menyja (vetem admin/menaxher)
router.delete('/:id/produkt/:produktId', verifyToken, verifyRole('admin', 'menaxher'), hiqProduktNgaMenyja);

// DELETE /api/menyte/:id - Fshi meny (vetem admin)
router.delete('/:id', verifyToken, verifyRole('admin'), fshiMeny);

module.exports = router;