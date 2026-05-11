const express = require('express');
const router = express.Router();
const { getKuponat, getKuponiMeKod, krijoKupon, perditesoKupon, aplikoKupon, fshiKupon } = require('../controllers/kuponatController');
const { verifyToken, verifyRole } = require('../middleware/authMiddleware');

// GET /api/kuponat - Merr te gjitha kuponat (vetem admin/menaxher)
router.get('/', verifyToken, verifyRole('admin', 'menaxher'), getKuponat);

// GET /api/kuponat/kodi/:kodi - Kontrollo kuponin me kod
router.get('/kodi/:kodi', verifyToken, getKuponiMeKod);

// POST /api/kuponat - Krijo kupon (vetem admin/menaxher)
router.post('/', verifyToken, verifyRole('admin', 'menaxher'), krijoKupon);

// POST /api/kuponat/apliko - Apliko kupon ne porosi
router.post('/apliko', verifyToken, aplikoKupon);

// PUT /api/kuponat/:id - Perditeso kupon (vetem admin/menaxher)
router.put('/:id', verifyToken, verifyRole('admin', 'menaxher'), perditesoKupon);

// DELETE /api/kuponat/:id - Fshi kupon (vetem admin)
router.delete('/:id', verifyToken, verifyRole('admin'), fshiKupon);

module.exports = router;