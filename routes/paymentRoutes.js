const express = require('express');
const router = express.Router();
const { getPayment } = require('../controllers/paymentController');

/**
 * @swagger
 * /payment/{bookingId}:
 *   get:
 *     summary: Get payment details by booking ID
 *     tags: [Payments]
 *     parameters:
 *       - in: path
 *         name: bookingId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the booking to get payment details for
 *     responses:
 *       200:
 *         description: Payment details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Payment'
 *       400:
 *         description: Invalid booking ID supplied
 *       404:
 *         description: Payment or booking not found
 *       500:
 *         description: Internal server error
 */

router.get('/:bookingId', getPayment);

module.exports = router;
