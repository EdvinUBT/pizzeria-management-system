const express = require('express');
const router = express.Router();
const { getDergesat, getDergesa, krijoDergese, perditesoStatusin, fshiDergese } = require('../controllers/dergesatController');
const { verifyToken, verifyRole } = require('../middleware/authMiddleware');

// GET /api/dergesat - Merr te gjitha dergesat (vetem admin/menaxher)
router.get('/', verifyToken, verifyRole('admin', 'menaxher'), getDergesat);

// GET /api/dergesat/:id - Merr nje dergese
router.get('/:id', verifyToken, getDergesa);

// POST /api/dergesat - Krijo dergese (vetem admin/menaxher)
router.post('/', verifyToken, verifyRole('admin', 'menaxher'), krijoDergese);

// PUT /api/dergesat/:id/statusi - Perditeso statusin
router.put('/:id/statusi', verifyToken, verifyRole('admin', 'menaxher'), perditesoStatusin);

// DELETE /api/dergesat/:id - Fshi dergese (vetem admin)
router.delete('/:id', verifyToken, verifyRole('admin'), fshiDergese);

module.exports = router;