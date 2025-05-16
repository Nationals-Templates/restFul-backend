const { PrismaClient } = require('../generated/prisma')
const prisma = new PrismaClient();

// Create a booking (public - no auth)
const createBooking = async (req, res) => {
  const { fullName, email, phone, plateNumber, bookingDate, userId } = req.body;

  if (!fullName || !email || !phone || !plateNumber || !bookingDate) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const booking = await prisma.booking.create({
      data: {
        fullName,
        email,
        phone,
        plateNumber,
        bookingDate: new Date(bookingDate),
        userId: userId
      }
    });

    res.status(201).json(booking);
  } catch (error) {
    console.error('Create booking error:', error);
    res.status(500).json({ error: 'Failed to create booking' });
  }
};

// (Optional) Get all bookings
const getAllBookings = async (req, res) => {
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
const updateBookingStatus = async (req, res) => {
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
  

module.exports = {
  createBooking,
  getAllBookings,
  updateBookingStatus
};
