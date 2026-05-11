const express = require('express');
const router = express.Router();
const { getRoletEPerdoruesit, caktoRol, hiqRol } = require('../controllers/userRolesController');
const { verifyToken, verifyRole } = require('../middleware/authMiddleware');

// GET /api/user-roles/:userId - Merr rolet e nje perdoruesi (vetem admin)
router.get('/:userId', verifyToken, verifyRole('admin'), getRoletEPerdoruesit);

// POST /api/user-roles - Cakto rol (vetem admin)
router.post('/', verifyToken, verifyRole('admin'), caktoRol);

// DELETE /api/user-roles/:userId/:roleId - Hiq rol (vetem admin)
router.delete('/:userId/:roleId', verifyToken, verifyRole('admin'), hiqRol);

module.exports = router;