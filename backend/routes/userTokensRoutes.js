const express = require('express');
const router = express.Router();
const { getTokenatEPerdoruesit, shtoToken, fshiToken, fshiTeGjithaTokenat } = require('../controllers/userTokensController');
const { verifyToken, verifyRole } = require('../middleware/authMiddleware');

// GET /api/user-tokens/:userId - Merr tokenat e nje perdoruesi (vetem admin)
router.get('/:userId', verifyToken, verifyRole('admin'), getTokenatEPerdoruesit);

// POST /api/user-tokens - Shto token (vetem admin)
router.post('/', verifyToken, verifyRole('admin'), shtoToken);

// DELETE /api/user-tokens/:id - Fshi nje token (vetem admin)
router.delete('/:id', verifyToken, verifyRole('admin'), fshiToken);

// DELETE /api/user-tokens/user/:userId - Fshi te gjitha tokenat (vetem admin)
router.delete('/user/:userId', verifyToken, verifyRole('admin'), fshiTeGjithaTokenat);

module.exports = router;