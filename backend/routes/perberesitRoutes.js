const express = require('express');
const router = express.Router();
const { getPerberesit, getPerberesi, krijoPerberes, perditesoPerberes, fshiPerberes } = require('../controllers/perberesitController');
const { verifyToken, verifyRole } = require('../middleware/authMiddleware');

// GET /api/perberesit - Merr te gjithe perberesit
router.get('/', getPerberesit);

// GET /api/perberesit/:id - Merr nje perberes
router.get('/:id', getPerberesi);

// POST /api/perberesit - Krijo perberes (vetem admin/menaxher)
router.post('/', verifyToken, verifyRole('admin', 'menaxher'), krijoPerberes);

// PUT /api/perberesit/:id - Perditeso perberes (vetem admin/menaxher)
router.put('/:id', verifyToken, verifyRole('admin', 'menaxher'), perditesoPerberes);

// DELETE /api/perberesit/:id - Fshi perberes (vetem admin)
router.delete('/:id', verifyToken, verifyRole('admin'), fshiPerberes);

module.exports = router;