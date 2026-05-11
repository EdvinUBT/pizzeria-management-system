const express = require('express');
const router = express.Router();
const { getKlientet, getKlienti, krijoKlient, perditesoKlient, fshiKlient } = require('../controllers/klientetController');
const { verifyToken, verifyRole } = require('../middleware/authMiddleware');
const { validateKlient } = require('../middleware/validateMiddleware');

router.get('/', verifyToken, verifyRole('admin', 'menaxher'), getKlientet);
router.get('/:id', verifyToken, getKlienti);
router.post('/', validateKlient, krijoKlient);
router.put('/:id', verifyToken, perditesoKlient);
router.delete('/:id', verifyToken, verifyRole('admin'), fshiKlient);

module.exports = router;