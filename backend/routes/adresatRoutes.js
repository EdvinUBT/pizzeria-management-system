const express = require('express');
const router = express.Router();
const { getAdresatEKlientit, shtoAdrese, perditesoAdrese, fshiAdrese } = require('../controllers/adresatController');
const { verifyToken } = require('../middleware/authMiddleware');

// GET /api/adresat/:klientId - Merr adresat e nje klienti
router.get('/:klientId', verifyToken, getAdresatEKlientit);

// POST /api/adresat - Shto adrese
router.post('/', verifyToken, shtoAdrese);

// PUT /api/adresat/:id - Perditeso adrese
router.put('/:id', verifyToken, perditesoAdrese);

// DELETE /api/adresat/:id - Fshi adrese
router.delete('/:id', verifyToken, fshiAdrese);

module.exports = router;