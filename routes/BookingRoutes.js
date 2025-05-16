const express = require('express');
const { createBooking, getAllBookings, updateBookingStatus } = require('../controllers/BookingController');

const router = express.Router();

-
router.post('/createBooking', createBooking);

// (Optional) Get all bookings - you can protect this if needed
router.get('/getAllBookings', getAllBookings);

router.patch('/:id/status', updateBookingStatus);

module.exports = router;
