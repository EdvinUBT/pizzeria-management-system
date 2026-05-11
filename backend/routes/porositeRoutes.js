const express = require('express');
const router = express.Router();
const { getPorosite, getPorosia, getPorositeEKlientit, krijoPorosi, perditesoStatusin, anuloPorosi, fshiPorosi } = require('../controllers/porositeController');
const { verifyToken, verifyRole } = require('../middleware/authMiddleware');
const { validatePorosi } = require('../middleware/validateMiddleware');

router.get('/', verifyToken, verifyRole('admin', 'menaxher'), getPorosite);
router.get('/:id', verifyToken, getPorosia);
router.get('/klienti/:klientId', verifyToken, getPorositeEKlientit);
router.post('/', verifyToken, validatePorosi, krijoPorosi);
router.put('/:id/statusi', verifyToken, verifyRole('admin', 'menaxher'), perditesoStatusin);
router.put('/:id/anulo', verifyToken, anuloPorosi);
router.delete('/:id', verifyToken, verifyRole('admin'), fshiPorosi);

module.exports = router;