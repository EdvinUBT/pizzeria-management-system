const express = require('express');
const router = express.Router();
const { getVleresimet, getVleresimetEPorosise, krijoVleresim, perditesoVleresim, fshiVleresim } = require('../controllers/vleresimetController');
const { verifyToken, verifyRole } = require('../middleware/authMiddleware');
const { validateVleresim } = require('../middleware/validateMiddleware');

router.get('/', getVleresimet);
router.get('/porosi/:porosiId', getVleresimetEPorosise);
router.post('/', verifyToken, validateVleresim, krijoVleresim);
router.put('/:id', verifyToken, perditesoVleresim);
router.delete('/:id', verifyToken, verifyRole('admin'), fshiVleresim);

module.exports = router;