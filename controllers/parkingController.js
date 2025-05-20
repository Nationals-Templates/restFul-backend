const { PrismaClient } = require('../generated/prisma');
const prisma = new PrismaClient();

// Create Parking - Admin only
exports.createParking = async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Admin only' });

  const { parkingCode, parkingName, availableSlots, location, feePerHour } = req.body;

  try {
    const parking = await prisma.parking.create({
      data: { parkingCode, parkingName, availableSlots, location, feePerHour }
    });
    res.status(201).json(parking);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create parking lot' });
  }
};

// Get Parking info + slots left (cars currently parked)
exports.getParkingWithSlotsLeft = async (req, res) => {
  const { id } = req.params;

  try {
    const parking = await prisma.parking.findUnique({
      where: { id: parseInt(id) },
      include: {
        bookings: {
          where: { exitTime: null }
        }
      }
    });

    if (!parking) return res.status(404).json({ error: 'Parking not found' });

    const slotsOccupied = parking.bookings.length;
    const slotsLeft = parking.availableSlots - slotsOccupied;

    res.json({
      parkingCode: parking.parkingCode,
      parkingName: parking.parkingName,
      location: parking.location,
      availableSlots: parking.availableSlots,
      slotsOccupied,
      slotsLeft,
      feePerHour: parking.feePerHour
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching parking info' });
  }
};

// Mark Car Exit & Calculate Payment
exports.markCarExit = async (req, res) => {
  const { bookingId } = req.params;

  try {
    const booking = await prisma.booking.findUnique({
      where: { id: parseInt(bookingId) },
      include: { parking: true }
    });

    if (!booking) return res.status(404).json({ error: 'Booking not found' });
    if (booking.exitTime !== null) return res.status(400).json({ error: 'Car already exited' });

    const exitTime = new Date();
    const durationMs = exitTime - booking.entryTime;
    const durationHours = Math.ceil(durationMs / (1000 * 60 * 60));

    const amountCharged = durationHours * booking.parking.feePerHour;

    // Update booking exitTime and status
    const updatedBooking = await prisma.booking.update({
      where: { id: booking.id },
      data: {
        exitTime,
        status: 'completed'
      }
    });

    // Create payment record
    await prisma.payment.create({
      data: {
        bookingId: booking.id,
        amount: amountCharged
      }
    });

    res.json({
      message: 'Car exit recorded',
      durationHours,
      amountCharged,
      booking: updatedBooking
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to record exit' });
  }
};

// Get Incoming Cars (cars currently parked)
exports.getIncomingCars = async (req, res) => {
    try {
      const incoming = await prisma.booking.findMany({
        where: { exitTime: null },
        include: { parking: true, user: true },
        orderBy: { entryTime: 'desc' }
      });
      res.json(incoming);
    } catch (error) {
      console.error("Error in getIncomingCars:", error);
      res.status(500).json({ error: 'Error fetching parking info' });
    }
  };
  

// Get Outgoing Cars & Total Amount Charged between two dates
exports.getOutgoingCarsWithTotalAmount = async (req, res) => {
  const { start, end } = req.query;
  if (!start || !end) return res.status(400).json({ error: 'Start and end query parameters required' });

  const startDate = new Date(start);
  const endDate = new Date(end);

  try {
    const outgoing = await prisma.booking.findMany({
      where: {
        exitTime: {
          gte: startDate,
          lte: endDate
        },
        NOT: { exitTime: null }
      },
      include: { parking: true, payment: true },
      orderBy: { exitTime: 'desc' }
    });

    const totalAmount = outgoing.reduce((sum, b) => sum + (b.payment?.amount ?? 0), 0);

    res.json({ outgoing, totalAmount });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch outgoing cars' });
  }
};

// Generate Bill for a Booking
exports.generateBill = async (req, res) => {
  const { bookingId } = req.params;

  try {
    const booking = await prisma.booking.findUnique({
      where: { id: parseInt(bookingId) },
      include: { parking: true, payment: true }
    });

    if (!booking) return res.status(404).json({ error: 'Booking not found' });
    if (!booking.exitTime) return res.status(400).json({ error: 'Car has not exited yet' });

    const durationMs = booking.exitTime - booking.entryTime;
    const durationHours = Math.ceil(durationMs / (1000 * 60 * 60));
    const amountCharged = booking.payment?.amount ?? (durationHours * booking.parking.feePerHour);

    res.json({
      plateNumber: booking.plateNumber,
      parkingName: booking.parking.parkingName,
      entryTime: booking.entryTime,
      exitTime: booking.exitTime,
      durationHours,
      amountCharged
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to generate bill' });
  }
};

// module.exports = {
//   createParking,
//   getParkingWithSlotsLeft,
//   markCarExit,
//   getIncomingCars,
//   getOutgoingCarsWithTotalAmount,
//   generateBill
// };
