const express = require('express');
const router = express.Router();
const { getKategorite, getKategoria, krijoKategori, perditesoKategori, fshiKategori } = require('../controllers/kategoriteController');
const { verifyToken, verifyRole } = require('../middleware/authMiddleware');

// GET /api/kategorite - Merr te gjitha kategorite
router.get('/', getKategorite);

// GET /api/kategorite/:id - Merr nje kategori
router.get('/:id', getKategoria);

// POST /api/kategorite - Krijo kategori (vetem admin/menaxher)
router.post('/', verifyToken, verifyRole('admin', 'menaxher'), krijoKategori);

// PUT /api/kategorite/:id - Perditeso kategori (vetem admin/menaxher)
router.put('/:id', verifyToken, verifyRole('admin', 'menaxher'), perditesoKategori);

// DELETE /api/kategorite/:id - Fshi kategori (vetem admin)
router.delete('/:id', verifyToken, verifyRole('admin'), fshiKategori);

module.exports = router;