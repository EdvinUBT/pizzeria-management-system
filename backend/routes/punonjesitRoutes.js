const express = require('express');
const router = express.Router();
const { getPunonjesit, getPunonjesi, krijoPunonjes, perditesoPunonjes, fshiPunonjes } = require('../controllers/punonjesitController');
const { verifyToken, verifyRole } = require('../middleware/authMiddleware');
const { validatePunonjes } = require('../middleware/validateMiddleware');

router.get('/', verifyToken, verifyRole('admin', 'menaxher'), getPunonjesit);
router.get('/:id', verifyToken, verifyRole('admin', 'menaxher'), getPunonjesi);
router.post('/', verifyToken, verifyRole('admin'), validatePunonjes, krijoPunonjes);
router.put('/:id', verifyToken, verifyRole('admin'), validatePunonjes, perditesoPunonjes);
router.delete('/:id', verifyToken, verifyRole('admin'), fshiPunonjes);

module.exports = router;