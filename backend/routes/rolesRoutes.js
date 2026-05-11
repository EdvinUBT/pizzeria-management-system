const express = require('express');
const router = express.Router();
const { getRoles, getRole, krijoRole, perditesoRole, fshiRole } = require('../controllers/rolesController');
const { verifyToken, verifyRole } = require('../middleware/authMiddleware');

// GET /api/roles - Merr te gjitha rolet (vetem admin)
router.get('/', verifyToken, verifyRole('admin'), getRoles);

// GET /api/roles/:id - Merr nje rol (vetem admin)
router.get('/:id', verifyToken, verifyRole('admin'), getRole);

// POST /api/roles - Krijo rol (vetem admin)
router.post('/', verifyToken, verifyRole('admin'), krijoRole);

// PUT /api/roles/:id - Perditeso rol (vetem admin)
router.put('/:id', verifyToken, verifyRole('admin'), perditesoRole);

// DELETE /api/roles/:id - Fshi rol (vetem admin)
router.delete('/:id', verifyToken, verifyRole('admin'), fshiRole);

module.exports = router;