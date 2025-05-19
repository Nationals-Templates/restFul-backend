const { PrismaClient } = require('../generated/prisma');
const prisma = new PrismaClient();



// Helper to check authentication (added)
const ensureAuthenticated = (req, res) => {
  if (!req.user) {
    res.status(401).json({ error: 'Unauthorized: please log in' });
    return false;
  }
  return true;
};

const deleteBooking = async (req, res) => {
  const id = req.params.id;
  try {
    const booking = await prisma.booking.findUnique({
      where: { id: parseInt(id) }
    })
    if (!booking) return res.status(404).json({ message: "Booking not found!" })
    await prisma.booking.delete({
      where: { id: parseInt(id) }
    })
    return res.status(200).json({ message: "Booking deleted successfully" })
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" })
  }
}

// Create a booking (public - no auth) - no change here
const createBooking = async (req, res) => {
  const { fullName, email, phone, plateNumber, entryTime, exitTime, userId } = req.body;

  if (!fullName || !email || !phone || !plateNumber || !entryTime || !exitTime) {
    return res.status(400).json({ error: 'Missing fields' });
  }

  try {
    // Get today's date in YYYY-MM-DD format
    const today = new Date().toISOString().split('T')[0];

    // Convert entry and exit times to Date objects
    const entryDateTime = new Date(`${today}T${entryTime}:00Z`);
    const exitDateTime = new Date(`${today}T${exitTime}:00Z`);

    if (isNaN(entryDateTime) || isNaN(exitDateTime)) {
      return res.status(400).json({ error: 'Invalid time format' });
    }

    // Calculate duration in hours
    const durationInMs = exitDateTime - entryDateTime;

    if (durationInMs <= 0) {
      return res.status(400).json({ error: 'Exit time must be after entry time' });
    }

    const durationInHours = Math.ceil(durationInMs / (1000 * 60 * 60)); // Round up to nearest hour
    const amount = durationInHours * 500;

    // Create booking
    const booking = await prisma.booking.create({
      data: {
        fullName,
        email,
        phone,
        plateNumber,
        entryTime: entryDateTime,
        exitTime: exitDateTime,
        userId: userId
      }
    });

    // Create payment
    await prisma.payment.create({
      data: {
        bookingId: booking.id,
        amount: amount
      }
    });

    res.status(201).json({ booking, amount });
  } catch (error) {
    console.error('Create booking error:', error);
    res.status(500).json({ error: error.message });
  }
};





// Get all bookings (protected, admin only)
const getAllBookings = async (req, res) => {
  if (!ensureAuthenticated(req, res)) return; // Auth check added

  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Forbidden: admins only' });
  }

  try {
    const bookings = await prisma.booking.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(bookings);
  } catch (error) {
    console.error('Fetch bookings error:', error);
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
};



// Update booking status (admin only)
const updateBookingStatus = async (req, res) => {
  if (!ensureAuthenticated(req, res)) return; // Auth check added

  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Forbidden: admins only' });
  }

  const { id } = req.params;
  const { status } = req.body;

  if (!['accepted', 'rejected'].includes(status)) {
    return res.status(400).json({ error: 'Status must be accepted or rejected' });
  }

  try {
    const updated = await prisma.booking.update({
      where: { id: parseInt(id) },
      data: { status }
    });

    res.json(updated);
  } catch (error) {
    console.error('Update status error:', error);
    res.status(500).json({ error: 'Failed to update booking status' });
  }
};


// New: Search bookings by plate number (admin only)
const getBookingsByPlateNumber = async (req, res) => {
  if (!ensureAuthenticated(req, res)) return; // Auth check added

  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Forbidden: admins only' });
  }

  const { plateNumber } = req.query;

  if (!plateNumber) {
    return res.status(400).json({ error: 'plateNumber query parameter is required' });
  }

  try {
    const bookings = await prisma.booking.findMany({
      where: {
        plateNumber: {
          contains: plateNumber,
          mode: 'insensitive'
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(bookings);
  } catch (error) {
    console.error('Search bookings error:', error);
    res.status(500).json({ error: 'Failed to search bookings' });
  }
};

module.exports = {
  createBooking,
  getAllBookings,
  updateBookingStatus,
  getBookingsByPlateNumber, // exported new search function
  deleteBooking
};
