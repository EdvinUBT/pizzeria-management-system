const express = require('express');
const router = express.Router();
const { getPunonjesit, getPunonjesi, krijoPunonjes, perditesoPunonjes, fshiPunonjes } = require('../controllers/punonjesitController');
const { verifyToken, verifyRole } = require('../middleware/authMiddleware');

// GET /api/punonjesit - Merr te gjithe punonjesit (vetem admin/menaxher)
router.get('/', verifyToken, verifyRole('admin', 'menaxher'), getPunonjesit);

// GET /api/punonjesit/:id - Merr nje punonjes
router.get('/:id', verifyToken, verifyRole('admin', 'menaxher'), getPunonjesi);

// POST /api/punonjesit - Krijo punonjes (vetem admin)
router.post('/', verifyToken, verifyRole('admin'), krijoPunonjes);

// PUT /api/punonjesit/:id - Perditeso punonjes (vetem admin)
router.put('/:id', verifyToken, verifyRole('admin'), perditesoPunonjes);

// DELETE /api/punonjesit/:id - Fshi punonjes (vetem admin)
router.delete('/:id', verifyToken, verifyRole('admin'), fshiPunonjes);

module.exports = router;