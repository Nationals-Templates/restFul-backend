const express = require('express');
const {
  createParking,
  getParkingWithSlotsLeft,
  markCarExit,
  getIncomingCars,
  getOutgoingCarsWithTotalAmount,
  generateBill
} = require('../controllers/parkingController');
const { verifyToken, verifyAdmin } = require('../middleware/auth');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Parking
 *   description: Parking lot management
 */

/**
 * @swagger
 * /api/parking:
 *   post:
 *     summary: Create a new parking lot (Admin only)
 *     tags: [Parking]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Parking lot details
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - location
 *               - totalSlots
 *             properties:
 *               name:
 *                 type: string
 *                 example: Central Parking
 *               location:
 *                 type: string
 *                 example: Downtown
 *               totalSlots:
 *                 type: integer
 *                 example: 50
 *     responses:
 *       201:
 *         description: Parking lot created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: 507f1f77bcf86cd799439011
 *                 name:
 *                   type: string
 *                   example: Central Parking
 *                 location:
 *                   type: string
 *                   example: Downtown
 *                 totalSlots:
 *                   type: integer
 *                   example: 50
 *                 slotsLeft:
 *                   type: integer
 *                   example: 50
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (admin only)
 */
router.post('/', verifyToken, verifyAdmin, createParking);



/**
 * @swagger
 * /api/parking/exit/{bookingId}:
 *   patch:
 *     summary: Mark car exit and calculate payment
 *     tags: [Parking]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: bookingId
 *         required: true
 *         description: Booking ID of the parked car
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Car exit registered and payment calculated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 bookingId:
 *                   type: string
 *                   example: 507f1f77bcf86cd799439011
 *                 totalPayment:
 *                   type: number
 *                   format: float
 *                   example: 20.5
 *                 status:
 *                   type: string
 *                   example: completed
 *       400:
 *         description: Invalid booking or car already exited
 *       401:
 *         description: Unauthorized
 */
router.patch('/exit/:bookingId', verifyToken, markCarExit);

/**
 * @swagger
 * /api/parking/incoming:
 *   get:
 *     summary: Get list of cars currently parked
 *     tags: [Parking]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of incoming parked cars
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   bookingId:
 *                     type: string
 *                     example: 507f1f77bcf86cd799439011
 *                   plateNumber:
 *                     type: string
 *                     example: ABC123
 *                   parkingId:
 *                     type: string
 *                     example: 507f1f77bcf86cd799439011
 *                   parkedAt:
 *                     type: string
 *                     format: date-time
 *                     example: '2023-05-01T10:00:00Z'
 *       401:
 *         description: Unauthorized
 */
router.get('/incoming', verifyToken, getIncomingCars);
/**
 * @swagger
 * /api/parking/{id}:
 *   get:
 *     summary: Get parking info and available slots by parking ID
 *     tags: [Parking]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Parking lot ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Parking lot information with available slots
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: 507f1f77bcf86cd799439011
 *                 name:
 *                   type: string
 *                   example: Central Parking
 *                 location:
 *                   type: string
 *                   example: Downtown
 *                 totalSlots:
 *                   type: integer
 *                   example: 50
 *                 slotsLeft:
 *                   type: integer
 *                   example: 15
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Parking lot not found
 */
router.get('/:id', verifyToken, getParkingWithSlotsLeft);
/**
 * @swagger
 * /api/parking/outgoing:
 *   get:
 *     summary: Get outgoing cars and total amount charged between two dates (Admin only)
 *     tags: [Parking]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: start
 *         required: true
 *         description: Start date (YYYY-MM-DD)
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: end
 *         required: true
 *         description: End date (YYYY-MM-DD)
 *         schema:
 *           type: string
 *           format: date
 *     responses:
 *       200:
 *         description: List of outgoing cars and total payment in date range
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 outgoingCars:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       bookingId:
 *                         type: string
 *                         example: 507f1f77bcf86cd799439011
 *                       plateNumber:
 *                         type: string
 *                         example: ABC123
 *                       exitedAt:
 *                         type: string
 *                         format: date-time
 *                         example: '2023-05-01T15:00:00Z'
 *                       totalPayment:
 *                         type: number
 *                         format: float
 *                         example: 25.0
 *                 totalAmount:
 *                   type: number
 *                   format: float
 *                   example: 250.0
 *       400:
 *         description: Missing or invalid date parameters
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (admin only)
 */
router.get('/outgoing', verifyToken, verifyAdmin, getOutgoingCarsWithTotalAmount);

/**
 * @swagger
 * /api/parking/bill/{bookingId}:
 *   get:
 *     summary: Generate bill for a booking
 *     tags: [Parking]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: bookingId
 *         required: true
 *         description: Booking ID for which to generate the bill
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Bill details for the booking
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 bookingId:
 *                   type: string
 *                   example: 507f1f77bcf86cd799439011
 *                 plateNumber:
 *                   type: string
 *                   example: ABC123
 *                 totalPayment:
 *                   type: number
 *                   format: float
 *                   example: 20.5
 *                 paymentDate:
 *                   type: string
 *                   format: date-time
 *                   example: '2023-05-01T15:00:00Z'
 *       401:
 *         description: Unauthorized
 */
router.get('/bill/:bookingId', verifyToken, generateBill);

module.exports = router;
