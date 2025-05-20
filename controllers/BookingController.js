const { PrismaClient } = require('../generated/prisma');
const prisma = new PrismaClient();

const { differenceInHours } = require('date-fns');

// User books a parking slot
exports.createBooking = async (req, res) => {
  try {
    const { fullName, email, phone, plateNumber, parkingId, exitTime } = req.body;

    const booking = await prisma.booking.create({
      data: {
        fullName,
        email,
        phone,
        plateNumber,
        entryTime: new Date(),
        userId: req.user.id,
        parkingId: parkingId ? Number(parkingId) : null, 
        exitTime: null
      }
    });

    res.status(201).json(booking);
  } catch (err) {
    console.error('Error creating booking:', err);
    res.status(500).json({ error: 'Server error creating booking.' });
  }
};

// Admin sets exit time and calculates fee
exports.exitBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;

    const booking = await prisma.booking.findUnique({
      where: { id: parseInt(bookingId) },
      include: { parking: true }
    });

    if (!booking) return res.status(404).json({ error: 'Booking not found' });

    if (booking.exitTime) return res.status(400).json({ error: 'Car has already exited' });

    const exitTime = new Date();
    const durationInHours = Math.max(1, differenceInHours(exitTime, booking.entryTime));
    const amount = durationInHours * booking.parking.feePerHour;

    const updatedBooking = await prisma.booking.update({
      where: { id: booking.id },
      data: {
        exitTime,
        status: 'completed',
        payment: {
          create: { amount }
        }
      },
      include: { payment: true }
    });

    res.json({
      message: 'Car exited successfully.',
      durationInHours,
      totalAmount: amount,
      booking: updatedBooking
    });
  } catch (err) {
    console.error('Error during exit:', err);
    res.status(500).json({ error: 'Server error during exit.' });
  }
};

// Get bookings between two dates
exports.getBookingsBetweenDates = async (req, res) => {
  try {
    const { from, to } = req.query;

    const fromDate = new Date(from);
    const toDate = new Date(to);

    const bookings = await prisma.booking.findMany({
      where: {
        entryTime: {
          gte: fromDate,
          lte: toDate
        }
      },
      include: {
        user: true,
        parking: true,
        payment: true
      }
    });

    res.json(bookings);
  } catch (err) {
    console.error('Error fetching bookings by date:', err);
    res.status(500).json({ error: 'Server error fetching bookings.' });
  }
};

// Get completed bookings (exits) + total amount within a date range
exports.getCompletedBookingsSummary = async (req, res) => {
  try {
    const { from, to } = req.query;
    const fromDate = new Date(from);
    const toDate = new Date(to);

    const bookings = await prisma.booking.findMany({
      where: {
        status: 'completed',
        exitTime: {
          gte: fromDate,
          lte: toDate
        }
      },
      include: { payment: true }
    });

    const totalAmount = bookings.reduce((sum, b) => sum + (b.payment?.amount || 0), 0);

    res.json({ totalAmount, bookings });
  } catch (err) {
    console.error('Error summarizing bookings:', err);
    res.status(500).json({ error: 'Server error summarizing exits.' });
  }
};

// Get all bookings (added implementation)
exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await prisma.booking.findMany({
      include: {
        user: true,
        parking: true,
        payment: true
      },
      orderBy: {
        entryTime: 'desc'
      }
    });
    res.json(bookings);
  } catch (err) {
    console.error('Error fetching all bookings:', err);
    res.status(500).json({ error: 'Server error fetching bookings.' });
  }
};

// module.exports = {
//   createBooking,
//   exitBooking,
//   getBookingsBetweenDates,
//   getCompletedBookingsSummary,
//   getAllBookings
// };
