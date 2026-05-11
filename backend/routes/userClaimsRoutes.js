const express = require('express');
const router = express.Router();
const { getClaimsEPerdoruesit, shtoClaim, perditesoClaim, fshiClaim } = require('../controllers/userClaimsController');
const { verifyToken, verifyRole } = require('../middleware/authMiddleware');

// GET /api/user-claims/:userId - Merr claims e nje perdoruesi (vetem admin)
router.get('/:userId', verifyToken, verifyRole('admin'), getClaimsEPerdoruesit);

// POST /api/user-claims - Shto claim (vetem admin)
router.post('/', verifyToken, verifyRole('admin'), shtoClaim);

// PUT /api/user-claims/:id - Perditeso claim (vetem admin)
router.put('/:id', verifyToken, verifyRole('admin'), perditesoClaim);

// DELETE /api/user-claims/:id - Fshi claim (vetem admin)
router.delete('/:id', verifyToken, verifyRole('admin'), fshiClaim);

module.exports = router;