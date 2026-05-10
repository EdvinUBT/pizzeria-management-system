const express = require('express');
const router = express.Router();
const { getVleresimet, getVleresimetEPorosise, krijoVleresim, perditesoVleresim, fshiVleresim } = require('../controllers/vleresimetController');
const { verifyToken, verifyRole } = require('../middleware/authMiddleware');

// GET /api/vleresimet - Merr te gjitha vleresimet
router.get('/', getVleresimet);

// GET /api/vleresimet/porosi/:porosiId - Merr vleresimet e nje porosie
router.get('/porosi/:porosiId', getVleresimetEPorosise);

// POST /api/vleresimet - Krijo vleresim
router.post('/', verifyToken, krijoVleresim);

// PUT /api/vleresimet/:id - Perditeso vleresim
router.put('/:id', verifyToken, perditesoVleresim);

// DELETE /api/vleresimet/:id - Fshi vleresim (vetem admin)
router.delete('/:id', verifyToken, verifyRole('admin'), fshiVleresim);

module.exports = router;