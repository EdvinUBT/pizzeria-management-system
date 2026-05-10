const express = require('express');
const router = express.Router();
const { getPorosite, getPorosia, getPorositeEKlientit, krijoPorosi, perditesoStatusin, anuloPorosi, fshiPorosi } = require('../controllers/porositeController');
const { verifyToken, verifyRole } = require('../middleware/authMiddleware');

// GET /api/porosite - Merr te gjitha porosite (vetem admin/menaxher)
router.get('/', verifyToken, verifyRole('admin', 'menaxher'), getPorosite);

// GET /api/porosite/:id - Merr nje porosi me detaje
router.get('/:id', verifyToken, getPorosia);

// GET /api/porosite/klienti/:klientId - Merr porosite e nje klienti
router.get('/klienti/:klientId', verifyToken, getPorositeEKlientit);

// POST /api/porosite - Krijo porosi
router.post('/', verifyToken, krijoPorosi);

// PUT /api/porosite/:id/statusi - Perditeso statusin (vetem admin/menaxher)
router.put('/:id/statusi', verifyToken, verifyRole('admin', 'menaxher'), perditesoStatusin);

// PUT /api/porosite/:id/anulo - Anulo porosi
router.put('/:id/anulo', verifyToken, anuloPorosi);

// DELETE /api/porosite/:id - Fshi porosi (vetem admin)
router.delete('/:id', verifyToken, verifyRole('admin'), fshiPorosi);

module.exports = router;