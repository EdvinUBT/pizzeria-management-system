const express = require('express');
const router = express.Router();
const { getPerberesitEProduktit, shtoPerberesNeProdukt, perditesoPerberesNeProdukt, hiqPerberesNgaProdukti } = require('../controllers/produktPerberesitController');
const { verifyToken, verifyRole } = require('../middleware/authMiddleware');

// GET /api/produkt-perberesit/:produktId - Merr perberesit e nje produkti
router.get('/:produktId', getPerberesitEProduktit);

// POST /api/produkt-perberesit/:produktId - Shto perberes ne produkt
router.post('/:produktId', verifyToken, verifyRole('admin', 'menaxher'), shtoPerberesNeProdukt);

// PUT /api/produkt-perberesit/:id - Perditeso sasine
router.put('/:id', verifyToken, verifyRole('admin', 'menaxher'), perditesoPerberesNeProdukt);

// DELETE /api/produkt-perberesit/:produktId/:perberesId - Hiq perberes nga produkti
router.delete('/:produktId/:perberesId', verifyToken, verifyRole('admin', 'menaxher'), hiqPerberesNgaProdukti);

module.exports = router;