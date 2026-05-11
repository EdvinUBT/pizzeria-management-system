const express = require('express');
const router = express.Router();
const { getKuponat, getKuponiMeKod, krijoKupon, perditesoKupon, aplikoKupon, fshiKupon } = require('../controllers/kuponatController');
const { verifyToken, verifyRole } = require('../middleware/authMiddleware');
const { validateKupon } = require('../middleware/validateMiddleware');

router.get('/', verifyToken, verifyRole('admin', 'menaxher'), getKuponat);
router.get('/kodi/:kodi', verifyToken, getKuponiMeKod);
router.post('/', verifyToken, verifyRole('admin', 'menaxher'), validateKupon, krijoKupon);
router.post('/apliko', verifyToken, aplikoKupon);
router.put('/:id', verifyToken, verifyRole('admin', 'menaxher'), validateKupon, perditesoKupon);
router.delete('/:id', verifyToken, verifyRole('admin'), fshiKupon);

module.exports = router;