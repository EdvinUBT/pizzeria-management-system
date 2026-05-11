const express = require('express');
const router = express.Router();
const { getUsers, getUser, krijoUser, perditesoUser, ndryshStatusin, fshiUser } = require('../controllers/usersController');
const { verifyToken, verifyRole } = require('../middleware/authMiddleware');

// GET /api/users - Merr te gjithe perdoruesit (vetem admin)
router.get('/', verifyToken, verifyRole('admin'), getUsers);

// GET /api/users/:id - Merr nje perdorues (vetem admin)
router.get('/:id', verifyToken, verifyRole('admin'), getUser);

// POST /api/users - Krijo perdorues (vetem admin)
router.post('/', verifyToken, verifyRole('admin'), krijoUser);

// PUT /api/users/:id - Perditeso perdorues (vetem admin)
router.put('/:id', verifyToken, verifyRole('admin'), perditesoUser);

// PUT /api/users/:id/statusi - Aktivizo/Deaktivizo (vetem admin)
router.put('/:id/statusi', verifyToken, verifyRole('admin'), ndryshStatusin);

// DELETE /api/users/:id - Fshi perdorues (vetem admin)
router.delete('/:id', verifyToken, verifyRole('admin'), fshiUser);

module.exports = router;