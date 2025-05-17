const express = require('express');
const {
  createBooking,
  getAllBookings,
  updateBookingStatus,
  getBookingsByPlateNumber
} = require('../controllers/BookingController');
const { verifyToken, verifyAdmin } = require('../middleware/auth'); // assuming you have these middlewares

const router = express.Router();

// Public route - anyone can create a booking
router.post('/createBooking', createBooking);

// Protected routes - require login
router.use(verifyToken);

// Admin-only routes
router.get('/getAllBookings', verifyAdmin, getAllBookings);

router.patch(':id/status', verifyAdmin, updateBookingStatus);

router.get('/search', verifyAdmin, getBookingsByPlateNumber); 

module.exports = router;
