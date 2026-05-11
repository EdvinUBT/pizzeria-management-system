const express = require('express');
const router = express.Router();
const { getKategorite, getKategoria, krijoKategori, perditesoKategori, fshiKategori } = require('../controllers/kategoriteController');
const { verifyToken, verifyRole } = require('../middleware/authMiddleware');
const { validateKategori } = require('../middleware/validateMiddleware');

router.get('/', getKategorite);
router.get('/:id', getKategoria);
router.post('/', verifyToken, verifyRole('admin', 'menaxher'), validateKategori, krijoKategori);
router.put('/:id', verifyToken, verifyRole('admin', 'menaxher'), validateKategori, perditesoKategori);
router.delete('/:id', verifyToken, verifyRole('admin'), fshiKategori);

module.exports = router;