const express = require('express');
const router = express.Router();
const { getKlientet, getKlienti, krijoKlient, perditesoKlient, fshiKlient } = require('../controllers/klientetController');
const { verifyToken, verifyRole } = require('../middleware/authMiddleware');

// GET /api/klientet - Merr te gjithe klientet (vetem admin/menaxher)
router.get('/', verifyToken, verifyRole('admin', 'menaxher'), getKlientet);

// GET /api/klientet/:id - Merr nje klient
router.get('/:id', verifyToken, getKlienti);

// POST /api/klientet - Krijo klient
router.post('/', krijoKlient);

// PUT /api/klientet/:id - Perditeso klient
router.put('/:id', verifyToken, perditesoKlient);

// DELETE /api/klientet/:id - Fshi klient (vetem admin)
router.delete('/:id', verifyToken, verifyRole('admin'), fshiKlient);

module.exports = router;