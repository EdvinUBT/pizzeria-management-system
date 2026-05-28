const express = require('express');
const router = express.Router();
const { getMenyte, getMenuja, krijoMeny, perditesoMeny, shtoProduktNeMeny, hiqProduktNgaMenyja, fshiMeny } = require('../controllers/menyteController');
const { verifyToken, verifyRole } = require('../middleware/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Menyte
 *   description: Menaxhimi i menyve dhe produkteve ne meny
 */

/**
 * @swagger
 * /api/menyte:
 *   get:
 *     summary: Merr te gjitha menyte
 *     tags: [Menyte]
 *     responses:
 *       200:
 *         description: Lista e menyve
 */
router.get('/', getMenyte);

/**
 * @swagger
 * /api/menyte/{id}:
 *   get:
 *     summary: Merr nje meny me produktet e saj
 *     tags: [Menyte]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID e menys
 *     responses:
 *       200:
 *         description: Te dhenat e menys me produktet
 *       404:
 *         description: Menyja nuk u gjet
 */
router.get('/:id', getMenuja);

/**
 * @swagger
 * /api/menyte:
 *   post:
 *     summary: Krijo nje meny te re
 *     tags: [Menyte]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - emri_menys
 *             properties:
 *               emri_menys:
 *                 type: string
 *                 example: Menyja e Veres
 *               pershkrimi:
 *                 type: string
 *                 example: Menyja speciale per stinen e veres
 *               data_fillimit:
 *                 type: string
 *                 format: date
 *                 example: "2026-06-01"
 *               data_mbarimit:
 *                 type: string
 *                 format: date
 *                 example: "2026-08-31"
 *               aktive:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       201:
 *         description: Menyja u krijua me sukses
 */
router.post('/', verifyToken, verifyRole('admin', 'menaxher'), krijoMeny);

/**
 * @swagger
 * /api/menyte/{id}:
 *   put:
 *     summary: Perditeso nje meny
 *     tags: [Menyte]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID e menys
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               emri_menys:
 *                 type: string
 *               pershkrimi:
 *                 type: string
 *               data_fillimit:
 *                 type: string
 *                 format: date
 *               data_mbarimit:
 *                 type: string
 *                 format: date
 *               aktive:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Menyja u perditesua
 *       404:
 *         description: Menyja nuk u gjet
 */
router.put('/:id', verifyToken, verifyRole('admin', 'menaxher'), perditesoMeny);

/**
 * @swagger
 * /api/menyte/{id}/produkt:
 *   post:
 *     summary: Shto nje produkt ne meny
 *     tags: [Menyte]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID e menys
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - produkt_id
 *             properties:
 *               produkt_id:
 *                 type: integer
 *                 example: 1
 *               cmimi_special:
 *                 type: number
 *                 example: 5.50
 *               renditja:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       201:
 *         description: Produkti u shtua ne meny
 */
router.post('/:id/produkt', verifyToken, verifyRole('admin', 'menaxher'), shtoProduktNeMeny);

/**
 * @swagger
 * /api/menyte/{id}/produkt/{produktId}:
 *   delete:
 *     summary: Hiq nje produkt nga menyja
 *     tags: [Menyte]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID e menys
 *       - in: path
 *         name: produktId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID e produktit
 *     responses:
 *       200:
 *         description: Produkti u hoq nga menyja
 *       404:
 *         description: Lidhja nuk u gjet
 */
router.delete('/:id/produkt/:produktId', verifyToken, verifyRole('admin', 'menaxher'), hiqProduktNgaMenyja);

/**
 * @swagger
 * /api/menyte/{id}:
 *   delete:
 *     summary: Fshi nje meny
 *     tags: [Menyte]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID e menys
 *     responses:
 *       200:
 *         description: Menyja u fshi me sukses
 *       404:
 *         description: Menyja nuk u gjet
 */
router.delete('/:id', verifyToken, verifyRole('admin'), fshiMeny);

module.exports = router;