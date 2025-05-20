const express = require('express');
const router = express.Router();

const {
  createBooking,
  exitBooking,
  getAllBookings,
  getBookingsBetweenDates,
  getCompletedBookingsSummary
} = require('../controllers/BookingController');

const { verifyToken, verifyAdmin } = require('../middleware/auth');

/**
 * @swagger
 * tags:
 *   name: Bookings
 *   description: Vehicle parking booking management
 */

/**
 * @swagger
 * /api/booking/create:
 *   post:
 *     summary: Create a new booking
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       description: Booking details
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BookingInput'
 *     responses:
 *       201:
 *         description: Booking created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Booking'
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized access
 */
router.post('/create', verifyToken, createBooking);

/**
 * @swagger
 * /api/booking/all:
 *   get:
 *     summary: Retrieve all bookings (admin only)
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Array of bookings
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Booking'
 *       401:
 *         description: Unauthorized access
 *       403:
 *         description: Forbidden (admin only)
 */
router.get('/all', verifyToken, verifyAdmin, getAllBookings);

/**
 * @swagger
 * /api/booking/{bookingId}/exit:
 *   patch:
 *     summary: Mark booking as exited and calculate payment (admin only)
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: bookingId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the booking
 *     responses:
 *       200:
 *         description: Booking exited with payment calculated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Booking'
 *       400:
 *         description: Invalid booking ID or booking already exited
 *       401:
 *         description: Unauthorized access
 *       403:
 *         description: Forbidden (admin only)
 */
router.patch('/:bookingId/exit', verifyToken, verifyAdmin, exitBooking);

/**
 * @swagger
 * /api/booking/range:
 *   get:
 *     summary: Get bookings between two dates (admin only)
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: from
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date (YYYY-MM-DD)
 *       - in: query
 *         name: to
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: End date (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: List of bookings within date range
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Booking'
 *       400:
 *         description: Missing or invalid date parameters
 *       401:
 *         description: Unauthorized access
 *       403:
 *         description: Forbidden (admin only)
 */
router.get('/range', verifyToken, verifyAdmin, getBookingsBetweenDates);

/**
 * @swagger
 * /api/booking/completed-summary:
 *   get:
 *     summary: Get completed bookings summary and total payments (admin only)
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: from
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date (YYYY-MM-DD)
 *       - in: query
 *         name: to
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: End date (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: Summary with total completed bookings and payments
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalBookings:
 *                   type: integer
 *                   example: 10
 *                 totalPayment:
 *                   type: number
 *                   format: float
 *                   example: 500.0
 *       400:
 *         description: Invalid or missing date parameters
 *       401:
 *         description: Unauthorized access
 *       403:
 *         description: Forbidden (admin only)
 */
router.get('/completed-summary', verifyToken, verifyAdmin, getCompletedBookingsSummary);

module.exports = router;
